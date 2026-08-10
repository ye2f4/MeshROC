import React, { useState, useEffect, useRef, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { supabase } from '@site/src/supabase/supabaseClient';
import { MrPage, MrHeader, MrSection } from '@site/src/components/mr';

const FETCH_TIMEOUT = 8000;

// 瓦片源配置（与 my-forum visit-map 一致，优先高德保证国内可显示）
const TILE_PROVIDERS = [
  { name: '高德地图', url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', subdomains: ['1', '2', '3', '4'], attribution: '&copy; 高德地图', maxZoom: 18, minZoom: 3 },
  { name: 'OpenStreetMap', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19, minZoom: 0 },
  { name: 'CartoDB', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://carto.com/">CartoDB</a>', maxZoom: 19, minZoom: 0 },
  // 卫星影像源
  { name: '高德卫星', url: 'https://webst0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}', subdomains: ['1', '2', '3', '4'], attribution: '&copy; 高德地图', maxZoom: 18, minZoom: 3 },
  { name: 'Esri 卫星', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics', maxZoom: 18, minZoom: 0 },
];
const providerMinZoom = (p) => (typeof p.minZoom === 'number' ? p.minZoom : (p.name && p.name.includes('高德') ? 3 : 0));
const providerMaxZoom = (p) => p.maxZoom || 18;

const DEVICE_ROLES = ['客户端节点', '路由器', '中继节点', '传感器节点', '网关', 'MQTT 桥接'];

/* ============ 节点地图核心（复用 visit-map 的 Leaflet 加载与瓦片逻辑）============ */
function NodeMapCore() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const arrowLayerRef = useRef(null);
  const tempMarkerLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const LRef = useRef(null);
  const lastSigRef = useRef('');
  const selectedRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProvider, setActiveProvider] = useState(0);
  const [mapReady, setMapReady] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [picking, setPicking] = useState(false);

  /* ---------- 数据加载（复用 visit-map 的超时与错误处理） ---------- */
  const fetchWithTimeout = useCallback(async (queryFn) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时，请检查网络连接')), FETCH_TIMEOUT)
    );
    return Promise.race([queryFn(), timeout]);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [nRes, lRes] = await Promise.all([
        fetchWithTimeout(() => supabase.from('mesh_nodes').select('*').order('created_at', { ascending: false }).limit(1000)),
        fetchWithTimeout(() => supabase.from('mesh_node_links').select('id,from_node,to_node')),
      ]);
      if (nRes.error) throw nRes.error;
      if (lRes.error) throw lRes.error;
      setNodes(nRes.data || []);
      setLinks(lRes.data || []);
      setError(null);
    } catch (e) {
      console.error('加载节点数据失败', e);
      if (e.message && e.message.includes('does not exist')) {
        setError('数据库表未创建，请在 Supabase 控制台执行 supabase/mesh-nodes.sql');
      } else if (e.message && e.message.includes('PGRST')) {
        setError('数据库访问受限，请检查 Supabase RLS 策略');
      } else {
        setError('数据加载失败: ' + (e.message || e));
      }
    } finally {
      setLoading(false);
    }
  }, [fetchWithTimeout]);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 30000);
    return () => clearInterval(timer);
  }, [loadData]);

  /* ---------- 瓦片源切换（复用 visit-map） ---------- */
  const switchProvider = useCallback((index) => {
    const L = LRef.current;
    const map = mapInstanceRef.current;
    if (!L || !map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    const provider = TILE_PROVIDERS[index];
    const minZ = providerMinZoom(provider);
    const maxZ = providerMaxZoom(provider);
    map.setMinZoom(minZ);
    map.setMaxZoom(maxZ);
    if (map.getZoom() < minZ || map.getZoom() > maxZ) {
      map.setZoom(Math.min(Math.max(map.getZoom(), minZ), maxZ));
    }
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      minZoom: minZ,
      maxZoom: maxZ,
      ...(provider.subdomains ? { subdomains: provider.subdomains } : {}),
    });
    tileLayer.on('tileerror', () => {
      if (tileLayerRef.current === tileLayer) setError('当前地图源加载困难，请尝试切换其他地图源');
    });
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
    setActiveProvider(index);
    setError(null);
    setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 50);
  }, []);

  /* ---------- 加载 Leaflet（仅浏览器端） ---------- */
  const [leafletReady, setLeafletReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        if (cancelled) return;
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
        LRef.current = L;
        setLeafletReady(true);
      } catch (e) {
        console.error('加载 Leaflet 失败:', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ---------- 初始化地图 ---------- */
  useEffect(() => {
    const L = LRef.current;
    if (!leafletReady || !mapRef.current || mapInstanceRef.current || !L) return;
    const map = L.map(mapRef.current, {
      center: [30, 105],
      zoom: 4,
      minZoom: providerMinZoom(TILE_PROVIDERS[0]),
      maxZoom: providerMaxZoom(TILE_PROVIDERS[0]),
      worldCopyJump: true,
    });
    markersLayerRef.current = L.layerGroup().addTo(map);
    arrowLayerRef.current = L.layerGroup().addTo(map);
    tempMarkerLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    setMapReady(true);

    const fixSize = () => { try { map.invalidateSize(); } catch (e) {} };
    setTimeout(() => { switchProvider(0); fixSize(); }, 300);
    requestAnimationFrame(fixSize);
    window.addEventListener('resize', fixSize);

    // 点击空白：选点模式下落点并回填表单；否则取消选中、清除箭头
    map.on('click', (e) => {
      if (pickingRef.current) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        setAddForm((f) => ({ ...f, latitude: lat, longitude: lng }));
        drawTempMarker(e.latlng.lat, e.latlng.lng);
        setPicking(false);
        setShowAdd(true);
        return;
      }
      clearSelection();
    });

    return () => {
      window.removeEventListener('resize', fixSize);
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady]);

  /* ---------- 渲染标记 ---------- */
  const drawTempMarker = useCallback((lat, lng) => {
    const L = LRef.current;
    if (!L || !tempMarkerLayerRef.current) return;
    tempMarkerLayerRef.current.clearLayers();
    L.marker([lat, lng], {
      icon: L.divIcon({ className: '', html: '<div style="width:16px;height:16px;background:#f59e0b;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }),
    }).addTo(tempMarkerLayerRef.current);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNode(null);
    selectedRef.current = null;
    if (arrowLayerRef.current) arrowLayerRef.current.clearLayers();
  }, []);

  // 选中某节点时，画出指向其可通联节点的箭头
  const drawArrows = useCallback((centerId) => {
    const L = LRef.current;
    if (!L || !arrowLayerRef.current) return;
    arrowLayerRef.current.clearLayers();
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const center = byId[centerId];
    if (!center) return;
    const lat1 = Number(center.latitude);
    const lng1 = Number(center.longitude);
    if (!isFinite(lat1) || !isFinite(lng1)) return;
    links
      .filter((l) => l.from_node === centerId || l.to_node === centerId)
      .forEach((l) => {
        const otherId = l.from_node === centerId ? l.to_node : l.from_node;
        const other = byId[otherId];
        if (!other) return;
        const lat2 = Number(other.latitude);
        const lng2 = Number(other.longitude);
        if (!isFinite(lat2) || !isFinite(lng2)) return;
        const p1 = [lat1, lng1];
        const p2 = [lat2, lng2];
        // 连线（橙色虚线）
        L.polyline([p1, p2], { color: '#f59e0b', weight: 3, dashArray: '6 4', opacity: 0.9 }).addTo(arrowLayerRef.current);
        // 箭头头部放在靠近目标节点处（约 82% 处），明确指向它
        const t = 0.82;
        const midLat = lat1 + (lat2 - lat1) * t;
        const midLng = lng1 + (lng2 - lng1) * t;
        const angleDeg = (Math.atan2(-(lat2 - lat1), lng2 - lng1) * 180) / Math.PI;
        const svg = `<svg width="24" height="24" viewBox="0 0 24 24" style="transform:rotate(${angleDeg}deg);filter:drop-shadow(0 0 2px #fff)"><path d="M5 5 L19 12 L5 19 L9 12 Z" fill="#f59e0b" stroke="#fff" stroke-width="1.2"/></svg>`;
        const arrowIcon = L.divIcon({
          className: '',
          html: svg,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        L.marker([midLat, midLng], { icon: arrowIcon, interactive: false }).addTo(arrowLayerRef.current);
      });
  }, [nodes, links]);

  // 选中节点后，links 变化（如设置可通联）时实时重绘箭头
  useEffect(() => {
    if (selectedNode) drawArrows(selectedNode.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links, selectedNode]);

  useEffect(() => {
    const L = LRef.current;
    if (!mapInstanceRef.current || !markersLayerRef.current || !L) return;
    const sig = nodes.map((n) => `${n.id}:${n.latitude},${n.longitude}:${n.supports_mqtt}:${n.name}`).join('|');
    if (sig === lastSigRef.current) return;
    lastSigRef.current = sig;
    markersLayerRef.current.clearLayers();
    if (nodes.length === 0) return;

    const bounds = L.latLngBounds([]);
    nodes.forEach((n) => {
      if (!n.latitude || !n.longitude) return;
      const latLng = [n.latitude, n.longitude];
      bounds.extend(latLng);
      const color = n.supports_mqtt ? '#16a34a' : '#2563eb';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
      });
      const marker = L.marker(latLng, { icon }).addTo(markersLayerRef.current);
      const detail = `
        <div style="font-family:system-ui;min-width:200px;font-size:13px;">
          <div style="font-size:15px;font-weight:600;margin-bottom:4px;">
            ${n.supports_mqtt ? '🟢' : '🔵'} ${n.name || '未命名节点'}
            ${n.short_name ? ` <span style="color:#888;font-size:12px;">(${n.short_name})</span>` : ''}
          </div>
          ${n.hardware_model ? `<div style="color:#555;">硬件：${n.hardware_model}</div>` : ''}
          ${n.role ? `<div style="color:#555;">角色：${n.role}</div>` : ''}
          <div style="color:#666;font-size:11px;margin-top:2px;">
            ${n.altitude_type === 'floor' ? '楼层' : '海拔'}：${n.altitude_value}${n.altitude_type === 'floor' ? ' 层' : ' m'}
            ${n.antenna_gain ? ` · 天线 ${n.antenna_gain} dBi` : ''}
            ${n.battery_capacity ? ` · 电池 ${n.battery_capacity} mAh` : ''}
          </div>
          ${n.supports_mqtt ? '<div style="color:#16a34a;font-size:11px;margin-top:2px;">已接入 MQTT 网关</div>' : ''}
        </div>`;
      marker.bindPopup(detail, { maxWidth: 300 });
      marker.on('click', () => {
        setSelectedNode(n);
        selectedRef.current = n.id;
        drawArrows(n.id);
      });
    });
  }, [nodes, drawArrows]);

  /* ---------- 添加节点表单 ---------- */
  const [addForm, setAddForm] = useState({
    name: '', short_name: '', hardware_model: '', role: DEVICE_ROLES[0],
    altitude_type: 'meter', altitude_value: '', antenna_gain: '', battery_capacity: '',
    supports_mqtt: false, latitude: '', longitude: '',
  });
  const addFormRef = useRef(addForm);
  const pickingRef = useRef(false);
  useEffect(() => { addFormRef.current = addForm; }, [addForm]);
  useEffect(() => { pickingRef.current = picking; }, [picking]);

  const resetAddForm = () => {
    setAddForm({
      name: '', short_name: '', hardware_model: '', role: DEVICE_ROLES[0],
      altitude_type: 'meter', altitude_value: '', antenna_gain: '', battery_capacity: '',
      supports_mqtt: false, latitude: '', longitude: '',
    });
    if (tempMarkerLayerRef.current) tempMarkerLayerRef.current.clearLayers();
    setPicking(false);
  };

  const submitAdd = async () => {
    if (!addForm.name.trim()) { alert('请填写节点名称'); return; }
    const lat = parseFloat(addForm.latitude);
    const lng = parseFloat(addForm.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) { alert('请设置节点位置（经纬度或在地图上选点）'); return; }
    const payload = {
      name: addForm.name.trim(),
      short_name: addForm.short_name.trim() || null,
      hardware_model: addForm.hardware_model.trim() || null,
      role: addForm.role,
      altitude_type: addForm.altitude_type,
      altitude_value: parseFloat(addForm.altitude_value) || 0,
      antenna_gain: parseFloat(addForm.antenna_gain) || 0,
      battery_capacity: parseFloat(addForm.battery_capacity) || 0,
      supports_mqtt: !!addForm.supports_mqtt,
      latitude: lat,
      longitude: lng,
    };
    const { error: insErr } = await supabase.from('mesh_nodes').insert([payload]);
    if (insErr) {
      alert('保存失败：' + insErr.message);
      return;
    }
    setShowAdd(false);
    resetAddForm();
    loadData();
  };

  /* ---------- 可通联节点设置 ---------- */
  const [linkSource, setLinkSource] = useState('');
  const linkedTargetIds = (srcId) =>
    new Set(
      links
        .filter((l) => l.from_node === srcId || l.to_node === srcId)
        .map((l) => (l.from_node === srcId ? l.to_node : l.from_node))
    );

  const toggleLink = async (srcId, targetId, on) => {
    if (srcId === targetId) return;
    if (on) {
      await supabase.from('mesh_node_links').upsert(
        { from_node: srcId, to_node: targetId },
        { onConflict: 'from_node,to_node' }
      );
    } else {
      await supabase
        .from('mesh_node_links')
        .delete()
        .or(`and(from_node.eq.${srcId},to_node.eq.${targetId}),and(from_node.eq.${targetId},to_node.eq.${srcId})`);
    }
    loadData();
  };

  const mqttCount = nodes.filter((n) => n.supports_mqtt).length;

  const statCard = (val, label, color) => (
    <div style={statCardStyle}>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
      <div style={{ fontSize: 11, color: '#999' }}>{label}</div>
    </div>
  );
  const statCardStyle = {
    background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '10px 14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center', minWidth: '90px', flex: 1,
  };

  const field = { width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: 13, boxSizing: 'border-box' };
  const labelS = { display: 'block', fontSize: 12, color: '#555', margin: '10px 0 4px', fontWeight: 600 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`
        .nm-modal-mask{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:16px}
        .nm-modal{background:#fff;border-radius:16px;max-width:480px;width:100%;max-height:88vh;overflow:auto;padding:20px 22px;box-shadow:0 12px 40px rgba(0,0,0,.25)}
        .nm-modal h3{margin:0 0 4px;font-size:18px}
        .nm-row{display:flex;gap:10px}.nm-row>*{flex:1}
        .nm-btn{padding:8px 16px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;cursor:pointer;font-size:13px;color:#334155}
        .nm-btn--primary{background:#2563eb;border-color:#2563eb;color:#fff;font-weight:600}
        .nm-btn--amber{background:#f59e0b;border-color:#f59e0b;color:#fff;font-weight:600}
        .nm-linkitem{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;font-size:13px}
        .nm-linkitem:hover{background:#f1f5f9}
      `}</style>

      {/* 工具栏 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {statCard(nodes.length, '节点总数', '#2563eb')}
          {statCard(mqttCount, 'MQTT 节点', '#16a34a')}
          {statCard(links.length, '可通联关系', '#f59e0b')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="nm-btn nm-btn--primary" onClick={() => { resetAddForm(); setShowAdd(true); }}>＋ 添加节点</button>
          <button className="nm-btn nm-btn--amber" onClick={() => setShowLinks(true)} disabled={nodes.length < 2}>🔗 可通联节点设置</button>
          <button className="nm-btn" onClick={loadData}>🔄 刷新</button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fff3cd', borderRadius: 10, color: '#856404', border: '1px solid #ffc107', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span><strong>⚠️ {error}</strong></span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TILE_PROVIDERS.map((p, i) => (
              <button key={p.name} onClick={() => switchProvider(i)} className="nm-btn">{p.name}</button>
            ))}
          </div>
        </div>
      )}

      {loading && !error && (
        <div style={{ textAlign: 'center', color: '#999', fontSize: 14, padding: 8 }}>地图数据加载中…</div>
      )}

      {/* 地图容器 */}
      <div style={{ height: '68vh', minHeight: 420, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.1)', border: '1px solid #e5e7eb', background: '#f0f4f8', position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {mapReady && (
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 4 }}>
            {TILE_PROVIDERS.map((p, i) => (
              <button key={p.name} onClick={() => switchProvider(i)} className="nm-btn"
                style={{ padding: '4px 10px', fontSize: 11, background: activeProvider === i ? '#2563eb' : 'rgba(255,255,255,.9)', color: activeProvider === i ? '#fff' : '#555', border: '1px solid #ccc' }}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* 图例 */}
        <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, background: 'rgba(255,255,255,.95)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,.15)', fontSize: 11, color: '#555', display: 'flex', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb', border: '2px solid #fff' }}></span>普通节点</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a', border: '2px solid #fff' }}></span>MQTT 节点</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: '#f59e0b', fontSize: 14 }}>➤</span>可通联</span>
        </div>

        {!loading && nodes.length === 0 && (
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(255,255,255,.95)', borderRadius: 12, padding: '12px 24px', boxShadow: '0 2px 12px rgba(0,0,0,.1)', fontSize: 14, color: '#666' }}>
            📍 暂无节点，点击「添加节点」在地图上标记第一个 MeshROC 节点
          </div>
        )}
      </div>

      {selectedNode && (
        <div style={{ fontSize: 12, color: '#64748b' }}>
          已选中节点 <strong>{selectedNode.name}</strong>，地图已显示其可通联方向（箭头）。点击空白处取消。
        </div>
      )}

      {/* 选点模式提示条（不拦截地图点击，仅按钮可点） */}
      {picking && !showAdd && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 2100, pointerEvents: 'none', display: 'flex', gap: 10, alignItems: 'center', background: '#f59e0b', color: '#fff', padding: '8px 14px', borderRadius: 10, boxShadow: '0 4px 14px rgba(0,0,0,.2)', fontSize: 13 }}>
          <span>📍 点击地图以设置节点位置</span>
          <button onClick={() => setPicking(false)} style={{ pointerEvents: 'auto', background: '#fff', color: '#b45309', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>取消</button>
        </div>
      )}

      {/* 添加节点弹窗 */}
      {showAdd && (
        <div className="nm-modal-mask" onClick={() => { setShowAdd(false); resetAddForm(); }}>
          <div className="nm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>添加节点</h3>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 4px' }}>填写节点信息，并在地图上选点设置位置。</p>

            <label style={labelS}>节点名称 *</label>
            <input style={field} value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="例如：互联之域-中心站" />

            <label style={labelS}>节点简称</label>
            <input style={field} value={addForm.short_name} onChange={(e) => setAddForm((f) => ({ ...f, short_name: e.target.value }))} placeholder="例如：CENTER" />

            <div className="nm-row">
              <div>
                <label style={labelS}>硬件型号</label>
                <input style={field} value={addForm.hardware_model} onChange={(e) => setAddForm((f) => ({ ...f, hardware_model: e.target.value }))} placeholder="例如：Heltec V3" />
              </div>
              <div>
                <label style={labelS}>设备角色</label>
                <select style={field} value={addForm.role} onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}>
                  {DEVICE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="nm-row">
              <div>
                <label style={labelS}>海拔高度类型</label>
                <select style={field} value={addForm.altitude_type} onChange={(e) => setAddForm((f) => ({ ...f, altitude_type: e.target.value }))}>
                  <option value="meter">米</option>
                  <option value="floor">楼层</option>
                </select>
              </div>
              <div>
                <label style={labelS}>海拔高度数值</label>
                <input style={field} type="number" value={addForm.altitude_value} onChange={(e) => setAddForm((f) => ({ ...f, altitude_value: e.target.value }))} placeholder={addForm.altitude_type === 'floor' ? '楼层数' : '米'} />
              </div>
            </div>

            <div className="nm-row">
              <div>
                <label style={labelS}>天线增益 (dBi)</label>
                <input style={field} type="number" value={addForm.antenna_gain} onChange={(e) => setAddForm((f) => ({ ...f, antenna_gain: e.target.value }))} placeholder="例如：3" />
              </div>
              <div>
                <label style={labelS}>电池容量 (mAh)</label>
                <input style={field} type="number" value={addForm.battery_capacity} onChange={(e) => setAddForm((f) => ({ ...f, battery_capacity: e.target.value }))} placeholder="例如：3000" />
              </div>
            </div>

            <label style={{ ...labelS, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={addForm.supports_mqtt} onChange={(e) => setAddForm((f) => ({ ...f, supports_mqtt: e.target.checked }))} />
              支持 MQTT（绿色标记）
            </label>

            <label style={labelS}>节点位置（纬度 / 经度，或在地图上选点）</label>
            <div className="nm-row">
              <input style={field} type="number" step="any" value={addForm.latitude} onChange={(e) => setAddForm((f) => ({ ...f, latitude: e.target.value }))} placeholder="纬度" />
              <input style={field} type="number" step="any" value={addForm.longitude} onChange={(e) => setAddForm((f) => ({ ...f, longitude: e.target.value }))} placeholder="经度" />
            </div>
            <button className="nm-btn" style={{ marginTop: 8 }} onClick={() => { setPicking(true); setShowAdd(false); }}>
              📍 在地图上选点
            </button>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button className="nm-btn" onClick={() => { setShowAdd(false); resetAddForm(); }}>取消</button>
              <button className="nm-btn nm-btn--primary" onClick={submitAdd}>保存节点</button>
            </div>
          </div>
        </div>
      )}

      {/* 可通联节点设置弹窗 */}
      {showLinks && (
        <div className="nm-modal-mask" onClick={() => setShowLinks(false)}>
          <div className="nm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>可通联节点设置</h3>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>选择源节点，勾选其可直接通信的其它节点。设置后在地图中点击该节点会以箭头显示通联方向。</p>
            <label style={labelS}>源节点</label>
            <select style={field} value={linkSource} onChange={(e) => setLinkSource(e.target.value)}>
              <option value="">— 请选择 —</option>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.name}（{n.supports_mqtt ? 'MQTT' : '普通'}）</option>)}
            </select>

            {linkSource && (
              <div style={{ marginTop: 10, maxHeight: 300, overflow: 'auto' }}>
                {nodes.filter((n) => n.id !== linkSource).map((n) => {
                  const checked = linkedTargetIds(linkSource).has(n.id);
                  return (
                    <label key={n.id} className="nm-linkitem">
                      <input type="checkbox" checked={checked} onChange={(e) => toggleLink(linkSource, n.id, e.target.checked)} />
                      <span>{n.name}</span>
                      <span style={{ color: '#aaa', fontSize: 11 }}>{n.supports_mqtt ? '· MQTT' : ''}</span>
                    </label>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="nm-btn nm-btn--primary" onClick={() => setShowLinks(false)}>完成</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VisionPage() {
  return (
    <MrPage
      title="远景规划"
      description="MeshROC 远景规划：发展路线、里程碑与长期愿景，以及节点地图。"
    >
      <MrHeader
        eyebrow="Roadmap"
        title="远景规划"
        lead="规划 MeshROC 的发展路线与里程碑。下方节点地图用于共建社区 Mesh 网络拓扑——添加节点、设置通联关系，并直接存入 Supabase。"
      />
      <MrSection eyebrow="Node Map" title="社区节点地图">
        <BrowserOnly fallback={
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>地图加载中…</div>
        }>
          {() => <NodeMapCore />}
        </BrowserOnly>
      </MrSection>
    </MrPage>
  );
}
