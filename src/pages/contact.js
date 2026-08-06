import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconGithub,
  IconUsers,
  IconHelp,
  IconBox,
  IconCode,
} from '@site/src/components/mr';

const GITHUB = 'https://github.com/ye2f4/MeshROC';

export default function ContactPage() {
  return (
    <MrPage
      title="联系我们"
      description="联系 MeshROC 团队：GitHub Issue、社区交流群、技术支持与合作咨询。"
    >
      <MrHeader
        eyebrow="Contact"
        title="联系我们"
        lead="技术问题、部署咨询、合作洽谈，都可以通过以下方式找到我们。"
      />

      <MrSection eyebrow="联系方式" title="选择合适的渠道">
        <div className="mr-grid mr-grid--3">
          <a
            className="mr-card"
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div className="mr-card__icon">
              <IconGithub size={22} />
            </div>
            <h3 className="mr-h3">GitHub Issue</h3>
            <p className="mr-card__desc">
              报告缺陷、提出功能需求、参与技术讨论。这是最推荐、响应也最及时的渠道。
            </p>
            <div className="mr-tags">
              <span className="mr-tag mr-tag--cyan">推荐</span>
              <span className="mr-tag mr-tag--cyan">公开可追溯</span>
            </div>
          </a>

          <div className="mr-card">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconUsers size={22} />
            </div>
            <h3 className="mr-h3">社区交流群</h3>
            <p className="mr-card__desc">
              与其他玩家实时交流组网经验、部署方案与实测数据。加群方式请见 GitHub 仓库说明。
            </p>
            <div className="mr-tags">
              <span className="mr-tag mr-tag--orange">实时交流</span>
            </div>
          </div>

          <div className="mr-card">
            <div className="mr-card__icon">
              <IconHelp size={22} />
            </div>
            <h3 className="mr-h3">技术支持</h3>
            <p className="mr-card__desc">
              硬件选型、组网方案设计、部署疑难排查，可通过 Issue 或社区群提出，我们会协助解决。
            </p>
            <div className="mr-tags">
              <span className="mr-tag mr-tag--cyan">选型咨询</span>
            </div>
          </div>
        </div>
      </MrSection>

      <MrSection eyebrow="合作" eyebrowOrange title="商务与合作咨询">
        <div className="mr-grid mr-grid--2">
          <div className="mr-card">
            <div className="mr-card__icon mr-card__icon--orange">
              <IconBox size={22} />
            </div>
            <h3 className="mr-h3">批量采购与定制</h3>
            <p className="mr-card__desc">
              应急、林业、科考等行业场景的批量硬件需求，或基于现有平台的定制化开发，欢迎联系洽谈。
            </p>
          </div>
          <div className="mr-card">
            <div className="mr-card__icon">
              <IconCode size={22} />
            </div>
            <h3 className="mr-h3">技术合作</h3>
            <p className="mr-card__desc">
              高校科研、开源项目联合开发、硬件生态适配，我们对一切能扩大 Mesh 生态的合作持开放态度。
            </p>
          </div>
        </div>
      </MrSection>

      <MrSection eyebrow="提问建议" title="怎样提问能更快得到帮助">
        <div className="mr-card">
          <ul className="mr-card__list">
            <li>说明设备型号（Walk / Backbone / Gateway / Sensor）与固件版本</li>
            <li>描述你的组网拓扑：有几个节点、各自角色、大致距离与地形</li>
            <li>附上关键配置：频段、信道参数、发射功率</li>
            <li>如有异常，请附上串口日志或屏幕照片</li>
            <li>说明你已经尝试过哪些排查手段与结果</li>
          </ul>
        </div>
      </MrSection>

      <MrCTA
        title="准备好动手了吗"
        desc="先到下载中心把固件刷起来，遇到问题随时回到这里找我们。"
        actions={[
          { label: '下载中心', to: '/download' },
          { label: '帮助中心', to: '/docs-center', variant: 'mr-btn--ghost' },
          { label: '开源社区', to: '/community', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
