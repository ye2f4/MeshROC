import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconRoute,
  IconMountain,
  IconSun,
  IconRadio,
  IconCpu,
  IconShield,
  IconBattery,
  IconLayers,
} from '@site/src/components/mr';

const FEATURES = [
  {
    icon: IconRoute,
    title: '分层骨干路由系统',
    problem: '原版洪泛广播在节点增多后产生广播风暴，信道被无效重复报文占满。',
    solution:
      '引入骨干 / 终端分层角色：骨干节点承担转发职责，终端节点默认静默，并按信噪比自适应择优路径与跳数上限。',
  },
  {
    icon: IconMountain,
    title: '山地 NLOS 远距离优化',
    problem: '山地非视距环境下链路衰减剧烈，通用参数难以建立稳定连接。',
    solution:
      '针对山地地形重做链路预算与调制策略（扩频因子、带宽、编码率组合），显著提升复杂地形可达率。',
  },
  {
    icon: IconSun,
    title: '太阳能智能电源管理',
    problem: '野外节点无市电，长期运行依赖太阳能，但原版无智能能量调度。',
    solution:
      '基于 CN3791 太阳能充电方案，结合光照与电池状态动态调整占空比和发射策略，保障阴雨天续航底线。',
  },
  {
    icon: IconRadio,
    title: '国产 470MHz 频段适配',
    problem: '国际通用频段在国内不合规，直接使用存在法规风险。',
    solution:
      '完整适配 470–490MHz 国内免费频段，参数与信道规划符合国内使用要求，免许可合法使用。',
  },
  {
    icon: IconCpu,
    title: '自研 ESP32-S3 外设驱动',
    problem: '通用开发板驱动移植到自研 PCB 会遇到 USB 引脚冲突等硬件级问题。',
    solution:
      '全套外设驱动（屏幕、键盘、GNSS、传感器）专为自研 PCB 编写，从引脚分配层面规避冲突。',
  },
  {
    icon: IconShield,
    title: '抗射频干扰系统',
    problem: 'LoRa 大功率发射时会干扰 SPI 屏幕显示与 ADC 采样，导致花屏与误读。',
    solution:
      '通过时序隔离、屏蔽策略与采样窗口错峰，解决大功率发射下的屏幕与 ADC 干扰问题。',
  },
  {
    icon: IconBattery,
    title: '低功耗休眠防丢包',
    problem: '原版深度休眠时存在漏收报文与发送被打断的缺陷。',
    solution:
      '重写休眠唤醒时序与发送状态机，保证省电模式下不漏收关键报文、不中断进行中的发送。',
  },
  {
    icon: IconLayers,
    title: '自定义报文智能解析',
    problem: '标准报文格式难以承载遥测与远程控制等扩展语义。',
    solution:
      '支持自定义报文格式的智能解析，并可联动本地自动控制逻辑，扩展到遥测与远程执行场景。',
  },
  {
    icon: IconRadio,
    title: '全国地貌射频模板',
    problem: '一套固定射频参数无法同时适配山地、密林、沿海、戈壁、高原等差异巨大的国内地况。',
    solution:
      '内置多套地貌射频模板（高山密林 / 河谷峡谷 / 沿海高湿 / 西北戈壁 / 高原 / 城镇遮挡），常驻链路探测采集 RSSI、SNR、环境噪声底值与丢包率，按环境自动切换扩频因子、带宽、前导码长度与发射功率。',
  },
  {
    icon: IconCpu,
    title: '国产电源芯片深度适配',
    problem: '海外方案多只读取简易电池电压，拿不到精准电量、电池温度与太阳能输入，难以做精细化能量调度。',
    solution:
      '完成 IP5326 充放电与 MAX17055 电量计驱动封装，节点可上报剩余电量、电池温度与太阳能板输入电压；低电量时自动降功率、减探测频次、关闭中继权限，并完整适配 ESP32‑P4 的 SDIO3.0 / eMMC / 4G 全网通以搭建 LoRa‑4G 网关。',
  },
];

export default function FeaturesPage() {
  return (
    <MrPage
      title="技术特性"
      description="MeshROC 十项核心技术特性：分层骨干路由、山地 NLOS 优化、太阳能电源管理、470MHz 适配、自研驱动、抗射频干扰、防丢包休眠、自定义报文解析、全国地貌射频模板、国产电源芯片适配。"
    >
      <MrHeader
        eyebrow="Technical Features"
        title="十项核心技术特性"
        lead="每一项优化都针对原版 Meshtastic 在国内真实部署中暴露的具体缺陷——从全国多地貌射频、国产电源芯片到应急调度语义，而非参数层面的简单调整。"
      />

      <MrSection>
        <div className="mr-grid mr-grid--2">
          {FEATURES.map((f, i) => (
            <article key={f.title} className="mr-card">
              <div className="mr-product__head">
                <div
                  className={`mr-card__icon${i % 2 ? ' mr-card__icon--orange' : ''}`}
                  style={{ marginBottom: 0 }}
                >
                  <f.icon size={22} />
                </div>
                <h3 className="mr-product__name" style={{ fontSize: '1.05rem' }}>
                  {f.title}
                </h3>
                <span className="mr-product__badge">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mr-p" style={{ fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--mr-orange)' }}>痛点：</strong>
                {f.problem}
              </p>
              <p className="mr-p" style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                <strong style={{ color: 'var(--mr-cyan)' }}>方案：</strong>
                {f.solution}
              </p>
            </article>
          ))}
        </div>
      </MrSection>

      <MrSection
        eyebrow="技术栈"
        eyebrowOrange
        title="核心技术组成"
      >
        <div className="mr-grid mr-grid--4">
          <div className="mr-stat">
            <div className="mr-stat__num">ESP32-S3</div>
            <div className="mr-stat__label">主力节点主控</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">ESP32-C3</div>
            <div className="mr-stat__label">低功耗传感主控</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">470MHz</div>
            <div className="mr-stat__label">国内免费频段</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">30dBm</div>
            <div className="mr-stat__label">骨干发射功率</div>
          </div>
        </div>
        <div className="mr-stats" style={{ marginTop: '1rem' }}>
          <div className="mr-stat">
            <div className="mr-stat__num">W5500</div>
            <div className="mr-stat__label">有线网口方案</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">ST7789</div>
            <div className="mr-stat__label">高清显示屏</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">CN3791</div>
            <div className="mr-stat__label">太阳能充电</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">AHT20</div>
            <div className="mr-stat__label">温湿度传感</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">IP5326</div>
            <div className="mr-stat__label">国产充放电管理</div>
          </div>
          <div className="mr-stat">
            <div className="mr-stat__num">MAX17055</div>
            <div className="mr-stat__label">国产电量计</div>
          </div>
        </div>
      </MrSection>

      <MrCTA
        title="了解这些特性如何落地"
        desc="查看固件系统的实现说明，或直接到下载中心获取固件亲自验证。"
        actions={[
          { label: '固件系统', to: '/firmware' },
          { label: '下载中心', to: '/download', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
