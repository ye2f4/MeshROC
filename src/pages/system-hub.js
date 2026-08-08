import React from 'react';
import Link from '@docusaurus/Link';
import {
  MrPage,
  MrHeader,
  MrSection,
  IconCpu,
  IconRadio,
  IconShield,
  IconMountain,
  IconFileText,
  IconGlobe,
} from '@site/src/components/mr';

export default function SystemHubPage() {
  return (
    <MrPage
      title="系统"
      description="MeshROC 系统：硬件、固件、技术特性与应用场景一览。"
    >
      <MrHeader
        eyebrow="System"
        title="MeshROC 系统"
        lead="我们构建的硬件与固件体系：从芯片到组网，从特性到真实场景，都在这里。"
      />

      <MrSection eyebrow="Categories" title="浏览系统">
        <div className="mr-grid mr-grid--2">
          <Link to="/hardware" className="mr-card mr-card--link">
            <div className="mr-card__icon">
              <IconCpu size={22} />
            </div>
            <h3 className="mr-h3">硬件产品</h3>
            <p className="mr-card__desc">
              自研节点的硬件设计与工程文件：原理图、PCB、外壳与关键器件选型，已开源入库星火计划。
            </p>
            <span className="mr-card__more">查看硬件 →</span>
          </Link>

          <Link to="/firmware" className="mr-card mr-card--link">
            <div className="mr-card__icon">
              <IconRadio size={22} />
            </div>
            <h3 className="mr-h3">固件系统</h3>
            <p className="mr-card__desc">
              基于 Meshtastic 构建的固件，遵循 GPL-3.0，与上游完全互通；图文说明刷写与配置流程。
            </p>
            <span className="mr-card__more">查看固件 →</span>
          </Link>

          <Link to="/features" className="mr-card mr-card--link">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconShield size={22} />
            </div>
            <h3 className="mr-h3">技术特性</h3>
            <p className="mr-card__desc">
              中继、加密、低功耗、离线可达等核心能力，以及面向国内频段合规的设计要点。
            </p>
            <span className="mr-card__more">查看特性 →</span>
          </Link>

          <Link to="/scenarios" className="mr-card mr-card--link">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconMountain size={22} />
            </div>
            <h3 className="mr-h3">应用场景</h3>
            <p className="mr-card__desc">
              户外徒步、应急救援、园区物联、乡村覆盖——真实场景下的组网方案与部署建议。
            </p>
            <span className="mr-card__more">查看场景 →</span>
          </Link>

          <Link to="/docs/comparison" className="mr-card mr-card--link">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconFileText size={22} />
            </div>
            <h3 className="mr-h3">与 Meshtastic / MeshCore 全面对比</h3>
            <p className="mr-card__desc">
              逐条对比三大系统在定位、射频、路由、封装、加密、电源与全国地貌适配上的差异与短板。
            </p>
            <span className="mr-card__more">查看对比 →</span>
          </Link>

          <Link to="/client" className="mr-card mr-card--link">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconGlobe size={22} />
            </div>
            <h3 className="mr-h3">网络客户端</h3>
            <p className="mr-card__desc">
              无需安装软件，在浏览器里直连设备：配置射频、管理节点、收发消息。兼容 Meshtastic 固件。
            </p>
            <span className="mr-card__more">打开客户端 →</span>
          </Link>
        </div>
      </MrSection>
    </MrPage>
  );
}
