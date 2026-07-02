---
status: todo
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "Agent 架构模式"
source: cubox-review
created: 2026-06-30
dashboard_type: review-output
dashboard_status: todo
review_source: cubox-review
review_batch: mixed
---

# 常见 Agent 架构模式

> 从 [[6.2 LLM-based Agent 基于大模型的智能体]] 拆出的专项沉淀。这里关注的是 **LLM Agent 内部如何组织规划、行动、观察、反思、并行和资料生成**，而不是 Agent 的完整定义。

## 核心判断

Agent 架构模式本质上是在回答一个问题：**模型什么时候思考、什么时候调用工具、什么时候等待外部反馈、什么时候重新规划或自我修正。**

这些模式不是互斥选项。生产系统更常见的形态是组合式：

```text
Planner → Executor / ReAct loop → Reflection / Verifier → Final result
```

选型时不要先问“哪个模式更高级”，而要看任务结构：

1. **信息是否闭环**：答案是否只依赖题面和上下文？如果需要外部新信息，就要引入工具行动。
2. **计划是否稳定**：任务步骤能否提前拆好？中间结果会不会改变后续步骤？
3. **子任务是否可并行**：多个工具调用是否互不依赖？
4. **产出是否需要修订或证据**：是否需要审稿、引用、事实核验或 verifier？
5. **是否需要先选择推理结构**：复杂任务是否需要先判断“怎么想”，再开始解题？

## 模式地图

| 模式 | 核心流程 | 适合任务 | 主要风险 |
|---|---|---|---|
| ReAct | Thought → Action → Observation 循环 | 搜索、问答、工具调用、外部环境交互 | 循环失控、工具延迟、不确定性累积 |
| Plan-and-Execute / Plan-and-Solve | Planner 生成计划 → Executor 执行 | 长任务、流程相对稳定的复杂交付 | 初始计划过时，需要重规划或人工确认 |
| REWOO | 一次性规划带依赖变量 → Worker 执行 → Solver 汇总 | 依赖链清晰、可把观察隐式压进下一步的任务 | 依赖关系写错会级联失败 |
| LLMCompiler | Planner 输出任务 DAG → 并行执行 → Joiner 合并 | 多个独立工具调用、可并行检索/计算 | 需要正确标注依赖和合并逻辑 |
| Basic Reflection | Generator 生成 → Reflector 批改 → Generator 修改 | 写作、代码、报告修订 | 评价标准不清时容易空泛反思 |
| Reflexion | 初答 + 批判性反思 + 工具/证据 → 修订 | 需要外部证据和引用的改写、研究型回答 | 成本上升，仍需防止“自我合理化” |
| LATS | 树搜索 + 行动 + 反思 + 打分回传 | 高难推理、需要搜索候选路径的问题 | 调用成本和延迟高，工程复杂 |
| Self-Discover | 选择推理模块 → 适配为任务结构 → 执行 | 需要先找到合适推理策略的问题 | 前置开销大，不适合简单任务 |
| STORM | 主题 → 大纲 → 多视角提问/检索 → 长文合成 | 深度研究、百科式文章、综述报告 | 依赖检索质量和引用约束 |

## 一、信息开环：从 CoT 到 ReAct

CoT 和 ReAct 的关键差异不是“有没有思考”，而是 **信息是否会在执行过程中新增**。

- **CoT 是信息闭环**：所有信息在推理开始前已经给定，模型只是把隐式推理显式化。适合数学、逻辑、常识推理，以及不需要外部世界状态的问题。
- **ReAct 是信息开环**：每一步行动会带来新的 observation，后续推理会被工具返回、搜索结果、环境状态或文件内容改写。

ReAct 的基本循环是：

```text
Thought → Action → Observation → Thought → ...
```

因此，判断是否需要 ReAct 的简单标准是：**回答这个问题是否需要模型当前不知道的信息？** 如果需要查询外部数据、调用 API、操作环境或读取文件，就更适合 ReAct；如果只是封闭题面推理，则未必需要工具循环。

落地 ReAct 时有两个容易被忽视的工程点：

- **Observation 不能由模型伪造**：图片材料里的代码示例用 `stop=["\nObservation:"]` 控制模型只输出 Thought 和 Action，避免模型自己编造 Observation。Observation 应来自真实工具执行。
- **few-shot 要业务化**：Question / Thought / Action / Observation 只是骨架，真正有效的是把 few-shot 和 Action 映射到自己的业务场景与工具 API。

ReAct 的边界也必须明确：最大循环次数、工具白名单、停止条件、每步 observation 的结构化记录，以及失败后的恢复策略。

## 二、计划与执行：Plan-and-Execute / Plan-and-Solve

Plan-and-Execute 把 Planner 和 Executor 分开：Planner 先生成任务序列，Executor 按计划执行。它适合步骤相对稳定的任务，例如日报生成、标准报表、确定性数据处理、旅行计划初稿、标准化报告生成。

但图片材料里最值得保留的不是“先计划再执行”这个常识，而是 **Planner 和 Executor 之间的通信协议**。

Planner 不应只输出自然语言描述，而应输出结构化执行计划：

```json
{
  "plan": [
    {"step": 1, "action": "search_flights"},
    {"step": 2, "action": "search_hotels"},
    {"step": 3, "action": "generate_itinerary"}
  ]
}
```

Executor 执行后也应返回结构化结果：

```json
{"step": 1, "status": "success", "result": "..."}
```

这种通信格式决定了系统能否调试、重试、回放和重规划。

生产里更常见的不是“一次性计划到底”，而是 **迭代式重规划**：

```text
Planner 生成计划
→ Executor 执行一步
→ Executor 返回结构化结果
→ Planner 根据成功/失败/部分成功和关键数据调整后续计划
```

如果是长时间运行、外部环境持续变化的任务，还可以升级为事件驱动：Planner 注册监听，Executor 执行并发出事件，Planner 根据事件动态调整计划。

Plan-and-Solve 可以看作对 zero-shot CoT 的结构化增强：先理解问题、抽取变量、制定计划，再逐步执行。它适合多步计算或分解问题；但如果外部状态变化明显，仍然需要 replanning 或 ReAct 式检查点。

## 三、依赖与并行：REWOO / LLMCompiler

REWOO 和 LLMCompiler 都是在优化“工具行动如何被组织”，区别在于一个偏 **依赖变量**，一个偏 **并行调度**。

### REWOO：把观察压进依赖变量

REWOO 可以理解为没有显式 Observation 循环的 ReAct 变体。Planner 一开始就生成带依赖变量的计划，例如 `#E1`、`#E2`，后续步骤引用前面步骤的结果：

```text
Plan: 查询 A → #E1
Plan: 基于 #E1 查询 B → #E2
Plan: 汇总 #E1 和 #E2 → Final
```

典型结构是：

```text
Planner 生成链式计划
→ Worker 按依赖执行任务并填充变量
→ Solver 汇总所有结果形成最终答案
```

它适合依赖链清晰的任务，例如多步检索、审批链、分阶段资料收集。优点是减少模型反复观察和重写计划的开销；缺点是早期依赖设计错误会传导到后续任务。

### LLMCompiler：把可并行任务编译成 DAG

LLMCompiler 解决的不是推理深度，而是执行效率。图片中的对比示例是：ReAct 串行搜索 A 再搜索 B；如果 A 和 B 互不依赖，其实应该并行执行。

LLMCompiler 的流程是：

```text
LLM Planner 生成任务 DAG
→ Task Fetching Unit 尽早调度可执行节点
→ 多个工具并行运行
→ Joiner 合并结果、判断是否完成或重规划
```

它适合多个独立查询、多个指标拉取、多文档并行检索。设计重点包括：

- 计划必须显式标注依赖关系；
- 每个任务有稳定且可引用的 ID；
- `join()` 或合并器必须作为最终动作；
- Planner prompt 要明确要求最大化并行度；
- Task Fetching Unit 和 Joiner 是一等组件，而不是附属实现细节。

## 四、反思与验证：Reflection / Reflexion / LATS

反思类模式可以按成本和能力分成三层。

### Basic Reflection：用于改稿的最小闭环

Basic Reflection 的流程是：

```text
Generator 生成初稿
→ Reflector 给出 critique / recommendations
→ Generator 基于反馈重写
→ 重复 N 次或达到停止条件
```

它适合写作、代码、报告修订。但 critique 必须有明确维度，否则容易变成“再优化一下”这种无效润色。

### Reflexion：用工具和证据增强反思

Reflexion 在 Basic Reflection 上加入外部证据。Responder 先给出初答、反思和搜索 query；工具拿回证据；Revisor 再结合 missing / superfluous / citations 修订回答。

它更适合研究型回答、事实核验和引用驱动的内容生产。与 Basic Reflection 的差别在于：Reflection 主要改表达和结构，Reflexion 要改事实、证据和引用。

### LATS：把候选路径变成树搜索

LATS（Language Agent Tree Search）可以理解为：

```text
Tree Search + ReAct + Planning + Reflection + Reward
```

它不是只生成一个答案再反思，而是展开多个候选节点，对节点执行 action、reflection、score，再把分数回传给父节点，直到找到较优解。

LATS 适合高难推理或探索空间较大的任务，但成本高、延迟大、实现复杂，不应作为普通任务的默认架构。

## 五、推理结构与长文生成：Self-Discover / STORM

### Self-Discover：先决定“怎么想”

Self-Discover 的重点是：模型不直接进入答案，而是先构造任务专属推理结构。

```text
SELECT：从 seed reasoning modules 中选择合适模块
ADAPT：把模块适配到当前任务
IMPLEMENT：生成 task-specific reasoning structure 并执行
```

它适合任务类型不清、需要先选择推理策略的问题。比如一个问题可能需要分解、归纳、风险分析、约束满足或创造性发散；Self-Discover 把“选哪种推理方式”这一步显式化。

对工程实践的启发是：复杂 Agent 不一定要只有一个固定 prompt，可以先让模型选择解决策略，再加载相应的 skills、tools 或 workflow。

### STORM：长文生成是资料组织任务

STORM 的目标是从零生成类似 Wikipedia 的长文。它不是“给模型一个主题让它写长文”，而是分阶段组织资料：

```text
Topic
→ related topics / initial outline
→ 多个 editor persona 提问
→ expert persona 基于检索回答
→ 资料进入 vectorstore
→ refined outline
→ section writer
→ formatter
→ final article
```

它适合深度研究、综述文章和主题报告。关键不是生成能力，而是：

- 用多视角问题逼出覆盖面；
- 用检索和引用支撑事实；
- 用 refined outline 控制文章结构；
- 用 section writer 分块生成；
- 用 formatter 统一成最终文档。

对个人工作流来说，STORM 更接近 Deep Research 工作流，而不是普通写作 prompt。

## 选型规则

| 任务特征 | 优先模式 |
|---|---|
| 只依赖题面和上下文 | CoT / 普通推理 |
| 需要外部未知信息、环境反馈 | ReAct |
| 步骤稳定、交付较长 | Plan-and-Execute |
| 中间结果会改变后续步骤 | Plan-and-Execute + iterative replanning |
| 多个工具调用相互独立 | LLMCompiler |
| 依赖链明确、想减少显式观察轮次 | REWOO |
| 产出需要改稿、审稿 | Basic Reflection |
| 产出需要证据、引用、事实修正 | Reflexion |
| 搜索空间大、候选路径多 | LATS |
| 需要先决定推理策略 | Self-Discover |
| 需要生成长篇综述/研究报告 | STORM |

## 工程规则

1. **不要让模型伪造外部反馈**：Observation、工具结果、检索结果必须来自真实执行。
2. **Planner 输出应结构化**：计划最好是 JSON / DSL / DAG，而不是一段自然语言。
3. **Executor 返回要带上下文**：至少包含成功/失败/部分成功、关键数据、错误原因、可重试信息。
4. **能并行就不要串行 ReAct**：独立工具调用应交给 DAG 调度器并行执行。
5. **长任务默认需要重规划**：一次性计划适合稳定任务，不适合外部环境变化的任务。
6. **反思必须有评价标准**：没有标准的 self-critique 容易变成无效润色。
7. **事实型产出需要证据链**：仅靠 Reflection 不够，要引入工具、引用、verifier 或人工复核。
8. **复杂任务先选策略**：可以先判断任务类型，再选择 ReAct、Plan-and-Execute、Reflection、STORM 等模式。

## 来源与证据

- [AI Agent 几种架构模式 - 掘金](https://juejin.cn/post/7620357552527327267)：公开正文可抓取，证据方式为 `source_fetched_html`。
- [【Agent面试4】 ReAct还是Plan-and-Execute - 小红书](https://www.xiaohongshu.com/discovery/item/6a0c7f4900000000350289a5)：图片内容已在本轮用内置多模态能力识别；用作 ReAct vs Plan-and-Execute 的工程判断补充。
- [Agent 的九种设计模式(图解+代码) - 知乎](https://zhuanlan.zhihu.com/p/692971105)：回源核验已完成，原文直连结果为 403；本轮只从已缓存的图文材料中提取模式线索，按二级证据保留，不作为强结论。

## 与现有笔记的关系

- [[6.2 LLM-based Agent 基于大模型的智能体]]：保留 Agent 基础概念与原理；本文承接其“常见架构模式”部分。
- [[11.5 Harness Engineering 认知]]：如果讨论生产级 Agent，还要把这些模式放回 harness、工具、安全、状态、反馈和验证系统里看。
