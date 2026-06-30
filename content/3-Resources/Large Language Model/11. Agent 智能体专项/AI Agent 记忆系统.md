---
status: draft
created: 2026-06-29
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "AI Agent 记忆系统"
source: cubox-review
---

# AI Agent 记忆系统

Agent 记忆系统可以粗略分成四层：工作记忆、程序记忆、语义记忆、情景记忆。真正决定长期质量的，是把情景日志提炼为稳定事实的整合闸门。

## 四类记忆

| 类型 | 作用 | 类比 | 在当前 Obsidian/Codex 工作流中的对应 |
|---|---|---|---|
| 工作记忆 | 当前会话、当前任务、系统提示和上下文 | RAM | 当前 Codex 线程、当前任务读到的文件 |
| 程序记忆 | Agent 该怎么做事 | `SKILL.md`、规则、SOP | `.agents/skills`、`AGENTS.md`、Playbooks |
| 语义记忆 | 持久事实、用户偏好、项目背景 | 用户档案、知识库 | `2-Areas/Codex`、`3-Resources` |
| 情景记忆 | 带时间的事件和历史轨迹 | 日志、时间线 | Daily Notes、Thread Reviews、Cubox Reviews、Dayflow |

## 整合闸门

情景记忆不能每次都全量塞回上下文。更合理的做法是等事件积累到一定数量后，由一个便宜的总结模型或手动复盘流程提炼成少量稳定事实。

这解释了为什么 ChatGPT / Claude 的记忆看起来很短，但可以持续更新：系统没有保存每条对话原文，而是在提炼“对未来有用的事实”。

## 对当前工作流的落地

- Daily Note 和 Thino 负责记录当天发生过的事实，不要求完美整理。
- `$daily-thino-digest` 负责把零碎记忆提炼成决策、行动项、阻塞和可复用经验。
- `$weekly-codex-efficiency-review` 负责从真实 Codex 线程中提炼可复用 prompt、playbook、checklist 或 skill。
- `$weekly-cubox-review` 负责把外部输入变成候选知识，再由用户决定入库、暂存或丢弃。

## 设计注意

- 不要把所有历史都当成语义记忆。大多数历史只适合留在情景层。
- 程序记忆要版本化和可执行，不能只散落在聊天里。
- 语义记忆要短而稳定，避免把一次性结论写成长期规则。
- 整合流程必须保留来源链接，方便回查判断是否过度概括。

## 来源

- [[一口气学会AI Agent记忆系统设计 - 语义记忆-情景记忆-RAG-向量数据库-2026-06-22]]
- [[2-Areas/Journal/Weekly/Cubox Reviews/2026-06 Cubox Review|2026-06 Cubox 复盘]]

## Cubox Review 增补：分层记忆与证据回溯

腾讯 Agent Memory 项目的思路可以作为当前工作流的一个参照：短期记忆不只是摘要，而是“任务图 + 步骤摘要 + 原始证据”的分层索引；长期记忆也不只是向量召回，而是从原始对话到结构化事实、场景块和用户画像的逐级抽象。

### 短期记忆

- L0：原始工具日志和文件，保留证据。
- L1：步骤摘要或 JSONL，记录发生了什么。
- L2：任务图，只保留当前决策需要的结构。

这样能避免把所有工具输出塞进上下文，同时在需要核验时还能回到底层证据。

### 长期记忆

- L0 Conversation：原始对话。
- L1 Atom：结构化事实。
- L2 Scenario：场景化经验。
- L3 Persona：长期偏好和工作方式。

这和当前 vault 的 Daily Note、Review、Playbook、Skill 分层很接近：事实先进入日志，稳定经验再晋升为规则或 skill。

## 增补来源

- [[刚刚，腾讯开源了一个Agent Memory项目-2026-05-15]]

## Cubox 回源复核

- [[刚刚，腾讯开源了一个Agent Memory项目-2026-05-15]] 已在 2026-06-29 完成公开页回源和 3 张图片 OCR，证据为 `source_fetched_ocr`；详见 [[2025-12 to 2026-05 Cubox Source Re-Audit]]。
- 2026-06 的 Agent 记忆系统来源已在 [[2-Areas/Journal/Weekly/Cubox Reviews/2026-06 Cubox Review|2026-06 Cubox 复盘]] 中记录公开回源。长期结论仍应以项目 repo、论文或官方资料补充核验。
