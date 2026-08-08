import React, { useState } from 'react';
import { useMeshROCClient } from '@/lib/meshroc-device';
import {
  IconRadio, IconUsers, IconMessage, IconCpu, IconZap, IconNetwork, IconShield,
} from '@/components/mr';

const STATUS_TEXT: Record<string, string> = {
  idle: '未连接', connecting: '连接中…', connected: '已连接', ready: '就绪', error: '错误',
};

function hexId(n?: number): string {
  if (n === undefined || n === null) return '—';
  return '!' + n.toString(16);
}

export default function MeshROCClientApp() {
  const c = useMeshROCClient();
  const [text, setText] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [channelName, setChannelName] = useState('');

  const myNum = c.myInfo?.my_node_num;
  const ownerUser = c.owner || c.nodes.find((n) => n.num === myNum)?.user;
  const ready = c.status === 'ready';

  const send = () => {
    if (!text.trim()) return;
    c.sendText(text.trim());
    setText('');
  };

  return (
    <div className="mr-page">
      <div className="mr-wrap">
        <header className="mr-section__head mr-section__head--center">
          <div className="mr-eyebrow mr-eyebrow--orange">Web Client</div>
          <h1 className="mr-h2" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>MeshROC 网络客户端</h1>
          <p className="mr-lead">
            浏览器内直接连接你的 MeshROC 设备（兼容 Meshtastic 固件）：配置射频、管理节点、收发消息——
            无需安装任何软件。
          </p>
        </header>

        <div className="mrclient">
          {/* 左列：连接 / 信息 / 模板 / 设置 */}
          <div>
            <div className="mrclient__panel">
              <h3><IconRadio size={18} /> 设备连接</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span className={`mrclient__status mrclient__status--${c.status}`}>
                  <span className="dot" />{STATUS_TEXT[c.status]}
                </span>
                {c.status === 'idle' || c.status === 'error' ? (
                  <button className="mrclient__btn mrclient__btn--primary" onClick={c.connect}>连接设备</button>
                ) : (
                  <button className="mrclient__btn mrclient__btn--ghost" onClick={c.disconnect}>断开</button>
                )}
              </div>
              {c.error && <p className="mrclient__hint" style={{ color: 'hsl(var(--destructive))' }}>{c.error}</p>}
              <p className="mrclient__hint">
                通过 USB 把设备接入电脑，点击「连接设备」并在弹窗中选择串口。需 Chrome / Edge 桌面版，且通过 https 或 localhost 访问。
              </p>
            </div>

            {c.metadata && (
              <div className="mrclient__panel">
                <h3><IconCpu size={18} /> 设备信息</h3>
                <dl className="mrclient__kv">
                  <dt>固件版本</dt><dd>{c.metadata.firmware_version || '—'}</dd>
                  <dt>硬件型号</dt><dd>{c.hwModelName(c.metadata.hw_model)}</dd>
                  <dt>本机编号</dt><dd>{hexId(myNum)}</dd>
                  <dt>蓝牙 / WiFi</dt>
                  <dd>{c.metadata.hasBluetooth ? '支持' : '—'} / {c.metadata.hasWifi ? '支持' : '—'}</dd>
                </dl>
              </div>
            )}

            <div className="mrclient__panel">
              <h3><IconZap size={18} /> 全国地貌射频模板</h3>
              <p className="mrclient__hint" style={{ marginTop: 0, marginBottom: '0.7rem' }}>
                一键套用与官网一致的环境优化（统一 CN 频段）。修改会写入设备并立即生效。
              </p>
              <div className="mrclient__env">
                {c.envTemplates.map((t) => (
                  <button key={t.id} onClick={() => c.applyEnvTemplate(t.id)} disabled={!ready}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mrclient__panel">
              <h3><IconNetwork size={18} /> 本机设置</h3>
              <div className="mrclient__field">
                <label>设备名称（long name）</label>
                <div className="mrclient__row">
                  <input
                    className="mrclient__input"
                    value={ownerName}
                    placeholder={ownerUser?.long_name || ''}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                  <button
                    className="mrclient__btn mrclient__btn--primary"
                    onClick={() => c.setOwner(ownerName)}
                    disabled={!ownerName.trim() || !ready}
                  >保存</button>
                </div>
              </div>
              <div className="mrclient__field">
                <label>主信道名称</label>
                <div className="mrclient__row">
                  <input
                    className="mrclient__input"
                    value={channelName}
                    placeholder={c.channels[0]?.settings?.name || ''}
                    onChange={(e) => setChannelName(e.target.value)}
                  />
                  <button
                    className="mrclient__btn mrclient__btn--primary"
                    onClick={() => c.setChannelName(0, channelName)}
                    disabled={!channelName.trim() || !ready}
                  >保存</button>
                </div>
              </div>
            </div>
          </div>

          {/* 右列：消息 / 节点 / 日志 */}
          <div>
            <div className="mrclient__panel">
              <h3><IconMessage size={18} /> 消息</h3>
              <div className="mrclient__chat">
                <div className="mrclient__msgs">
                  {c.messages.length === 0 && (
                    <div className="mrclient__empty">还没有消息。连上设备后即可收发文本。</div>
                  )}
                  {c.messages.map((m, i) => {
                    const me = m.from === myNum;
                    const who = me
                      ? '我'
                      : (c.nodes.find((n) => n.num === m.from)?.user?.long_name || hexId(m.from));
                    return (
                      <div key={i} className={`mrclient__msg ${me ? 'mrclient__msg--me' : ''}`}>
                        <div className="who">{who}{m.channel ? ` · CH${m.channel}` : ''}</div>
                        <div>{m.text}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mrclient__composer">
                  <input
                    className="mrclient__input"
                    value={text}
                    placeholder="输入消息，回车发送"
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                    disabled={!ready}
                  />
                  <button className="mrclient__btn mrclient__btn--primary" onClick={send} disabled={!text.trim() || !ready}>
                    发送
                  </button>
                </div>
              </div>
            </div>

            <div className="mrclient__panel">
              <h3><IconUsers size={18} /> 网络节点（{c.nodes.length}）</h3>
              <div className="mrclient__nodes">
                {c.nodes.length === 0 && <div className="mrclient__empty">等待节点信息…</div>}
                {c.nodes.map((n) => (
                  <div key={n.num} className="mrclient__node">
                    <span className="name">
                      {n.user?.long_name || n.user?.short_name || hexId(n.num)}
                    </span>
                    <span className="meta">
                      {hexId(n.num)}
                      {n.hops_away !== undefined ? ` · ${n.hops_away}跳` : ''}
                      {n.snr !== undefined ? ` · SNR ${n.snr.toFixed(1)}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {c.logs.length > 0 && (
              <div className="mrclient__panel">
                <h3><IconShield size={18} /> 调试日志</h3>
                <div className="mrclient__logs">{c.logs.join('\n')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
