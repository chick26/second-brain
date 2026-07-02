---
status: draft
created: 2026-06-29
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "Text2SQL 领域知识与问数系统"
source: cubox-review
dashboard_type: review-output
dashboard_status: todo
review_source: cubox-review
review_batch: 2025-12
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

## 源文深读：从人类反馈中持续学习领域知识

源文是 JPMorganChase 的论文 *Continual Learning of Domain Knowledge from Human Feedback in Text-to-SQL*（arXiv:2511.10674v2，2025-11-28）。它不是在讨论单次 prompt 如何生成更好 SQL，而是在讨论一个 Text-to-SQL agent 如何把人类专家反馈沉淀成可复用的领域知识。

核心判断：

- Text-to-SQL 的瓶颈不只是 SQL 语法，而是数据库特定 schema、字段枚举、业务语义、隐性 join 路径和指标口径。
- 专家反馈的价值在于暴露“为什么这里错了”：例如字段值实际写作 `M` 而不是 `male`，某个地区指标应该通过特定列排序，或必须用某条 join 路径才能拿到正确口径。
- 这些反馈不应只用于修正当前 SQL，而应被蒸馏成结构化 memory，供后续相似问题检索复用。

### 论文框架

论文把流程分成两个阶段：

1. **Online learning**：agent 根据 NLQ 和 schema 生成候选 SQL，由 Human Proxy Agent 模拟专家反馈；直到 SQL 正确、超过最大步数，或上下文过长。
2. **Offline execution**：没有新反馈时，agent 只依赖 schema 和已积累 memory 来解新问题。

memory 被拆成四层：

| 层级 | 内容 | 用途 |
|---|---|---|
| Level 0 | 历史 NLQ–SQL 对 | 作为相似问句示例，支持基础 in-context learning。 |
| Level 1 | 从交互轨迹蒸馏出的知识 | 保存专家反馈中暴露的隐性知识，而不是普通 SQL 技巧。 |
| Level 2 | 子任务与 SQL 片段 | 把复杂查询拆成可复用的局部模式，如“按年份过滤开户日期”。 |
| Level 3 | 数据库事实 | 保存 schema 外或 schema 难以直接表达的事实，如枚举值含义、领域字段语义。 |

论文区分了 **Non-procedural agent** 和 **Procedural agent**：

- Non-procedural agent 更像固定模板：用当前 NLQ 检索相似 NLQ–SQL，然后一次性生成或修正 SQL。
- Procedural agent 可以自己决定拆解、规划、检索哪一层 memory、组装 SQL 和验证 schema，因此更适合利用多层记忆。

### 实验读数

实验基于 BIRD Dev set 的 11 个数据库，LLM 使用 GPT-4o，检索 embedding 使用 `text-embedding-ada-002`。

- 在“看过同一批问题”的保留测试里，完整 Procedural Agent（P-3）最终执行准确率约 `81.7%`，高于无程序化推理的基线。
- 在“用训练阶段 memory 解新问题”的泛化测试里，P-3 从约 `32.4%` 初始准确率提升到 `51.3%`，提升 `18.9` 个百分点。
- 只把蒸馏知识塞进非程序化 agent 反而可能降低效果；论文解释是，蒸馏知识会占用 prompt token 并干扰细粒度 SQL 语法。但当它与程序化推理、多层 memory 结合时，能更好修正 join、聚合、schema 理解等推理型错误。
- memory 变大后收益不是线性增加：当相关证据覆盖率不再明显提升时，更大的 memory 会带来检索复杂度和干扰，需要做 memory 管理。

### 对问数系统的启发

这篇源文对内部问数系统更有价值的地方，是把“专家改 SQL”转成一个可积累的学习闭环：

```text
问题 → 生成 SQL → 执行/反馈 → 错误定位 → 领域知识蒸馏 → 分层 memory → 后续检索复用
```

落地时可以把 memory 拆成几类资产：

- **高质量 NLQ–SQL 样例**：保存完整问题、SQL、数据库、执行结果和适用范围。
- **业务事实**：字段枚举值、口径例外、业务实体映射、常见过滤条件。
- **查询子任务**：时间窗口过滤、主外键 join、Top-N、分组聚合、指标分母等可复用 SQL 片段。
- **反馈日志**：记录每次被专家纠正的错误类型、修正理由和可泛化规则。
- **失效标记**：schema 变更、字段废弃、口径调整后，旧 memory 必须降权或重新验证。

对 harness 设计的直接要求：

- 不要只保存“正确 SQL”，还要保存“为什么之前错了”和“这条修正以后在哪类问题中复用”。
- 人类反馈要被结构化：错误组件、相关 schema、修正后的 SQL 片段、可泛化事实、证据来源。
- 生成 SQL 后必须有执行验证、结果解释和异常检查；仅靠 LLM 自评不够。
- 生产环境不能只看 execution accuracy，还要检查列顺序、重复值、权限、成本、敏感字段和指标口径。

### 局限

- 论文主要用 BIRD benchmark 和模拟专家反馈验证，不等价于真实企业数据环境。
- 实验使用 execution accuracy，未完全覆盖列顺序、重复行、权限、成本、数据质量等生产问题。
- schema 动态变化会让历史 memory 失效，论文把 memory 管理留作未来工作。

## 来源

- 源文件：[arXiv:2511.10674](https://arxiv.org/abs/2511.10674) / [PDF](https://arxiv.org/pdf/2511.10674)

## Cubox 回源复核

- 2026-06-30 已从源文 `arXiv:2511.10674v2` 深读并更新本笔记，证据等级可视为 `external_verified`。
- 原 Cubox 同步页只作为发现线索，已按确认删除；强结论以 arXiv 源文为准。整理记录见 [[2-Areas/Journal/Weekly/Cubox Reviews/2025-12 Cubox Review|2025-12 Cubox 复盘]]。
