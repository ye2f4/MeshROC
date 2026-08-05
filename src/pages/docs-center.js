import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconNetwork,
  IconCpu,
  IconRoute,
  IconRadio,
} from '@site/src/components/mr';

const FAQS = [
  {
    q: 'MeshROC 和 Meshtastic 能互通吗？',
    a: '可以，100% 互通。MeshROC 完全兼容 Meshtastic 协议，文本消息、位置信息、传感器遥测数据均可与全球任意标准 Meshtastic 设备互相收发，无需任何网关或协议转换。',
  },
  {
    q: '使用 470MHz 频段需要许可证吗？',
    a: '不需要。470–490MHz 是国内规定的免许可使用频段，MeshROC 的射频参数按该频段的使用要求进行了本地化适配，个人合法合规使用无需申请许可。',
  },
  {
    q: '一个网络最多能接多少个节点？',
    a: '得益于分层骨干路由机制，MeshROC 在中大规模网络下的表现明显优于原版洪泛广播。实际上限取决于骨干节点数量、地形与业务报文频率，建议单个骨干覆盖区域内的活跃终端控制在合理规模，并通过增设骨干节点来横向扩展。',
  },
  {
    q: '通信距离能达到多远？',
    a: '取决于地形、天线与发射功率。Backbone 骨干节点采用 30dBm 大功率发射并部署于山顶制高点，视距条件下可实现远距离链路；山地非视距场景下 MeshROC 做了专项 NLOS 优化，可达率显著高于通用参数配置。',
  },
  {
    q: '硬件必须用官方 PCB 吗？',
    a: '不必须。MeshROC 固件兼容 Meshtastic 协议，也可运行在常见开发板上；但自研外设驱动（屏幕、键盘、电源管理）是针对官方 PCB 的引脚分配编写的，使用第三方硬件可能需要自行调整引脚映射。',
  },
  {
    q: '项目是否开源？可以商用吗？',
    a: '完全开源。硬件原理图与 PCB 已在立创开源平台公开并入库星火计划，固件源码托管于 GitHub，均采用 MIT License，允许自由使用、修改与商业化衍生。',
  },
  {
    q: '太阳能节点在阴雨天能撑多久？',
    a: 'Backbone 采用 CN3791 太阳能充电方案并配合智能电源策略，会根据光照与电池状态动态降低占空比与发射频率，以保障阴雨天气下的续航底线。具体时长取决于电池容量与业务报文频率。',
  },
  {
    q: '原版休眠丢包的问题解决了吗？',
    a: '已解决。MeshROC 重写了休眠唤醒时序与发送状态机，确保节点在深度省电状态下不漏收关键报文，也不会出现发送过程被休眠打断的情况。',
  },
];

export default function DocsCenterPage() {
  return (
    <MrPage
      title="文档中心"
      description="MeshROC 文档中心：快速上手、组网指南、固件刷写教程、常见问题 FAQ。"
    >
      <MrHeader
        eyebrow="Documentation"
        title="文档中心"
        lead="从零开始把设备刷起来、把网组起来，以及你可能会遇到的常见问题。"
      />

      <MrSection eyebrow="Quick Start" title="快速上手">
        <div className="mr-steps">
          <div className="mr-step">
            <h3 className="mr-h3">1. 准备硬件</h3>
            <p className="mr-p">
              选择适合场景的 MeshROC 设备（Walk / Backbone / Gateway /
              Sensor），或自行按立创开源工程打样。确认天线已正确连接——
              <strong style={{ color: 'var(--mr-orange)' }}>
                切勿在未接天线的情况下发射
              </strong>
              ，可能损坏射频前端。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">2. 刷写固件</h3>
            <p className="mr-p">
              使用 Chrome / Edge 浏览器通过 WebSerial 在线刷写，或下载 bin
              文件用 esptool 命令行刷入。首次从其他固件迁移建议先全片擦除。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">3. 基础配置</h3>
            <p className="mr-p">
              设置节点名称、区域频段（选择 470–490MHz 国内频段）、节点角色（骨干
              / 终端）以及信道加密密钥。同一网络内所有节点需使用相同的信道配置。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">4. 验证链路</h3>
            <p className="mr-p">
              至少启动两台设备，互发文本消息确认连通。观察信噪比与跳数指标，判断链路质量是否满足部署要求。
            </p>
          </div>
        </div>
      </MrSection>

      <MrSection eyebrow="Networking" eyebrowOrange title="组网指南">
        <div className="mr-grid mr-grid--3">
          <div className="mr-card">
            <div className="mr-card__icon">
              <IconRoute size={22} />
            </div>
            <h3 className="mr-h3">角色规划</h3>
            <ul className="mr-card__list">
              <li>制高点设备设为骨干节点</li>
              <li>移动终端设为终端节点</li>
              <li>骨干节点不宜过多，避免冗余转发</li>
            </ul>
          </div>
          <div className="mr-card">
            <div className="mr-card__icon">
              <IconNetwork size={22} />
            </div>
            <h3 className="mr-h3">信道与密钥</h3>
            <ul className="mr-card__list">
              <li>全网统一频段与信道参数</li>
              <li>使用私有密钥隔离不同队伍</li>
              <li>公共信道可与 Meshtastic 互通</li>
            </ul>
          </div>
          <div className="mr-card">
            <div className="mr-card__icon">
              <IconRadio size={22} />
            </div>
            <h3 className="mr-h3">天线与选址</h3>
            <ul className="mr-card__list">
              <li>骨干节点优先选择视野开阔的制高点</li>
              <li>天线垂直架设，远离金属遮挡</li>
              <li>城市基站可利用楼顶获取高度增益</li>
            </ul>
          </div>
        </div>
      </MrSection>

      <MrSection eyebrow="Flashing" title="固件刷写教程">
        <div className="mr-grid mr-grid--2">
          <div className="mr-card">
            <div className="mr-card__icon">
              <IconCpu size={22} />
            </div>
            <h3 className="mr-h3">方式一：浏览器在线刷写</h3>
            <ul className="mr-card__list">
              <li>使用 Chrome / Edge 等 Chromium 内核浏览器</li>
              <li>USB 数据线连接设备（注意不是仅供电线）</li>
              <li>点击刷写按钮并在弹窗中选择串口设备</li>
              <li>等待进度完成后设备会自动重启</li>
            </ul>
          </div>
          <div className="mr-card">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconCpu size={22} />
            </div>
            <h3 className="mr-h3">方式二：esptool 命令行</h3>
            <ul className="mr-card__list">
              <li>安装 esptool（pip install esptool）</li>
              <li>全片擦除：esptool.py erase_flash</li>
              <li>刷写固件：esptool.py write_flash 0x0 固件.bin</li>
              <li>确认串口号与波特率设置正确</li>
            </ul>
          </div>
        </div>
      </MrSection>

      <MrSection eyebrow="FAQ" eyebrowOrange title="常见问题">
        <div className="mr-faq">
          {FAQS.map((f) => (
            <details key={f.q} className="mr-faq__item">
              <summary className="mr-faq__q">{f.q}</summary>
              <p className="mr-faq__a">{f.a}</p>
            </details>
          ))}
        </div>
      </MrSection>

      <MrCTA
        title="文档没覆盖到你的问题？"
        desc="到社区提问，或直接联系我们，我们会持续把高频问题补充进文档。"
        actions={[
          { label: '加入社区', to: '/community' },
          { label: '联系我们', to: '/contact', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
