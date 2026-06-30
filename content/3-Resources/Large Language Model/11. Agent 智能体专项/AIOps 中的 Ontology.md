---
status: draft
created: 2026-06-29
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "AIOps 中的 Ontology"
source: cubox-review
---

# AIOps 中的 Ontology

Ontology 在 AIOps 里的价值，不是多画一张知识图谱，而是把日志、指标、事件、链路、服务和拓扑关系组织成可查询、可解释、可被 Agent 使用的对象层。

## 核心判断

通用 LLM 可以解释常见故障概念，skill 可以帮它查询工具，但这两者仍不足以处理企业内部运维问题。原因是企业里的服务拓扑、指标口径、调用关系、变更历史和 runbook 多数是私有知识，不会自然出现在模型参数里。

Ontology 的作用是把这些私有对象和关系显式建模，让 Agent 不再从孤立的数据点出发，而是从“实体”和“关系”出发。

## 从数据导向到对象导向

传统可观测系统常按数据类型组织：

- Metrics：时序指标；
- Logs：非结构化日志；
- Traces：调用链；
- Events：离散状态变化。

Ontology 视角则先定义对象：

- 服务、Pod、节点、数据库、Redis 实例、CI/CD 任务；
- 对象之间的部署、调用、依赖、归属、影响关系；
- 每个对象挂载的指标、日志、事件、runbook 和历史经验。

这样问“订单服务怎么了”时，系统可以从订单服务这个实体出发，沿关系链聚合上下游和相关观测数据，而不是甩出一堆孤立曲线。

## 为什么基础模型 + Skill 不够

- 私有架构是模型盲区：内部拓扑、指标命名、迁移历史不会出现在公开语料中。
- 统计相关不等于因果：运维需要解释故障如何沿依赖链传播。
- 高风险场景要求可解释：AIOps 的根因判断必须能被值班工程师复查。

## UModel / STAROps 的启发

从公开材料看，阿里云 UModel 的方向是把可观测框架从“数据导向”推到“对象导向”：用 EntitySet、TelemetryDataSet、Storage、Explorer 等节点及关系组织 IT 世界，再在其上支持统一查询和根因分析。

对个人知识库也有类似启发：只有标签还不够。后续可以考虑把固定对象显式化，例如项目、工作流、skill、来源、决策、行动项，再让复盘围绕对象关系展开。

## Cubox 回源复核

- 2026-06-29 已完成公开回源和图片 OCR，证据为 `source_fetched_ocr`；详见 [[2-Areas/Journal/Weekly/Cubox Reviews/2026-06 Cubox Review|2026-06 Cubox 复盘]]。
- 当前可作为 AIOps ontology/object-layer 线索；具体产品能力仍需以阿里云官方文档核验。

## 来源

- [[阿里云博客：ontology在AIOps的运用-2026-06-07]]
- [[2-Areas/Journal/Weekly/Cubox Reviews/2026-06 Cubox Review|2026-06 Cubox 复盘]]
