---
status: todo
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "Claude Code 原理拆解"
source: feishu-export
imported: 2026-05-24
---

## 先看本质

官方把它定义为一个 agentic coding tool：它能读代码库、编辑文件、运行命令，并与开发工具集成。更关键的是，它不是单次输出完就结束，而是沿着固定循环工作，先 gather context，再 take action，再 verify results，然后根据新反馈继续下一轮。

这里真正重要的，不是模型有没有更强的代码知识，而是系统有没有让模型持续接触真实工程状态。如果模型只能看 prompt，它做的还是文本预测；如果它能读文件、查引用、跑测试、看报错、回写代码，它做的才开始接近真实开发。

## 并非补全工具

补全工具的默认前提，是用户已经把上下文挑好、文件打开、目标明确，模型只负责续写；而对于Claude Code，上下文可能不完整，问题位置可能不明确，依赖关系可能散在多个文件里，甚至需求本身也可能需要澄清。

所以 Claude Code 的核心不是 generation first，而是 control first。代码生成只是其中一个动作，甚至未必是最难的动作。真正难的是定位、取证、缩小问题空间、确认影响面、做回归验证。换句话说，Claude Code 不是在优化输出一段code，而是在优化推进一个开发过程。这个视角一旦立住，后面那 30 个工具的设计就会顺很多。

## 30 个工具

Claude Code 官方工具表一共列出 30 个内置工具：

```plain
Agent、AskUserQuestion、Bash、CronCreate、CronDelete、CronList、Edit、EnterPlanMode、EnterWorktree、ExitPlanMode、ExitWorktree、Glob、Grep、ListMcpResourcesTool、LSP、NotebookEdit、Read、ReadMcpResourceTool、Skill、TaskCreate、TaskGet、TaskList、TaskOutput、TaskStop、TaskUpdate、TodoWrite、ToolSearch、WebFetch、WebSearch、Write
```

它暴露出来的不是几个零散能力，而是一整套被刻意设计过的动作空间。

## 工具设计原则

这 30 个工具的第一层逻辑，是把看见问题做完整。`Read` 负责读文件，`Glob` 和 `Grep` 负责在代码库里快速缩小候选范围，`LSP` 提供的是更高阶的代码语义信息：类型错误、警告、定义跳转、引用查找、符号列表、实现定位、调用层次。这意味着 Claude Code 并不只靠 token 级代码理解，它还把语言服务这类静态程序分析信号拉进了 agent loop。再加上 `WebFetch`、`WebSearch`、MCP 资源读取和延迟工具发现，它看到的世界并不只是一段 prompt，而是文件系统、代码语义、外部文档和外部服务共同组成的 observation space。

第二层逻辑，是把“做出动作”做闭环。`Edit`、`Write`、`NotebookEdit` 负责把修改落到文件和 notebook 上，`Bash` 则把这些修改重新送回真实环境里执行。这里 `Bash` 的位置非常关键。它不是个附属功能，而是整个闭环里最接近“验证器”的那部分。Agent SDK 之所以强调 read files、run commands、edit code 是同一套内置能力，就是因为没有命令执行，模型再会写代码也只能停留在纸面上；有了命令执行，模型才有机会把代码改动放回工程环境里自证。`Skill` 的意义也在这里：它不是固定逻辑，而是 prompt 化 playbook，让 Claude 用现有工具去跑一类高频流程。

第三层逻辑，是把“控制复杂度”做成显式动作。`AskUserQuestion` 说明 Claude Code 并不假设需求天然完整，它允许在任务推进过程中主动澄清歧义；`EnterPlanMode` / `ExitPlanMode` 说明“先分析再动手”不是使用习惯，而是内建状态切换；`Agent` 则把子任务分派给独立上下文窗口的 subagent。`EnterWorktree` / `ExitWorktree` 更说明环境隔离在这里不是实现细节，而是一等能力。也就是说，Claude Code 没有把所有复杂性都压到模型内部，而是把规划、澄清、分工、隔离这些高价值控制动作都工具化了。

第四层逻辑，是把“任务不是一次性对话”这件事坐实。`TaskCreate`、`TaskGet`、`TaskList`、`TaskOutput`、`TaskStop`、`TaskUpdate`、`TodoWrite` 这组工具表明 Claude Code 有显式任务状态，而不是把一切都埋在自然语言里；`CronCreate`、`CronDelete`、`CronList` 又把一次性或周期性调度带进会话。很多人谈 coding agent，只盯着 code generation 和 reasoning，但真正进入研发流程以后，任务状态、后台执行和调度能力都会非常重要。Claude Code 把这些东西直接做进工具层，说明它要解决的不是“答一轮”，而是“把任务推进下去”。

## 设计先于生成

到了 Claude Code 这一类系统里，code design 的重要性不是下降，而是上升agent 不是只看你当前这一个文件，它会跨文件搜索、沿引用跳转、联动修改、跑命令验证。如果代码库边界清晰、命名稳定、目录结构干净、模块职责明确，它的定位成本就低，搜索路径也短；反过来，如果项目里充满隐式状态、跨层耦合、历史补丁叠加和职责漂移，Claude Code 当然也能工作，但它会花大量步骤去补足本该由设计提供的结构信息。Claude Code 的定位本来就是理解整个代码库，并跨多个文件和工具完成任务，因此代码结构质量会直接影响 agent 的有效半径。

所以今天再谈 code design，已经不能只说“可维护、可扩展、可测试”。还要再加一条：**可搜索、可定位、可验证**。过去代码设计是写给人看的，现在也开始写给 agent 看。一个对人类工程师友好的代码库，通常也更利于 Claude Code 这种系统理解和操作；两者的标准会越来越接近。这也是为什么我不太认同“有了强 agent，工程设计可以放松”的说法。现实往往相反：agent 越强，设计质量对效率的放大效应越明显。

## 上下文管理

Claude Code 的另一层关键设计，是不把上下文窗口当仓库，而是当缓存。官方 memory 文档写得很清楚：每次会话都从新的上下文窗口开始，但有两套跨会话记忆机制会被载入`CLAUDE.md` 和 auto memory。前者是你写的规则和说明，后者是 Claude 根据纠正与偏好自己积累的笔记；其中 auto memory 每次只加载前 200 行，而 `CLAUDE.md` 也明确建议保持精炼，目标是每个文件控制在 200 行以内。Claude 把这些内容当作 context，而不是强制配置。

所以真正要优化的，不是“我还能往窗口里塞多少信息”，而是“当前这一步决策需要哪一小撮信息”。Anthropic 自己在 context engineering 的工程文章里也把重点放在对 token 的筛选和维护上，而不是简单扩容。对长任务 agent 来说，窗口一旦过脏，模型最先失去的不是知识，而是焦点。Claude Code 这套设计，本质上是在做 working memory discipline：把长期规则放在窗口外，把当前任务真正需要的内容放进窗口里，把噪声尽量挡在外面。

## 分片比协作更重要

Claude Code 提供了 subagent，而且官方明确写到，每个 subagent 都运行在自己的 context window 中，拥有自定义 system prompt、特定工具访问权限和独立权限；它的主要作用包括保留主对话上下文、限制可用工具、重用配置以及把任务路由给更快更便宜的模型。Claude Code 还内置了 Explore、Plan 和 general-purpose 这类 subagent。

很多人一看到多 agent，就会往“角色协作”上想。但在 coding 场景里，更接近工程现实的解释其实是：subagent 首先是一种 context sharding 机制。它最大的收益，不是让几个角色互相讨论，而是把高噪声、局部性很强的探索过程从主上下文里剥离出去。主会话负责任务推进，探索型 subagent 去做只读搜索、局部分析、平行研究，最后把结果压缩回来。这样主上下文的 token 预算才留给真正重要的控制逻辑。对代码任务来说，这个收益通常比“多几个 agent 互评”更直接。

## 先想再改

Claude Code 把 plan mode 做成显式状态切换，这一点很重要。`EnterPlanMode` / `ExitPlanMode` 并不是交互小功能，而是在 runtime 层面承认了一件事：规划和执行不是同一种计算。前者偏全局分析、约束梳理和路径选择，后者偏局部修改、快速试错和结果验证。把两者混在一起，常见后果就是高层方案还没稳定，系统已经被低层实现细节拖走了。

所以在大型重构、迁移、接口统一这类任务里，先只读分析，再形成计划，再进入执行，通常是更稳的节奏。很多工程任务失败，不是因为 agent 不会改，而是因为它改得太早。Claude Code 把这条经验直接做成了工具状态，这其实比单纯强调“模型更会 planning”更有价值，因为它把策略变成了可以执行的操作约束。

## 安全性设计

Claude Code 的安全设计同样不是外围补丁，而是 runtime 的一部分。官方安全文档写得很直接：默认是严格的只读权限，只有当需要编辑文件、运行测试或执行命令时，才请求显式授权；它还提供细粒度权限规则，可以精确控制哪些工具允许、询问或拒绝。权限系统本身也分层：读操作通常不需要审批，Bash 和文件修改则需要更明确的授权。

checkpoint 也是同一类设计。Claude Code 会在每次编辑前自动记录代码状态；每个用户 prompt 都会形成新的 checkpoint；这些 checkpoint 可以跨会话保留，并支持 rewind。意思很明确：它不是假设模型永远不会偏，而是承认长链执行一定会有走偏风险，所以必须把回退成本做低。没有这种可逆性，用户很难真正放手让 agent 做较大范围修改。

再往前一步，就是 sandbox。官方安全文档把 sandboxed bash 定义成带文件系统和网络隔离的执行边界；Anthropic 的工程文章也明确说，沙箱的目标是在预定义边界内减少权限提示，同时保持更高安全性。这里非常关键的一点是：安全不是用来压制自治，而是用来扩大可安全自治的范围。没有边界，agent 只能频繁打断用户；边界一旦清晰，系统反而可以更自动。

## Cubox Review 增补：源码架构视角

`claude code 源码分析-架构篇` 把 Claude Code 看成“终端里的小型 Agent 操作系统”，这个视角适合补充到本笔记：

- 进程入口层负责快路径分流和重型初始化，避免 CLI 每次启动都加载全部运行时。
- 应用外壳层承载 REPL、消息转录、任务视图、IDE 集成和插件交互。
- Agent 运行时层负责构建上下文、流式接收模型输出、解释 tool use、重试、压缩和完成态。
- Tool 与策略层是一等公民，工具定义、权限判断、批处理和调度都在这一层完成。
- 扩展层通过 skills、plugins、MCP 把能力按需接入。
- 多 Agent 与远程层处理子 Agent、后台任务、bridge/remote 场景。

这个分层再次说明：Claude Code 的核心不是“更会补全代码”，而是把交互 UI、agent loop、工具策略、扩展机制和环境隔离合成一个运行时。

## 增补来源

- [[claude code 源码分析-架构篇-2026-03-31]]

## Cubox 回源复核

- 2026-06-29 回源审计结果为 `source_unreachable`：微信原页正文不可见；详见 [[2-Areas/Journal/Weekly/Cubox Reviews/2026-03 Cubox Review|2026-03 Cubox 复盘]] 和 [[2025-12 to 2026-05 Cubox Source Re-Audit]]。
- 本笔记中的 Claude Code 运行时/工具设计判断应优先用官方文档、源码或可访问的一手材料补充核验。
