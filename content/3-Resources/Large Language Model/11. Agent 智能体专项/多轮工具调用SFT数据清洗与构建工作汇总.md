---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: "多轮工具调用SFT数据清洗与构建工作汇总"
source: feishu-export
imported: 2026-05-24
---

# 知识回顾

[[11.1 tool-use数据合成|11.1 tool-use数据合成]]

# 1. 相关工作概述

> 2025 下半年之后，多轮工具调用数据构建的主线已经从 **LLM 根据 API 文档合成对话** 转向 **真实工具或可执行环境中的可验证轨迹**
> 这一点在 **TOUCAN、MiniMax M2.1、GLM-5、Qwen3-Coder-Next、DIVE、WebResearcher、Tongyi DeepResearch** 等工作中非常明显。TOUCAN 用真实 MCP 工具构造 1.5M 轨迹，MiniMax M2.1 把 GitHub PR、Docker 环境、F2P/P2P 测试、多 scaffold rollout 接入 SFT/RL，GLM-5 把 agentic engineering 放进训练主线，Qwen3-Coder-Next 明确使用可执行 coding environments 和 verifiable tasks
> 相关工作很多，可以对它们的清洗构建 pipeline 先进行关键点总结如下：
> 1. **可执行环境优先**，数据必须能执行或能被 verifier 检查
> 2. 多轮轨迹不能只做整条过滤，必须做 **turn-level filtering 和 loss mask**
> 3. **trace first 或 evidence first**，任务和轨迹的构造越来越多从真实工具、真实 trace、真实 evidence 出发
> 4. **RAG / Deep Research** 类工具数据需要 **step-level 或 hop-level validation**
> 5. model-aware 动态数据飞轮
> 可以参照的相关工作，按照是否直接服务多轮工具调用数据构建的标准，其优先级如下：

| **优先级** | **工作** | **核心价值** |
| ------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 第一优先级 | TOUCAN, ToolMind, MiniMax M2.1, GLM-5, Qwen3-Coder-Next, Tongyi DeepResearch, WebResearcher, DIVE, ASTRA | 直接改变多轮工具数据构建和清洗方式 |
| 第二优先级 | AgenticRAGTracer, AgentSim, FunReason-MT, ToolACE-MT, LoopTool, EigenData, AgenticQwen, Kimi K2.5/K2.6, Step 3.5 Flash | 解决局部关键问题，例如 RAG step validation、动态过滤、并行工具轨迹 |
| 背景和评估 | ToolBench, APIGen, BFCL, τ-bench, τ²-bench, ToolSandbox | 定义早期范式、评估维度和错误类型 |

# 2. 早期工作

## 2.1 ToolLLM / ToolBench

> https://arxiv.org/abs/2307.16789

ToolLLM 的 ToolBench 是这一方向早期影响力最大的工作之一。其从 RapidAPI 收集 16464 个 RESTful API，覆盖 49 个类别，用 ChatGPT 自动构造 instruction，并用搜索式 solution path annotation 生成工具调用路径。其还提出了 **DFS decision tree 风格的评估**，让 **工具调用从单步 API 选择走向多步决策**

但从今天看，它的局限也很明显：

| **问题** | **对当前 SFT 清洗的影响** |
| ------------------------- | ------------------------------- |
| API 来源偏静态，真实可执行性有限 | 很多轨迹只能学格式，不能验证真实状态变化 |
| 合成依赖 ChatGPT role-play | 容易产生貌似合理但不可执行的轨迹 |
| 缺少 turn-level 错误定位 | 一条 trajectory 里局部错误会污染整条 SFT 样本 |
| 对 stateful multi-turn 支持弱 | 不适合订单、日历、数据库、客服、文件系统等业务工具 |

## 2.2 APIGen

> https://arxiv.org/abs/2406.18518

APIGen 构建了 3673 个 executable APIs，覆盖 21 类，并用 **format checking、actual function executions、semantic verification 三层验证**，最终得到约 60k 高质量 entries

APIGen 的价值在于把 **工具调用数据质量从 LLM judge 拉回到可执行检查**。对于今天的多轮数据清洗，这个思想仍然有效：

```plain
先检查格式
再执行工具
再做语义验证
最后才考虑语言质量
```

不过，APIGen 本身主要还是单轮或较短工具调用，不能覆盖 **长程状态依赖、用户目标变化、多工具协作、RAG evidence grounding**

# 3. 2024 到 2025 上半年的衔接工作

## 3.1 BFCL

> https://proceedings.mlr.press/v267/patil25a.html

BFCL 已经成为 function calling 评估的重要基准。它覆盖 **serial calls、parallel calls、多语言 AST evaluation、abstain 场景，以及 stateful multi-step agentic setting**

对清洗的启发：

```plain
不要只看 tool name
还要看参数 AST 是否等价
还要看 parallel / serial dependency
还要看是否应该 abstain
还要看 stateful multi-step 是否成功
```

## 3.2 ToolSandbox

> https://arxiv.org/abs/2408.04682

ToolSandbox 强调 **stateful tool execution、implicit state dependencies、built-in user simulator、intermediate 和 final milestones**，并专门指出 State Dependency、Canonicalization、Insufficient Information 等挑战。

这说明 **多轮工具调用数据不能只奖励调用工具**。有时正确行为是追问用户，有时是拒绝，有时是等待更多信息

## 3.3 τ-bench 和 τ²-bench

> https://arxiv.org/abs/2406.12045，https://arxiv.org/abs/2506.07982

* τ-bench 把 agent 和 user simulator 放在动态对话中，agent 需要调用 domain API 并遵守 policy，评估时比较数据库最终状态和目标状态，还使用 pass^k 衡量可靠性
* τ²-bench 把环境做成 dual-control，用户和 agent 都可以在共享动态世界里使用工具，并通过 compositional task generator 和更可靠的 user simulator 构造复杂任务

对数据清洗的核心启发是：

```plain
参考轨迹相似不等于任务成功
最终文本正确不等于环境状态正确
状态型工具必须检查 final state diff
```

这对订单、客服、日历、数据库、文件系统、办公自动化工具尤其关键

## 3.4 APIGen-MT

> https://arxiv.org/abs/2504.03601

APIGen-MT 明确面向 **multi-turn tool-using agents**。它的两阶段 pipeline 先生成 **detailed task blueprints 和 ground-truth actions**，并用 committee of LLM reviewers 与 **iterative feedback 审查**，再通过 **simulated human-agent interplay 把 blueprint 转成 interaction trajectories**，它发布了 5K synthetic trajectories

它的价值在于把 “先有蓝图，再生成对话” 做得比较清楚，可以迁移成：

```plain
instruction 不是唯一监督
应该恢复或构造 task blueprint
然后检查 trajectory 是否完成 blueprint 中的 ground-truth actions
```

## 3.5 Magnet

> https://arxiv.org/abs/2503.07826

Magnet 关注 **multi-turn function calling data**。从 **function signature path 自动、迭代地翻译出 query 和 executable function calls，并构造 function interaction graph**。它还生成 **positive 和 negative trajectories，用于训练 Magnet-14B-mDPO**

Magnet 的清洗启发是，**坏轨迹不一定全部丢掉。某些负例可以用于 preference tuning 或 DPO，但前提是负例错误类型要清楚，例如参数错误、工具顺序错误、遗漏必要工具、错误终止**

# 4. 2025 下半年到 2026 上半年的主干工作

## 4.1 TOUCAN

> https://arxiv.org/abs/2510.01179

TOUCAN 构造了 1.5M trajectories，来自近 500 个真实 MCP servers，目标是 **realistic、complex、multi-tool、multi-turn 的工具使用数据**。它使用 **五个模型做 query generation，做 model-based filtering，再用三个 teacher models 和两个 frameworks 生成轨迹，并结合 rule-based 和 model-based validation**

TOUCAN 的最大价值是把数据源从“静态 API 文档”转向“真实 MCP 工具执行”，对应四层过滤：

```plain
工具可用性过滤
任务质量过滤
轨迹执行过滤
最终回答质量过滤
```

## 4.2 ToolMind

> https://arxiv.org/abs/2511.15718

ToolMind 指出高质量多轮工具轨迹稀缺，而且 **trajectory-level validation 会漏掉 turn-level 错误**。它构建了 160k synthetic trajectories，覆盖 20k tools，并增强了 200k open-source samples。方法上，它通过 **参数相关性构建 function graph，用 multi-agent simulation 生成对话，再用 fine-grained turn-level filtering 清洗**

这篇最值得吸收的是 **turn-level 视角**。对 SFT 数据来说，一条多轮轨迹经常不是全好或全坏，而是：

```plain
第 1 轮工具选择正确
第 2 轮参数部分错误
第 3 轮观察被错误总结
最终 output 又可能部分正确
```

如果只 **整条保留或整条删除，会浪费大量可用监督**，也 **会把局部错误带进训练**。ToolMind 的思想可以直接落地为：

```plain
把每个 assistant turn 切成一个训练样本
history 作为 input
当前 assistant message 作为 label
只对当前 assistant tokens 计算 loss
坏 turn 做 mask、修复、降权或截断
```

## 4.3 DIVE

> https://huggingface.co/papers/2603.11076

DIVE 的思路很值得重视。它反过来做数据：**先执行多样化真实工具，得到 evidence traces，再 reverse-derive 被这些 traces 支撑的 tasks**。它强调 structural diversity，包含 tool-pool coverage 和 per-task toolset variety。论文报告使用 373 个工具、五个领域，构造 48k SFT trajectories 和 3.2k RL tasks，并认为 diversity 比单纯 quantity 更关键

传统清洗常问：

```plain
trajectory 是否回答了 instruction
```

DIVE 提醒我们还要反过来问：

```plain
instruction 是否真的能由 trajectory 中的 evidence 推出
trajectory 是否包含足够证据支持 final output
这个工具组合是否有独特价值，还是只是重复模板
```

对于 RAG 和调研轨迹，**trace-first 是比 instruction-first 更稳的路线**

## 4.4 ASTRA

> https://huggingface.co/papers/2601.21558

ASTRA 提出用 **tool-call graph topology 合成结构化轨迹，再把 decomposed QA traces 转成 code-executable、rule-verifiable environments，并结合 SFT 和 online RL，用 trajectory-level rewards 训练 agent**

核心启发：SFT 数据和 RL 环境不要割裂，每条高价值工具轨迹最好带 verifier metadata，例如：

```json
{
  "verifier_type": "execution | rule | llm_judge | human",
  "expected_state_diff": "...",
  "expected_final_facts": ["..."],
  "tool_dependency_graph": ["..."]
}
```

## 4.5 WebResearcher / WebFrontier

> https://arxiv.org/abs/2509.13309

WebResearcher 把 deep research 建模成 **MDP**，agent 会维护 **evolving reports 和 focused workspaces**。它的数据引擎 WebFrontier 使用 **tool-augmented complexity escalation 生成训练数据，并通过质量控制保证 factual accuracy 和 verifiability**

这篇对数据 pipeline 的贡献很清楚：

| **阶段** | **启发** |
| --------------------- | ------------------------------------------------------- |
| seed generation | 从多源材料产生初始问题 |
| complexity escalation | 用 search、browser、academic search、Python 等工具把简单问题升级为复杂问题 |
| QC | 过滤太简单、不可解、不一致、不可验证的数据 |
| trajectory training | 把 state、think、action、observation、report update 作为序列监督 |

这类 pipeline 特别适合构建“**工具调研**”数据，因为 **真实研究问题往往不是一次搜索能解决，而是需要多源交叉验证和阶段性归纳**

## 4.6 WebSailor-V2

> https://arxiv.org/abs/2509.13305

WebSailor-V2 关注 **complex information-seeking**。它提出通过 **structured sampling 和 information obfuscation 构造 high-uncertainty tasks**，再用 RFT cold start 和 DUPO agentic RL 训练。论文目标是缩小开源模型和 proprietary deep research agents 的差距

对 SFT 清洗的启发是，不要只保留容易验证、答案显然的样本。Deep research agent 真正需要的是：

```plain
信息不足
来源冲突
查询空间大
需要消歧
需要多步综合
```

但这些困难样本 **必须有可靠 verifier，否则会变成高噪声数据**

## 4.7 Trajectory2Task

> https://arxiv.org/abs/2601.20144

Trajectory2Task 也属于 trace-first 思路。它指出 **真实用户意图常常 ambiguous、changing、infeasible，因此直接从用户请求构造任务会引入噪声**。先通过 **multi-turn exploration 得到 valid tool-call trajectories，再把这些轨迹转成 user-facing tasks，并控制 intent adaptation**

这对数据清洗的意义是，很多多轮数据里的 instruction 可能有问题：

```plain
目标不清
信息不足
和工具能力不匹配
中途用户目标变化
最终答案和原 instruction 不一致
```

此时可以 **用 trajectory 反向校验 instruction，甚至重写 instruction，而不是直接丢弃轨迹**

## 4.8 FunReason-MT

> https://arxiv.org/abs/2510.24645

FunReason-MT 针对 multi-turn function calling 数据构造，指出现有方法常依赖随机环境采样或多智能体 role-play，难以得到 targeted、hard、具有 logical dependency 的样本。它提出 **Environment-API Graph Interactions、Advanced Tool-Query Synthesis 和 Guided Iterative Chain**

对清洗来说，可以转成如下检查：

```plain
当前 tool call 的前置条件是否满足
该 tool 是否依赖之前某个 observation
参数是否来自历史 evidence，而不是模型编造
工具顺序是否存在因果关系
```

## 4.9 LoopTool

> https://arxiv.org/abs/2511.09148

LoopTool 批评静态 synthetic pipeline 把 generation 和 training 分开，导致模型弱点覆盖不足、noisy labels 留存。它提出 **Greedy Capability Probing、Judgement Guided Label Verification 和 Error Driven Data Expansion，做全自动 model-aware data evolution**

这对清洗特别实用，因为“高质量数据”不是绝对的。对目标模型来说，数据可以分成：

```plain
已经稳定会的简单样本，降采样
永远失败且 verifier 不通过的坏样本，删除
模型失败但 verifier 通过的难样本，优先保留
judge 分歧大的样本，进入人工抽检池
```

## 4.10 ToolACE-MT

> https://arxiv.org/abs/2508.12685

ToolACE-MT 关注 **multi-turn multi-step 交互数据生成**。它批评 autoregressive multi-agent simulation 成本高，提出 **non-autoregressive iterative generation，包含 coarse-grained initialization、iterative refinement 和 offline verification**。方法中使用 skeleton、mask-and-fill，以及 rule / model checks

它更偏生成效率和可控性。对清洗的价值是：

```plain
先生成完整骨架
再填充 turn-level 内容
最后做 offline verification
```

比完全自由生成的多轮对话更容易清洗和定位错误

## 4.11 AgenticRAGTracer

> https://arxiv.org/abs/2602.19127

AgenticRAGTracer 针对 Agentic RAG。它指出现有多跳 QA benchmark 多只看 final Q/A，缺少 intermediate hop-level questions，难以诊断 agentic RAG 的中间失败。它提供 step-by-step validation，覆盖多个领域，共 1,305 个 data points

它不是通用多轮工具 SFT pipeline，但对 RAG 工具数据清洗非常重要。可以把它转成如下结构：

```plain
instruction
hop_1_subquestion
search_or_retrieve_call_1
evidence_1
hop_2_subquestion
search_or_retrieve_call_2
evidence_2
aggregation_step
final_output
```

清洗时要检查：

```plain
每一跳是否必要
每一跳 evidence 是否支持下一跳
是否过早聚合
是否扩展到无关方向
最终答案是否真正来自 evidence
```

## 4.12 AgentSim

> https://arxiv.org/abs/2604.26653

AgentSim 是更新的 RAG trace 构建平台，强调训练 trustworthy agentic LLMs 不 **能只依赖 final answer，还需要 grounded reasoning process**。它开源了一个平台，用 **任意 document collection 模拟 RAG agents，生成 verifiable stepwise traces，并结合 multi-model validation 和 active human-in-the-loop**。其 Agent-Trace Corpus 包含 103,000 多个 verifiable reasoning steps

AgentSim 的价值在于，它把人工标注压力放在模型分歧大的困难步骤，而不是全量人工检查。这对大规模数据清洗很现实：

```plain
规则和 verifier 自动通过的样本直接保留
多模型 judge 一致拒绝的样本删除
多模型分歧的样本送人工
```

## 4.13 TRACER

> https://arxiv.org/abs/2602.11409

TRACER 是风险检测方法。它 **关注 tool-using human interactions 中稀疏但关键的失败片段，例如 looping、incoherent tool use、user-agent miscoordination**。它结合 surprisal、situational awareness、repetition、tool-grounded coherence gaps 和 tail-focused risk

它适合作为后处理 scorer：

```plain
重复调用同一工具
工具 observation 和下一步行动不一致
用户目标变化后 agent 没有跟上
模型置信异常低
轨迹尾部突然崩坏
```

这类样本不一定全部删除，但应该降权或送人工审查

# 5. 模型技术报告中的最新 pipeline

## 5.1 MiniMax M2.1

> https://www.minimax.io/news/post-training-experience-and-insights-for-agent-models

* MiniMax M2.1 官方 post-training 文章把 Agentic Data Synthesis 分成三类：**Real-data-driven SWE Scaling、Expert-driven AppDev、Virtual long-horizon task synthesis WebExplorer**
* SWE Scaling 部分 **从 GitHub PR 和 commit 出发，先做质量过滤**，例如保留 merged PR、要求相关 test case，然后为 **每个 PR 构造 runnable Docker environment**。不是直接写脚本完事，而是 **让 agent 在 sandbox 中反复 build 和 self-correct，直到环境可运行**
* 验证方面，MiniMax M2.1 把 bug-fix 任务转成 F2P 和 P2P 测试。golden patch 通过后才视为有效，再让模型在 sandbox 中修 bug。P2P 测试用于防止模型修复一个 bug 后引入新 bug。它还用 model-based validation 检查 test cases 和 problem description 是否一致，并补充缺失信息
* 最终 SWE 数据包含 **original problem descriptions、fully verifiable rewards、runnable Docker environments，** 并用于 SFT 和 RL。SFT 阶段使用 multi-scaffold rejection sampling，RL 阶段强调 multi-scaffold training
* AppDev 部分也很有价值，用 **Expert-in-the-Loop 设计 prompts、meta-queries、rubric-based rewards，并使用 Agent-as-a-Verifier 部署 app，在 sandbox 中通过 Playwright 等工具交互打分**
* WebExplorer 部分对应调研类工具数据。它让 **agent 自由探索网页构造信息密集 seed questions，再通过 removal、obfuscation、substitution 增强问题复杂度**
* M2.1 还明确说，**multi-turn tool usage 会带来 external-tool noise，使 trajectories 更 extreme、更 off-policy 或出现 anomalous statistics**，因此 **使用 multiple importance sampling和 PPO-based trajectory filtering 过滤异常轨迹**

## 5.2 MiniMax M2.5 和 M2.7

> https://www.minimax.io/news/minimax-m25，https://minimaxi.com/news/minimax-m27-zh

M2.5 强调搜索和工具调用效率，相比 M2.1 使用约 20% 更少 rounds，同时在 office work 中和金融、法律、社科等领域专业人士合作构建数据，并用 **Cowork Agent evaluation framework 评估 deliverable quality 和 trajectory professionalism**

M2.7 的 API 文档对数据格式有启发，强调 **Interleaved Thinking**，模型可以在每轮工具交互之间推理，并要求多轮 function call 对话保留完整 assistant response，尤其是 reasoning\_details / thinking 一类字段。

这意味着原始日志阶段不应该只保留：

```plain
{"role": "assistant", "tool_calls": [...]}
```

更合理的是保留：

```plain
{
  "role": "assistant",
  "content": "...",
  "reasoning_or_thinking_field": "...",
  "tool_calls": [...]
}
```

训练时是否使用 reasoning 字段可以另行决定，但清洗阶段不要提前丢失

## 5.3 GLM-5

> https://arxiv.org/html/2602.15763

* GLM-5 的报告标题就是 **From Vibe Coding to Agentic Engineering**。强调 long-horizon agentic engineering，并提出异步 RL 基础设施和异步 agent RL 算法，让模型从复杂长程交互中学习。
* GLM-5 的训练在 mid-training 中强调 **long-context agentic data**。在 RL 稳定性上，GLM-5 会 **抑制 excessive mismatch ratio 的样本**，并 **使用 DSA 稳定 RL 过程。这可以理解为对 off-policy 或 mismatch trajectory 的过滤思想**
* GLM-5 构建了 **内部 ToolCall-Badcase，从生产失败案例中整理 200 个 curated cases，评估 tool selection 和 argument correctness**。这对数据清洗很直接：**真实 badcase 应该反向进入清洗规则库和 hard negative 数据池**

## 5.4 Qwen3-Coder-Next

> https://huggingface.co/papers/2603.00729

Qwen3-Coder-Next 核心是大规模合成 verifiable coding tasks，并配套 executable environments，让模型通过 mid-training 和 RL 从环境反馈中学习。其 **multi-turn agentic coding data 使用 synthetic tasks，轨迹由 SWE-agent、Mini-SWE-agent、OpenHands、Claude-Code、Qwen-Code、Terminus 等多个 agent frameworks 生成，teacher model 是 Qwen3-Coder-480B-A35B-Instruct，并用严格 rule-based filtering 删除 missing termination signals、task failures、malformed tool calls**

迁移价值：

```plain
同一任务用多 scaffold rollout
删除缺失终止信号的数据
删除 task failure 数据
删除 malformed tool call 数据
保留 execution-verified trajectories
用多种 tool chat template 提升泛化
```

## 5.5 AgenticQwen

> https://arxiv.org/abs/2604.21590

AgenticQwen 面向真实设置中的 multi-step reasoning 和 tool use，用 synthetic data 加少量 open-source data 做 multi-round RL，并结合 reasoning RL 与 agentic RL。它提出 **dual data flywheels：reasoning flywheel 从错误中构造更难任务，agentic flywheel 把线性 workflows 扩展成 multi-branch behavior trees**

它的价值在于 data flywheel。对 SFT 清洗来说，可以借鉴：

```plain
先用模型跑已有数据
收集失败类型
把失败样本转成更难任务
把线性工具路径扩展成多分支工具路径
再进入下一轮训练和过滤
```

## 5.6 Kimi K2.5 / K2.6

> https://arxiv.org/pdf/2602.02276, https://www.kimi.com/blog/kimi-k2-6

Kimi K2.5 公开材料强调 **self-directed Agent Swarm**。它可以在复杂任务中自 **组织最多 100 个 sub-agents，并行执行最多 1500 次工具调用，端到端时间相比 single-agent 最多降低 4.5 倍**

Kimi K2.6 进一步扩展到最多 **300 个 sub-agents**，超过 4000 次 tool calls / workflow steps。通过 result quality、true parallelism、sub-task completion 等 reward 维度避免 serial collapse 和 fake parallelism。它还使用 Critical Steps metric 和 context sharding

Kimi K2.5 / K2.6 主要对并行多智能体工具调用和 orchestration 技术说明，不是完整 SFT 数据清洗 pipeline

如果数据是：

```plain
instruction
orchestrator plan
subagent_1 tool trajectory
subagent_2 tool trajectory
subagent_3 tool trajectory
aggregation
final_output
```

那么清洗时要额外检查：

```plain
子任务是否完成
并行是否真实有效
是否存在 fake parallelism
aggregator 是否忠实整合 sub-agent outputs
critical path 是否被缩短
```

# 6. 统一的数据清洗 pipeline

目标格式：

```json
{
  "instruction": "...",
  "tool_calls_and_observations": [
    "... n rounds ..."
  ],
  "final_output": "..."
}
```

## 6.1 统一数据结构

先把所有数据归一化成可审计格式：

```json
{
  "instruction": "...",
  "tool_schema_snapshot": [
    {
      "name": "...",
      "description": "...",
      "parameters": {},
      "version": "...",
      "side_effect": true
    }
  ],
  "messages": [
    {"role": "user", "content": "..."},
    {
      "role": "assistant",
      "content": "...",
      "tool_calls": [
        {"name": "...", "arguments": {}}
      ]
    },
    {
      "role": "tool",
      "name": "...",
      "content": "...",
      "status": "success"
    },
    {"role": "assistant", "content": "..."}
  ],
  "final_output": "...",
  "metadata": {
    "source": "...",
    "generator": "...",
    "environment_id": "...",
    "verifier_type": "...",
    "expected_state_diff": "...",
    "target_tools": [],
    "difficulty": null
  }
}
```

重点是 `tool_schema_snapshot`。没有 schema snapshot，就无法判断历史 tool call 在当时是否合法。工具参数、权限、版本、返回格式都会变

## 6.2 硬过滤

先做确定性过滤，不要一开始就用 LLM judge：

```plain
tool name exists
arguments parseable
required arguments present
argument type valid
enum value valid
no malformed tool call
no missing tool observation
no missing final answer
no missing termination signal
no repeated identical loop
no unhandled tool error
no credential leakage
no local path leakage
no private key / token leakage
```

这部分可以直接吸收 APIGen、Qwen3-Coder-Next、MiniMax M2.1、TOUCAN 的经验。格式、执行、终止信号、工具失败和环境失败必须先被硬规则处理

## 6.3 execution replay 和 verifier

能 replay 的工具轨迹必须 replay。不能 replay 的至少做局部 verifier

检查内容包括：

```plain
工具是否成功执行
返回状态是否和预期一致
数据库 / 文件 / 订单 / 日历最终状态是否正确
中间 observation 是否被下一步正确使用
final_output 是否由 observation 支撑
```

对于状态型工具，优先看 final state diff，而不是参考轨迹逐步一致

## 6.4 instruction 质量过滤

不要默认 instruction 是金标准。要单独给 instruction 打分：

```plain
clarity
realism
verifiability
tool necessity
tool selection difficulty
domain validity
constraint completeness
ambiguity level
safety compliance
```

建议删除或降权：

```plain
不用工具也能直接回答的任务
工具无法完成的任务
缺少必要信息且没有追问空间的任务
instruction 和 final_output 目标不一致的任务
明显模板化重复任务
只能靠编造完成的任务
```

TOUCAN、DIVE、Trajectory2Task 这类工作都说明，instruction 本身也需要被验证，不能只把轨迹当噪声源

## 6.5 trajectory 质量过滤

整条轨迹至少检查：

```plain
goal alignment
cross-turn coherence
tool-use necessity
tool-use sufficiency
dependency validity
order validity
observation faithfulness
error recovery quality
final answer groundedness
completeness
conciseness
no hallucinated observation
no hidden unsupported assumption
```

尤其要查两种坏数据：

```plain
工具返回 A，assistant 总结成 B
final_output 写得很顺，但 observation 根本不支持
```

LLM judge 最容易放过这种数据，所以必须结合 verifier 和 evidence check

## 6.6 turn-level filtering 和 loss mask

这是多轮工具 SFT 最关键的一步。不要整条保留或整条删除。应该把每个 assistant turn 切成训练样本：

```plain
sample_k.input =
  instruction + history before assistant_turn_k

sample_k.label =
  assistant_turn_k

loss =
  only assistant_turn_k tokens
```

处理规则：

| **问题** | **处理** |
| ---------------------------------- | ----------------------- |
| tool name 不存在 | 删除该 turn，通常截断后续依赖 turn |
| JSON 或参数格式错 | 自动修复后降权，无法修复则删除 |
| 工具选择可用但不最优 | 保留但降权 |
| observation 被错误总结 | 删除该 assistant turn |
| final\_output 有 unsupported claims | 删除或重写 final turn |
| 中途 loop | 截断到 loop 前最后一个有效 turn |
| 工具失败但 assistant 正确恢复 | 保留，作为 error recovery 数据 |

ToolMind 的 turn-level filtering 是这里最直接的参考

## 6.7 RAG / Deep Research 专用过滤

如果工具包含 search、browser、retriever、paper search、file parser、Python analysis，需要额外检查：

```plain
每一跳 subquestion 是否清楚
search query 是否服务于当前 subgoal
visited source 是否真的被使用
intermediate summary 是否忠于 source
是否存在 source hallucination
是否遗漏关键来源
是否 premature collapse
是否 over-extension
是否重复搜索
是否把过期信息当最新信息
final_output 是否有 evidence grounding
```

AgenticRAGTracer、AgentSim、WebResearcher、Tongyi DeepResearch、Step-DeepResearch 都指向同一个结论：Deep Research 数据不能只看最终答案，要看 **中间 evidence chain**

## 6.8 多样性和去重

不要只按 instruction embedding 去重。多轮工具数据应按以下 signature 分桶：

```plain
instruction embedding
toolset
tool-call graph
argument schema
domain
number of turns
dependency depth
final answer type
state transition type
error recovery pattern
persona / user behavior
```

DIVE 的结论很重要：结构多样性比单纯数量更关键

高价值但容易被低估的模式包括：

```plain
用户补充约束
工具失败后重试
工具返回空结果后换策略
发现信息冲突后交叉验证
需要追问用户
需要拒绝或 abstain
需要并行调用多个工具
```

## 6.9 model-aware 动态数据飞轮

静态过滤后，应该让目标模型跑一轮，再重新分桶：

```plain
模型稳定答对，verifier 也认可：降采样
模型稳定答错，verifier 认为数据正确：保留为高价值难例
模型稳定答错，verifier 也失败：删除或人工审查
模型输出和 judge 分歧大：进入人工抽检池
某一类工具持续失败：做 error-driven expansion
```
