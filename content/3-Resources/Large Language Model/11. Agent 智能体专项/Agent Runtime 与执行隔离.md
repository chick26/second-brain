---
status: draft
created: 2026-06-29
updated: 2026-07-15
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "Agent Runtime 与执行隔离"
source: cubox-review
dashboard_type: review-output
dashboard_status: todo
review_source: cubox-review
review_batch: mixed
---

# Agent Runtime 与执行隔离

Agent runtime 不是一个跑完就退出的脚本，而是一个能管理会话、权限、工具、队列、通知和隔离环境的服务层。

## Runtime 能力地图

| 能力 | 作用 |
|---|---|
| Daemon / session | 让会话可恢复、可 attach、可 cancel、可搜索。 |
| Provider / model 管理 | 不同 workspace 绑定不同模型、权限模式和密钥来源。 |
| Approval | 高风险工具触发审批，支持 session 级放行和自动重置。 |
| Issue / loop | 从需求队列创建会话，自动执行 pre/post script，形成需求到执行闭环。 |
| Skill / plugin | 按作用域启用和禁用能力，不把所有工具一次性塞进上下文。 |
| Cron / notification | 定时执行任务并把结果推到消息通道。 |

## 执行隔离

Agent sandbox 要解决的不是普通“不可信代码”问题，而是“不完全可控的执行体”问题。评估时至少看四类指标：

- 隔离级别：容器、MicroVM、K8s workload、浏览器隔离。
- 启停成本：冷启动、快照、预热池、资源密度。
- 工具完整度：Shell、文件系统、浏览器、包管理器、Jupyter、MCP。
- 控制 API：是否能稳定暴露给模型、编排器和审批系统。

## 当前判断

- 生产级高并发优先关注 MicroVM/云原生沙箱。
- 本地开发优先关注可嵌入 SDK 和工具完整度。
- All-in-one 工具容器适合个人工作流，但安全边界要单独评估。

## AI 后端 Runtime 工程检查表

2026-W29 的 AI 后端题纲把 Runtime 风险拆成了可直接用于设计评审的场景。它的价值不在面试答案，而在于把“能调用模型”升级为下面这些运行时合同：

| 维度 | 评审问题 | 最低完成条件 |
|---|---|---|
| 数据与接口契约 | 流式 chunk、工具调用、引用片段、多模态消息和供应商差异是否有类型安全模型？ | schema 可版本化；反序列化失败可定位；对外 JSON/Protobuf 契约有测试。 |
| 流式与背压 | SSE/WebSocket 慢客户端、断连、心跳和上游持续生成怎么处理？ | 有界缓冲、取消传播、超时与断连清理；不在 Event Loop 跑阻塞调用。 |
| 长任务生命周期 | OCR/摘要/分析链或两分钟以上任务如何提交、去重、查进度、取消和清理？ | 显式状态机、幂等键、可恢复重试、结果 TTL 和失败原因。 |
| 并发与资源隔离 | 多模型竞速、CPU 推理、外部敏感词服务、Kafka 消费如何避免拖垮主服务？ | 独立有界线程池/队列、bulkhead、限流、熔断和取消未完成请求。 |
| 状态与一致性 | 同一会话并发消息、任务编辑取消、工具失败转人工如何避免乱序？ | 会话串行化或分区键、原子状态转移、事件幂等和人工接管状态。 |
| 安全与数据持久化 | API 密钥、机密文档、超长历史、Base64 图片和向量数据如何管理？ | 密钥不进前端/日志；脱敏；对象存储与数据库分层；归档和访问控制。 |
| 可观测性与成本 | 是否能回答哪个模型、哪次调用、耗时/Token/错误/成本和资源占用？ | trace/span、结构化日志、QPS/P99/状态码/Token/线程池指标与告警。 |
| 发布与降级 | 多供应商失败、功能开关、密钥轮换和依赖健康怎么处理？ | 熔断半开、回退策略、动态开关、无感轮换、CI/CD 与安全扫描。 |

这张表可以作为 Agent 服务的 termination contract：接口能返回并不代表完成；只有取消、超时、背压、幂等、隔离、观测和降级路径都可验证，才算 Runtime 闭环。

## 来源

- [Release Helm](https://blog.sorrycc.com/release-helm)
- [AI Agent Sandbox 开源项目技术分析：从容器到 MicroVM，谁更适合跑下一代 Agent？](https://mp.weixin.qq.com/s?__biz=MzkwMzE4MTQ3MQ==&mid=2247483873&idx=1&sn=40345a7d3888f280cccbcde97b8335de)
- [[2-Areas/Cubox/Reviews/2026-05 Cubox Review|2026-05 Cubox 复盘]]
- [我们组新来的 AI 后端 Leader，他真的太恐怖了](https://www.xiaohongshu.com/discovery/item/6a5457980000000017028292)
- [[2-Areas/Cubox/Reviews/2026-W29 Cubox Review|2026-W29 Cubox 复盘]]

## Cubox 回源复核

- 2026-06-30 已完成 2026-05 Reviewed 回源；Sandbox 微信公开页抽到约 10522 字正文，证据升级为 `source_fetched_html`，详见 [[2-Areas/Cubox/Reviews/2026-05 Cubox Review|2026-05 Cubox 复盘]]。
- [Release Helm](https://blog.sorrycc.com/release-helm) 回源核验已完成，公开 fetch 结果为 `metadata_only`；daemon、cron、issue loop 等细节未纳入本笔记强结论。
- 2026-07-15 已从公开小红书原页回源并完成 8/8 张图片 OCR（约 10,188 字）；本笔记只提炼跨语言通用的 Runtime 检查项，不把题纲中的具体 Java 实现当作已验证答案。
