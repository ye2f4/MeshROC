import React from 'react';
import Link from '@docusaurus/Link';
import {
  MrPage,
  MrHeader,
  MrSection,
  IconUsers,
  IconArrowRight,
  IconRoute,
  IconDownload,
  IconFileText,
  IconGithub,
  IconCpu,
  IconCode,
} from '@site/src/components/mr';

export default function ResourcesHubPage() {
  return (
    <MrPage
      title="资源"
      description="MeshROC 资源中心：社区、联系、工具与开源链接。"
    >
      <MrHeader
        eyebrow="Resources"
        title="资源中心"
        lead="和我们一起建设：加入社区、联系团队、使用在线工具，或前往上游开源项目。"
      />

      <MrSection eyebrow="Internal" title="站内资源">
        <div className="mr-grid mr-grid--2">
          <Link to="/firmware" className="mr-card mr-card--link">
            <div className="mr-card__icon">
              <IconCpu size={22} />
            </div>
            <h3 className="mr-h3">固件系统</h3>
            <p className="mr-card__desc">
              了解 MeshROC 固件的核心优势：分层骨干路由、本土化射频优化、电源系统重写、自研外设驱动。
            </p>
            <span className="mr-card__more">了解固件 →</span>
          </Link>

          <Link to="/firmware-source" className="mr-card mr-card--link">
            <div className="mr-card__icon">
              <IconCode size={22} />
            </div>
            <h3 className="mr-h3">固件源码</h3>
            <p className="mr-card__desc">
              按设备分列的 PlatformIO 源码工程，完整包含库依赖声明，解压即可编译。GPL-3.0 许可。
            </p>
            <span className="mr-card__more">获取源码 →</span>
          </Link>

          <Link to="/community" className="mr-card mr-card--link">
            <div className="mr-card__icon">
              <IconUsers size={22} />
            </div>
            <h3 className="mr-h3">开源社区</h3>
            <p className="mr-card__desc">
              参与文档、翻译、硬件与固件贡献，和社区成员一起把项目做得更好。
            </p>
            <span className="mr-card__more">进入社区 →</span>
          </Link>

          <Link to="/contact" className="mr-card mr-card--link">
            <div className="mr-card__icon">
              <IconArrowRight size={22} />
            </div>
            <h3 className="mr-h3">联系我们</h3>
            <p className="mr-card__desc">
              合作、咨询或反馈问题，这里汇总了所有沟通渠道与响应方式。
            </p>
            <span className="mr-card__more">联系我们 →</span>
          </Link>

          <Link to="/site-planner" className="mr-card mr-card--link">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconRoute size={22} />
            </div>
            <h3 className="mr-h3">站点规划器</h3>
            <p className="mr-card__desc">
              在线工具：可视化规划节点布点、估算覆盖与链路，辅助实地组网。
            </p>
            <span className="mr-card__more">打开工具 →</span>
          </Link>

          <Link to="/flash" className="mr-card mr-card--link">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconDownload size={22} />
            </div>
            <h3 className="mr-h3">固件刷写器</h3>
            <p className="mr-card__desc">
              浏览器内一键刷写固件，无需安装环境，适合新手快速上手设备。
            </p>
            <span className="mr-card__more">打开刷写器 →</span>
          </Link>
        </div>
      </MrSection>

      <MrSection eyebrow="External" title="外部链接">
        <div className="mr-grid mr-grid--2">
          <a
            href="https://meshtastic.org/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-card mr-card--link"
          >
            <div className="mr-card__icon">
              <IconFileText size={22} />
            </div>
            <h3 className="mr-h3">Meshtastic 文档</h3>
            <p className="mr-card__desc">
              上游开源项目的官方文档，深入原理、协议与设备支持列表。
            </p>
            <span className="mr-card__more">前往官网 ↗</span>
          </a>

          <a
            href="https://github.com/ye2f4/MeshROC"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-card mr-card--link"
          >
            <div className="mr-card__icon">
              <IconGithub size={22} />
            </div>
            <h3 className="mr-h3">GitHub</h3>
            <p className="mr-card__desc">
              固件与官网源码仓库，欢迎 Star、提 Issue 与提交 Pull Request。
            </p>
            <span className="mr-card__more">前往仓库 ↗</span>
          </a>
        </div>
      </MrSection>
    </MrPage>
  );
}
