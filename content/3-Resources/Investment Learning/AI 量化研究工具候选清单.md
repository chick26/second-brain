---
status: active
created: 2026-07-15
updated: 2026-07-15
source: cubox-review
topic: AI 辅助量化研究工具
tags:
  - cubox
  - field/finance
  - topic/ai
  - topic/llm
dashboard_type: review-output
dashboard_status: done
review_source: cubox-review
review_batch: 2026-W29
---

# AI 量化研究工具候选清单

> [!warning] 使用边界
> 这是一份研究与工程选型清单，不是策略推荐、收益承诺或真实交易方案。工具能力均以其官方仓库/文档为准；必须经过可复跑回测、样本外验证、交易成本与风险约束检验，才能进入投资研究流程。

## 结论先行

- 当前优先级不是再接一个“自动交易框架”，而是给现有 [[金融投研 Agent 工作流]] 增加可复跑的研究实验层。
- 第一阶段只评估 `Qlib`（研究实验）与 `vectorbt`（快速筛选/参数探索）；二者产出都只能作为候选证据，不能直接改变仓位。
- `OpenBB` 适合补数据接入，`TradingAgents` 与 `FinGPT` 适合辅助文本研究；它们不能替代当前的来源闸门、风险席或最终仲裁。
- `LEAN`、`vn.py`、`Qbot` 面向回测/执行工程，当前 eco-learning 保持只读 Futu 账户和不下单边界时，不应接入执行链路。
- “机构开源仓”里真正贴近当前阶段的是数据版本、时序处理、探索和报告基础设施，不是又一套自动荐股系统；先选最小组件，不整包搬运。

## 已核验工具

| 工具 | 已核验用途 | 适合放入的研究位置 | 当前建议 | 主要边界 |
|---|---|---|---|---|
| [Qlib](https://github.com/microsoft/qlib) | AI 导向量化研究平台，覆盖数据、模型、组合/回测与评估模块 | 线索后的特征/模型实验 | 第一优先级：用固定样本和 walk-forward 实验验证一个假设 | 数据版本、泄漏检查和交易成本必须单独记录。 |
| [vectorbt](https://github.com/polakowo/vectorbt) | 基于 Python/NumPy 的组合建模与绩效统计组件 | 策略筛选、参数敏感性与基准比较 | 第一优先级：作为快速研究工具；结果须由第二套回测复核 | 不能把回测速度或单一指标当作可实盘结论。 |
| [OpenBB](https://github.com/OpenBB-finance/OpenBB) | 面向分析师、量化与 AI Agent 的金融数据平台 | 数据源适配与研究素材整理 | 第二优先级：先与现有 Futu/公开来源做字段、许可和时间戳对齐 | 不替换当前已审计的数据源，也不将供应商返回值视为原始披露。 |
| [TradingAgents](https://github.com/TauricResearch/TradingAgents) | 多 Agent 的 LLM 金融交易研究框架 | 研究问题拆解、论点/反证草案 | 第二优先级：只做离线对照实验 | 不可替代 news、fundamentals、valuation、tape、risk 的独立证据。 |
| [FinGPT](https://github.com/AI4Finance-Foundation/FinGPT) | 金融领域 LLM、情绪与信息抽取研究资源 | 新闻/公告文本的候选信号 | 第二优先级：仅对有可追溯来源的文本做离线评估 | 模型输出不是事实、估值或交易指令。 |
| [FinRL](https://github.com/AI4Finance-Foundation/FinRL) | 金融强化学习的教育与研究原型；项目也明确区分其与后续生产导向栈 | 长期学习与研究基线 | 第三优先级：仅用于学习/benchmark | 强化学习回测不等于稳健实盘；不可越过风险预算。 |
| [QuantConnect LEAN](https://github.com/QuantConnect/Lean) | 支持 Python/C# 的模块化事件驱动回测与实盘引擎 | 以后需要事件驱动复核时 | 暂不接入 | 当前不下单；接入需单独处理数据、券商、密钥与执行风险。 |
| [vn.py](https://github.com/vnpy/vnpy) | Python 开源量化交易平台开发框架 | 国内市场/事件驱动工程的候选 | 暂不接入 | 需独立评估市场、接口、风控和运行维护成本。 |
| [Qbot](https://github.com/UFund-Me/Qbot) | 本地部署的 AI 辅助量化投研平台 | 工程参考与原型对照 | 暂不接入 | 先核验依赖、数据源、许可证和安全模型；不导入账户凭据。 |

## 机构开源仓的可用子集

“22 个开源仓”经原帖 23 张图片 OCR 后，真正与当前研究实验层有关的不是 22 个都安装，而是下面 6 个基础设施候选。用途已再次以官方 GitHub 仓库核验；许可证、维护成本和数据迁移仍需在采用前单独审计。

| 工具 | 官方定位 | 对当前流程的价值 | 结论 |
|---|---|---|---|
| [Flint](https://github.com/twosigma/flint) | Apache Spark 时间序列库 | 只有在 tick/面板数据已大到需要 Spark 时，才考虑容差时间连接与分布式处理 | 当前数据规模下过重，保留观察。 |
| [ArcticDB](https://github.com/man-group/ArcticDB) | 面向 Python DataFrame 的高性能 serverless 数据库 | 可用于版本化行情/因子实验数据，减少 CSV 漂移 | 值得后续做小型数据版本实验；先核验许可和备份策略。 |
| [D-Tale](https://github.com/man-group/dtale) | pandas 数据结构可视化器 | 快速检查缺失值、分布、相关性与异常行 | 可作为人工 QA 工具，不进入自动决策链。 |
| [Notebooker](https://github.com/man-group/notebooker) | Jupyter Notebook 生产化与调度 | 把固定研究 Notebook 变成可参数化、可追踪的定时报表 | 仅当 Notebook 已稳定后评估；不能替代工作流 manifest 和验证器。 |
| [PyBloqs](https://github.com/man-group/PyBloqs) | 数据可视化与自动报告框架 | 生成研究报告的表格/图表组件 | 与现有 Markdown/Obsidian 输出重叠，暂不引入。 |
| [versioned-hdf5](https://github.com/deshaw/versioned-hdf5) | HDF5 上的版本化抽象 | 固定大型研究数据快照，支持重跑与回滚 | 只有进入 HDF5 数据链后才有价值；当前先落实通用 dataset manifest。 |

其余仓库多为 OCaml、FPGA、低延迟 C++、语言服务器或通用工程工具，对当前个人投研学习链没有直接增益；不因为来源来自机构就自动提高优先级。

## 自动化筛选项目评价框架

“13 亿 token + 自动化缠论筛选”原帖展示了批量导入标的、代码预检、日线缓存、规则筛选、候选页和批量出图。它证明的是一条工程路径可以跑通，不证明策略有效。接入 eco-learning 前，用下面的闸门评价任何自动筛选项目：

| 维度 | 必须回答的问题 | 不通过时的处理 |
|---|---|---|
| 数据可追溯 | 数据源、抓取时间、复权、停牌、退市和成分股历史是否固定？ | 标记 `unavailable`，不跑绩效结论。 |
| 输入契约 | 证券代码、市场、资产类型、重复项和无效行是否在运行前校验？ | 失败行隔离，不能静默猜代码。 |
| 信号可定义 | 缠论/技术规则能否写成无歧义公式、参数和测试样例？ | 只能作为人工观察标签，不进入回测。 |
| 无未来函数 | 选股池、财务数据和技术指标是否 point-in-time，是否避免幸存者偏差？ | 整组实验作废。 |
| 可复跑回测 | 是否固定代码版本、数据快照、基准、费用、滑点和随机种子？ | 结果只算截图演示。 |
| 样本外稳健性 | 是否有 walk-forward、不同市场阶段、不同起点和参数敏感性测试？ | 不进入候选信号。 |
| 结果可审计 | 是否输出候选、未命中原因、日志、图表、运行 manifest 和失败明细？ | 不接入 council 证据包。 |
| 执行隔离 | 是否默认只读、禁止接触 Futu 交易权限，并保留人工确认？ | 不接入现有工作区。 |

### 与 eco-learning 的最小接法

1. 新增的是“候选生成器”，输入固定标的池与 point-in-time 数据，输出结构化候选和证据图，不输出买卖动作。
2. 候选先进入 `research_stack` 或独立实验 sidecar；由 fundamentals、valuation、tape、risk 等既有角色分别审查。
3. `validate_outputs.py` 除现有 source refs/敏感字段检查外，后续可增加 dataset manifest、参数、费用假设、样本外区间和运行版本的完整性校验。
4. 只有跨阶段复跑稳定且能解释失败样本时，才讨论把候选信号用于持仓复盘；Futu 仍保持只读，不接自动执行。

## 与 eco-learning 的对接建议

现有流程已经覆盖“资料/账户快照 → 五角色研究 → 冲突裁决 → 输出验证 → 复盘记录”。因此新工具只应作为可选证据模块：

1. **研究实验层**：把 Qlib 或 vectorbt 的实验输出写成独立、可复跑的证据包，至少包含数据版本、样本期、样本外区间、交易成本假设、基准、失败条件和结果文件。
2. **资料辅助层**：OpenBB、FinGPT、TradingAgents 只能生成“待核验线索/文本摘要/反证问题”；公司 IR、公告、财报、电话会和可追溯行情仍是事实来源。
3. **决策闸门不变**：实验结果先进入 shared evidence，由现有 `valuation`、`tape` 与 `risk` 审查；若数据、复现或风险层不可用，标记 `unavailable`，不强行评分。
4. **执行层隔离**：LEAN、vn.py、Qbot 不接触 Futu 账户、不下单；若未来单独研究执行工程，先建立 sandbox、密钥隔离、审计日志与人工确认，再讨论接口。

> [!tip] 最小试验
> 先为一个已经明确的研究问题建立单一基线，例如：固定标的池与固定再平衡频率下，`vectorbt` 结果是否在样本外、费用和不同起点下仍优于基准。只有该实验通过再考虑引入更复杂模型或 Agent。

## 证据与来源

- 证据等级：`external_verified`。2026-07-15 直接核验了各工具的官方 GitHub 仓库/文档。
- Cubox 触发：[[2-Areas/Cubox/Reviews/2026-W29 Cubox Review|2026-W29 Cubox 复盘]] 中“可以喂给 AI 的量化交易项目”卡片提供了初始项目线索。
- 2026-W29 三条量化来源均已从公开小红书原页成功回源：项目清单 3 张、LEAN 1 张、“22 个开源仓”23 张图片全部 OCR 成功；原帖只用于发现与分类，工具用途再以官方仓库核验。
- [可以喂给 AI 的量化交易项目](https://www.xiaohongshu.com/discovery/item/6a4cbf5c00000000150242bf)
- [QuantConnect LEAN 全流程介绍](https://www.xiaohongshu.com/discovery/item/6a40725b000000001c025a22)
- [来自对冲基金和量化交易公司的 22 个开源仓](https://www.xiaohongshu.com/discovery/item/6a429efb000000000702b3ca)
- [13 亿 token + 自动化缠论与交易筛选](https://www.xiaohongshu.com/discovery/item/6a4f80b80000000017029599)
- eco-learning 对接依据：当前项目的 `AGENTS.md` 与 2026-07-14 完整版投资操作建议，已确认只读账户、五角色 council、冲突裁决和输出验证边界。
