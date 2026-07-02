---
status: draft
created: 2026-06-29
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "数据领域 Agent Harness"
source: cubox-review
dashboard_type: review-output
dashboard_status: todo
review_source: cubox-review
review_batch: 2026-06
---

# 数据领域 Agent Harness

数据领域的 Agent Harness 不能只照搬通用 coding harness。通用底座可以复用，但验证方式、权限边界、上下文组织和完成标准都需要重新设计。

## 核心判断

通用 harness 的基础已经相对稳定：agent loop、权限/审批与 sandbox 分层、MCP、skills、subagent、context 管理、项目说明文件和执行日志。这些地基不必重造。

数据领域真正不同的地方在任务对象：它处理的不是本地代码文件，而是数据仓库、指标口径、业务实体、查询成本、敏感字段和权限边界。因此数据领域 harness 的关键不是“让 Agent 能查数据”，而是让 Agent 在可控边界内完成可信分析。

一句话：**代码 harness 让 agent 能安全改工程；数据 harness 让 agent 能可信地解释数据。**

## 可复用的通用 Harness 地基

- **Agent loop**：模型提出动作，harness 执行工具，把结果回填，再继续下一轮。
- **权限 / sandbox 分层**：sandbox 决定技术上能做什么，审批策略决定越界前是否停下来问人。
- **MCP / skills / 延迟加载**：外部能力和领域流程按需注入，不把所有说明塞进主上下文。
- **Subagent context 隔离**：让探索、检索、验证在独立上下文里跑，只把摘要带回主会话。
- **持久指令文件**：用 `AGENTS.md` / `CLAUDE.md` 记录项目约定、权限边界、常见命令和完成标准。
- **Compaction**：长任务通过摘要、文件化日志和中间产物减少 context rot。

## 与 Coding Harness 的关键差异

| 维度 | Coding Harness | 数据领域 Harness |
|---|---|---|
| 对错判断 | 测试、类型检查、编译、lint 大多在仓库内闭环。 | SQL 能跑不代表语义正确；必须对齐指标定义、业务口径、semantic layer、已验证查询或数据契约。 |
| 风险边界 | 风险主要在本地工作区，可用文件系统 sandbox、git diff、分支、回滚控制。 | 风险在数据所在地；需要服务端隔离、只读执行、敏感字段防护、查询预算和凭据隔离。 |
| 上下文压力 | 主要来自代码文件和工具输出，可按需读取。 | 领域知识必须常驻或可快速路由，例如 schema、指标、血缘、dbt、semantic view、样例查询。 |
| 完成标准 | 测试绿、CI 绿、构建通过可作为强完成信号。 | 需要独立验证环节给出结构化裁决：做了什么、证据是什么、是否可信；默认不轻信模型自称完成。 |

## 设计要求

### 1. 先找 ground truth，再生成 SQL

对复杂问题，harness 应强制检索指标口径、semantic layer、业务定义或历史可信 SQL，而不是直接让模型写查询。

可沉淀的上下文包括：

- 业务实体：用户、订单、账户、产品、渠道等实体关系。
- 指标口径：时间窗口、分母、过滤条件、排除项。
- Schema 语义：字段含义、枚举值、主外键、样例行。
- 查询习惯：历史高质量 SQL、常见 join 路径、危险查询模式。
- 权限边界：敏感字段、跨域表、昂贵查询、写操作。

### 2. 把隔离推到数据旁边

如果 agent 会碰企业数据，单靠本地 sandbox 不够。执行环境、权限边界和审计日志应贴近数据仓库或受控计算环境。

默认策略：

- SQL 默认只读。
- `SELECT` / `SHOW` / `DESCRIBE` 与 `CREATE` / `INSERT` / `DELETE` / `DROP` 走不同审批路径。
- 导出明细、访问敏感字段、跨域 join、昂贵扫描都要显式标记。
- 凭据不应暴露给模型或临时代码执行环境。

### 3. 为领域知识做路由

不要把全部数据平台知识塞进主上下文。更稳的方式是用 skill/router/semantic index 判断本轮需要加载哪些 schema、指标、样例和规则。

有效的 context 单位不是“越多越好”，而是能降低决策不确定性的最小材料：

- 当前问题相关 schema。
- 相关指标定义和业务实体说明。
- 与问题相似的高质量 SQL。
- 查询结果样例和数据质量摘要。
- 最近口径变更或字段废弃说明。

### 4. 独立验证完成态

数据任务完成不应只靠 agent 总结。需要 verifier 检查：

- 查询是否可运行。
- 时间范围、分母、过滤条件是否符合口径。
- 结果行数、空值、异常值、重复值是否合理。
- 是否存在权限、成本或敏感字段问题。
- 结论是否能追溯到查询和证据。

默认应是：**没有可信裁决，就不算完成。**

### 5. 模型分档与成本控制

主推理用强模型，分类、路由、SQL 检查、格式化、轻量验证可交给小模型。数据领域 harness 的长期成本不只来自主问答，还来自反复检索、解释、校验和审计。

## 对个人工作流的启发

当前 Obsidian/Codex 的自动复盘也可以套用这套结构：

1. `extract`：先确定纳入范围和覆盖率。
2. `filter`：只选择高价值候选。
3. `enrich`：对缺信息的来源做回源/OCR/ASR。
4. `verify`：记录哪些信息可靠，哪些只是线索。
5. `summarize`：输出可读结论和待决策队列。

## 来源与证据

- [数据领域怎么做 agent harness](https://www.xiaohongshu.com/discovery/item/6a1c9c61000000003601e718)
- [arXiv:2511.10674](https://arxiv.org/abs/2511.10674)
- [[Text2SQL 领域知识与问数系统]]

证据边界：

- `数据领域怎么做 agent harness` 已在 2026-06 回源并完成 10 张图 OCR，证据为 `source_fetched_ocr`；原 Cubox 同步源文件已按本轮复盘删除。
- Text2SQL 相关来源已通过 arXiv `2511.10674v2` 补证，证据为 `external_verified`。
- 2026-04 两条 AI 问数低证据来源已取消入库并删除 Cubox 同步源文件，不再作为本笔记来源。
