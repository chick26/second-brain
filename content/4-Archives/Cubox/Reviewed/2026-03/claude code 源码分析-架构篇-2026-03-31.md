---
id: "7438627318139980227"
cubox_url: https://cubox.pro/web/card/7438627318139980227
url: https://mp.weixin.qq.com/s?__biz=MzYyNTgxNjI1Ng==&mid=2247485102&idx=1&sn=cb8e23d71b5afd3c3481e4889834e354&chksm=f141768e02cb90ea0a0f3ac288a79ec768a9d73c1efc64edd67350f9f1e677e9ede85c6a4ef4&mpshare=1&scene=1&srcid=0331em46oQVkTc081QFoMLND&sharer_shareinfo=46f80d5c1f2846d2c637fdc92b4d091b&sharer_shareinfo_first=f18f5938fbfc08537654724432e9af79
tags: []

---
# claude code 源码分析-架构篇

整体架构1. 这个项目本质上是什么从源码形态看，这不是一个“发请求拿回答”的普通聊天客户端，而是一套完整的

## 整体架构

## 1. 这个项目本质上是什么

从源码形态看，这不是一个"发请求拿回答"的普通聊天客户端，而是一套完整的 Claude Code 运行时。

站在产品形态上，它把以下几种能力组合在了一起：

*
  • 基于 React + Ink 的终端交互界面
*
  • 面向 slash command 的命令系统
*
  • 一个可流式消费模型输出、解释 tool_use、执行工具并回填结果的 Agent 运行时
*
  • 控制副作用和执行权限的策略层
*
  • 以 skills、plugins、MCP 为核心的扩展体系
*
  • 可选的子 Agent、后台任务、远程桥接执行能力

更准确的心智模型是：一个"运行在终端里的小型 Agent 操作系统"。

## 2. 架构分层

### 2.1 进程入口层

主要职责：

*
  • 在尽可能低的启动成本下选择正确执行路径

代表文件：

*
  • src/entrypoints/cli.tsx
*
  • src/main.tsx
*
  • src/entrypoints/init.ts
*
  • src/entrypoints/mcp.ts

观察：

*
  • cli.tsx 会先做非常激进的快路径分流，避免无意义地加载整个 CLI 运行时。
*
  • main.tsx 负责正常交互路径下的重型初始化。
*
  • init.ts 统一承载配置、环境、安全、遥测、账户、网络等预初始化逻辑。

### 2.2 应用外壳层

主要职责：

*
  • 托管交互式终端应用与会话 UI

代表文件：

*
  • src/screens/REPL.tsx
*
  • src/components/*
*
  • src/context/*
*
  • src/state/*
*
  • src/hooks/*

观察：

*
  • 这一层就是"终端应用本体"。
*
  • 它负责输入框、消息转录、对话框、通知、任务视图、IDE 集成、远程会话状态以及插件/skill 相关交互。

### 2.3 Agent 运行时层

主要职责：

*
  • 将用户输入转成一个完整的 Agent turn
*
  • 构建上下文与系统提示
*
  • 流式接收模型输出
*
  • 管理 thinking、tool call、重试、压缩和完成态

代表文件：

*
  • src/QueryEngine.ts
*
  • src/query.ts
*
  • src/services/api/claude.ts

观察：

*
  • QueryEngine 是会话级的无头编排器。
*
  • query.ts 是真正的 turn loop 和状态跃迁中心。
*
  • claude.ts 不是薄 SDK 包装层，而是内部运行时状态到 Anthropic 请求形态之间的翻译层。

### 2.4 Tool 与策略层

主要职责：

*
  • 定义有哪些工具
*
  • 描述工具输入输出约束
*
  • 判定工具是否允许执行
*
  • 对工具执行进行批处理与调度

代表文件：

*
  • src/Tool.ts
*
  • src/tools.ts
*
  • src/services/tools/toolOrchestration.ts
*
  • src/hooks/useCanUseTool.tsx
*
  • src/utils/permissions/permissions.ts

观察：

*
  • 这是整个系统最关键的层之一。
*
  • Tool 不是附属能力，而是一等运行时实体。
*
  • 权限系统也不是单一弹窗确认，而是一个多输入源的策略决策引擎。

### 2.5 扩展层

主要职责：

*
  • 加载用户、项目、托管策略定义的 skills
*
  • 加载 plugins
*
  • 作为 MCP 客户端和 MCP 服务端工作

代表文件：

*
  • src/skills/loadSkillsDir.ts
*
  • src/plugins/builtinPlugins.ts
*
  • src/services/mcp/*
*
  • src/entrypoints/mcp.ts

### 2.6 多 Agent 与远程层

主要职责：

*
  • 运行子 Agent
*
  • 协调后台任务
*
  • 支持 bridge / remote 场景

代表文件：

*
  • src/tools/AgentTool/*
*
  • src/tasks/*
*
  • src/bridge/*
*
  • src/remote/*

## 3. 目录级观察

从当前工作区结构推断：

*
  • utils/ 体量很大，是主要的支撑库和运行时细节承载区。
*
  • components/、commands/、tools/ 也非常大，说明产品的 UI 面与执行能力面都不小。
*
  • services/ 扮演了集成与编排层角色，覆盖 API、MCP、LSP、插件、压缩、遥测等能力。

这说明几个重点：

*
  • components/ 大，说明终端 UI 已经相当成熟。
*
  • commands/ 大，说明 slash command 是重要交互方式。
*
  • tools/ 大，说明模型驱动工具调用是系统核心。
*
  • utils/ 大，说明大量复杂性被沉淀在基础支撑与运行时辅助逻辑里。

## 4. 框架设计图

快路径

## 5. 关键设计主题

### 5.1 启动性能被当成一等问题处理

证据：

*
  • src/entrypoints/cli.tsx 的快路径分流
*
  • 大量动态导入
*
  • 明确的启动 profiling 埋点
*
  • 基于构建特性的条件裁剪

这说明团队非常清楚：CLI 的"首响应时间"直接影响产品感受。

### 5.2 运行时能力面高度可配置

证据：

*
  • 大量 feature(...) 判定
*
  • USER_TYPE === 'ant' 之类的分支
*
  • policy 限制能力
*
  • 托管设置与远程托管设置

这通常意味着：

*
  • 外部公开版本和内部版本能力面差异较大
*
  • 同一套 runtime 需要承载多种发行形态

### 5.3 Agent 行为更多靠系统设计约束，而不是单靠 Prompt

证据：

*
  • Tool 注册与 schema
*
  • 多阶段权限决策
*
  • Tool 执行分组与串并行控制
*
  • 子 Agent 的工具作用域与权限作用域
*
  • hooks / classifier 的接入

这代表该系统的安全性和可控性主要靠架构，而不是"提示词里说不要乱来"。

### 5.4 终端是主载体，但架构本质上是多模态的

证据：

*
  • 语音相关代码
*
  • 图像与剪贴板处理
*
  • Chrome 集成
*
  • IDE 集成

因此这个项目虽然长在终端里，但并不只是文本问答系统。

## 6. 最适合的心智模型

如果只用一句话概括整个架构：

这是一个以终端 UI 为宿主、以 QueryEngine + query loop 为执行核心、以 Tool + Permission 为约束边界、以 skills/plugins/MCP 为扩展方式、以 AgentTool 为递归放大器的 Agent 平台。

## 7. 推荐首先阅读的入口文件

如果你准备继续做更深一层的源码阅读，建议按这个顺序开始：

1.
   1. src/entrypoints/cli.tsx
2.
   2. src/main.tsx
3.
   3. src/screens/REPL.tsx
4.
   4. src/QueryEngine.ts
5.
   5. src/query.ts
6.
   6. src/services/api/claude.ts
7.
   7. src/tools.ts
8.
   8. src/utils/permissions/permissions.ts
9.
   9. src/tools/AgentTool/AgentTool.tsx
10.
    10. src/skills/loadSkillsDir.ts



[Read in Cubox](https://cubox.pro/web/card/7438627318139980227)  
[Read Original](https://mp.weixin.qq.com/s?__biz=MzYyNTgxNjI1Ng==&mid=2247485102&idx=1&sn=cb8e23d71b5afd3c3481e4889834e354&chksm=f141768e02cb90ea0a0f3ac288a79ec768a9d73c1efc64edd67350f9f1e677e9ede85c6a4ef4&mpshare=1&scene=1&srcid=0331em46oQVkTc081QFoMLND&sharer_shareinfo=46f80d5c1f2846d2c637fdc92b4d091b&sharer_shareinfo_first=f18f5938fbfc08537654724432e9af79)  

---

