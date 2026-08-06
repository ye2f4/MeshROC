import React from 'react';
import {
  MrPage,
  MrHeader,
  MrSection,
  MrCTA,
  IconGithub,
  IconCode,
  IconFileText,
  IconBox,
  IconHelp,
} from '@site/src/components/mr';

const GITHUB = 'https://github.com/ye2f4/MeshROC';

const WAYS = [
  {
    icon: IconCode,
    title: '贡献代码',
    desc: '修复缺陷、优化路由算法、适配新硬件平台，欢迎直接提交 Pull Request。',
    list: ['固件功能开发与 Bug 修复', '新增外设驱动适配', '路由与电源策略优化'],
  },
  {
    icon: IconBox,
    title: '硬件设计',
    desc: '基于立创开源工程改进 PCB，或设计新的外壳与配件方案。',
    list: ['PCB 改版与打样验证', '3D 外壳与支架设计', 'BOM 选型优化'],
  },
  {
    icon: IconFileText,
    title: '完善文档',
    desc: '补充部署案例、翻译文档、撰写教程，让更多人能顺利上手。',
    list: ['实地部署经验分享', '故障排查案例', '新手教程撰写'],
  },
  {
    icon: IconHelp,
    title: '反馈问题',
    desc: '把你在真实环境中遇到的问题反馈给我们，这是最有价值的贡献之一。',
    list: ['提交 Issue 报告缺陷', '反馈实测覆盖数据', '提出功能需求'],
  },
];

export default function CommunityPage() {
  return (
    <MrPage
      title="社区 · 互联之域"
      description="Mesh Realm Of Connection（互联之域）—— 开源 LoRa Mesh 社区，基于 MeshROC 系统：GitHub 仓库、立创开源、贡献指南与开源协议说明。"
    >
      <MrHeader
        eyebrow="Community"
        title="开源社区"
        lead="MeshROC 是一个完全开源的项目，硬件、固件与文档全部公开。欢迎任何形式的参与。"
      />

      <MrSection eyebrow="开源地址" title="项目仓库">
        <div className="mr-grid mr-grid--2">
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
            <h3 className="mr-h3">GitHub · 固件与官网源码</h3>
            <p className="mr-card__desc">
              固件源码、官网源码与 Issue 讨论区。欢迎 Star、Fork 与提交 PR。
            </p>
            <div className="mr-tags">
              <span className="mr-tag mr-tag--cyan">GPL-3.0 · MIT</span>
              <span className="mr-tag mr-tag--cyan">开放 PR</span>
            </div>
          </a>
          <a
            className="mr-card"
            href="https://oshwhub.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div className="mr-card__icon mr-card__icon--orange">
              <IconBox size={22} />
            </div>
            <h3 className="mr-h3">立创开源 · 硬件工程</h3>
            <p className="mr-card__desc">
              全系列原理图与 PCB 工程已公开，并入库星火计划，可直接克隆打样。
            </p>
            <div className="mr-tags">
              <span className="mr-tag mr-tag--orange">星火计划入库</span>
              <span className="mr-tag mr-tag--orange">开源硬件</span>
            </div>
          </a>
        </div>
      </MrSection>

      <MrSection
        eyebrow="参与方式"
        eyebrowOrange
        title="如何参与贡献"
        lead="无论你擅长写代码、画板子、写文档，还是只是把设备带去野外跑一圈，都是对项目的贡献。"
      >
        <div className="mr-grid mr-grid--2">
          {WAYS.map((w) => (
            <article key={w.title} className="mr-card">
              <div className="mr-card__icon">
                <w.icon size={22} />
              </div>
              <h3 className="mr-h3">{w.title}</h3>
              <p className="mr-card__desc">{w.desc}</p>
              <ul className="mr-card__list">
                {w.list.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </MrSection>

      <MrSection eyebrow="贡献流程" title="提交 PR 的建议流程">
        <div className="mr-steps">
          <div className="mr-step">
            <h3 className="mr-h3">1. 先开 Issue 讨论</h3>
            <p className="mr-p">
              对于较大的功能改动，建议先创建 Issue 说明思路，避免重复劳动或方向偏差。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">2. Fork 并新建分支</h3>
            <p className="mr-p">
              从主分支切出功能分支，保持单个 PR 聚焦一件事，便于 Review。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">3. 实机验证</h3>
            <p className="mr-p">
              涉及固件的改动请在真实硬件上验证，并在 PR 中附上测试环境与结果说明。
            </p>
          </div>
          <div className="mr-step">
            <h3 className="mr-h3">4. 提交 Pull Request</h3>
            <p className="mr-p">
              清晰描述改动内容与动机，关联相关 Issue，等待维护者 Review 与合并。
            </p>
          </div>
        </div>
      </MrSection>

      <MrSection eyebrow="License" eyebrowOrange title="开源协议">
        <div className="mr-grid mr-grid--3">
          <div className="mr-card">
            <h3 className="mr-h3">固件 · GPL-3.0</h3>
            <p className="mr-card__desc">
              MeshROC 固件构建于 Meshtastic 之上，遵循 GPL-3.0 协议，与上游保持完全互通。修改后分发同样须以 GPL-3.0 开源。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">硬件 · 开源硬件</h3>
            <p className="mr-card__desc">
              自研 PCB 设计以开源硬件协议在立创开源平台发布，入库星火计划，任何人可克隆工程自行打样。
            </p>
          </div>
          <div className="mr-card">
            <h3 className="mr-h3">文档 / 官网 · MIT</h3>
            <p className="mr-card__desc">
              本站文档与官网源码以 MIT 协议开源，欢迎引用、转载与二次创作，请保留出处。
            </p>
          </div>
        </div>
      </MrSection>

      <MrCTA
        title="一起把这张网织得更大"
        desc="Star 项目、提交第一个 Issue，或者带上设备去山里跑一次实测。"
        actions={[
          { label: '前往 GitHub', href: GITHUB },
          { label: '联系我们', to: '/contact', variant: 'mr-btn--ghost' },
        ]}
      />
    </MrPage>
  );
}
