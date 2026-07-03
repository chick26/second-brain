---
status: draft
created: 2026-06-29
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "Agent Runtime 与执行隔离"
source: cubox-review
dashboard_type: review-output
dashboard_status: todo
review_source: cubox-review
review_batch: 2026-05
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

## 来源

- [Release Helm](https://blog.sorrycc.com/release-helm)
- [AI Agent Sandbox 开源项目技术分析：从容器到 MicroVM，谁更适合跑下一代 Agent？](https://mp.weixin.qq.com/s?__biz=MzkwMzE4MTQ3MQ==&mid=2247483873&idx=1&sn=40345a7d3888f280cccbcde97b8335de)
- [[2-Areas/Cubox/Reviews/2026-05 Cubox Review|2026-05 Cubox 复盘]]

## Cubox 回源复核

- 2026-06-30 已完成 2026-05 Reviewed 回源；Sandbox 微信公开页抽到约 10522 字正文，证据升级为 `source_fetched_html`，详见 [[2-Areas/Cubox/Reviews/2026-05 Cubox Review|2026-05 Cubox 复盘]]。
- [Release Helm](https://blog.sorrycc.com/release-helm) 回源核验已完成，公开 fetch 结果为 `metadata_only`；daemon、cron、issue loop 等细节未纳入本笔记强结论。
