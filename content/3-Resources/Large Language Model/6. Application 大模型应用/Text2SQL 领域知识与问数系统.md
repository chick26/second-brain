---
status: draft
created: 2026-06-29
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "Text2SQL 领域知识与问数系统"
source: cubox-review
---

# Text2SQL 领域知识与问数系统

Text2SQL 的真实难点不只是把自然语言翻译成 SQL，而是让系统理解数据库 schema、业务实体、指标口径和隐性领域知识。

## 核心问题

- 同一个字段名在不同业务域可能有不同含义。
- 指标口径往往不在 schema 里，而在文档、历史查询和业务习惯里。
- 问数系统必须解释“为什么这样查”，不能只给 SQL。
- 复杂问题通常需要澄清、拆解、查询验证和结果复核。

## Harness 设计方向

| 模块 | 作用 |
|---|---|
| Schema context | 表、字段、主外键、样例值、业务实体说明。 |
| Metric registry | 指标定义、口径、窗口、分母、排除项。 |
| Query planner | 先澄清意图，再生成查询计划，而不是直接写 SQL。 |
| Validator | 检查 SQL 可运行、结果范围、空值、异常值和口径冲突。 |
| Explanation | 输出自然语言解释、查询依据和不确定性。 |

## 待核验来源

摩根大通相关来源提到 Text2SQL 的瓶颈在 tacit knowledge。该条源文主要依赖图片，并给出 arXiv `2511.10674` 线索，后续需要回源论文再做强结论。

## 来源

- [[摩根大通破解Text2QL领域知识壁垒(附文件-2025-12-20]]
- [[2-Areas/Journal/Weekly/Cubox Reviews/2025-12 Cubox Review|2025-12 Cubox 复盘]]

## Cubox 回源复核

- 2026-06-29 已对 2025-12 到 2026-05 的 Cubox 整理来源补跑回源审计，详见 [[2025-12 to 2026-05 Cubox Source Re-Audit]]。
- 审计中标为 `source_unreachable` 的来源只能作为待核验线索，不应作为本笔记的强结论依据。

