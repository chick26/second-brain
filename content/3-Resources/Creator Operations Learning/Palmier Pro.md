---
status: draft
created: 2026-07-02
tags:
  - cubox
  - field/other
  - topic/ai
  - topic/llm
topic: Palmier Pro
source: cubox-review
dashboard_type: review-output
dashboard_status: done
review_source: cubox-review
review_batch: 2026-W27
---

# Palmier Pro

Palmier Pro 是一个面向 Mac 的 AI-native 视频编辑器。它的关键价值不是“一键生成视频”，而是把 AI Agent 接到剪辑工程和时间线里，让 Agent 能读时间线、生成素材、调整片段、管理轨道，并留下可回退的操作过程。

## 工具信息

| 项目 | 信息 |
|---|---|
| 官方仓库 | [palmier-io/palmier-pro](https://github.com/palmier-io/palmier-pro) |
| 定位 | macOS video editor built for AI |
| 平台要求 | macOS 26 Tahoe + Apple Silicon |
| 开源边界 | 编辑器、MCP server、agent chat 开源；生成式 AI 处理部分闭源 |
| 许可证 | GPL-3.0 / GPLv3 |
| MCP endpoint | `http://127.0.0.1:19789/mcp` |
| Agent 集成 | Claude Code / Claude Desktop / Codex / Cursor |
| 生成模型 | 时间线内可使用 Seedance、Kling、Nano Banana Pro 等模型 |
| 费用边界 | 编辑器和 MCP 功能免费；生成式 AI 功能需要登录和订阅 |

## 为什么值得关注

- **Agent 进入时间线**：不是把 prompt 变成一次性视频，而是让 Agent 在同一条时间线上和人协作。
- **本地工程可控**：适合读项目、改片段、加转场、管理轨道等具体剪辑动作。
- **MCP 作为差异点**：让 Codex / Claude / Cursor 这类 coding agent 可以跨界操控创作软件。

## 适合场景

- Apple Silicon Mac 用户试验 AI 辅助短视频剪辑。
- 产品宣传片、教程视频、短视频素材组装。
- 想研究“Agent 操控创作软件”模式的工作流设计。

## 不适合场景

- Windows 用户。
- 需要成熟专业长视频主工作流的剪辑场景。
- 不愿意承担 macOS 26 Tahoe 和新工具不稳定性的场景。

## 可试用 Prompt 模式

```text
我已经启动 Palmier Pro，并打开了一个项目。
请通过 MCP 读取主时间线，列出所有视频片段、音轨和空白区间。
找出静音或黑屏超过 1 秒的片段，先输出操作计划和将要修改的时间码。
经我确认后，再裁切删除，并在新拼接的切口处添加 0.5 秒交叉溶解转场。
```

## 证据状态

- `external_verified`：已核验官方 GitHub / README。
- `source_fetched_ocr`：3 篇小红书来源已公开回源并 OCR，用作发现来源和使用视角。
- 不采用“小红书全球首个”“GitHub 第一”等营销表述作为事实结论。

## 来源

- [palmier-io/palmier-pro](https://github.com/palmier-io/palmier-pro)
- [全球首个AI自然语言视频剪辑软件 Palmier](https://www.xiaohongshu.com/discovery/item/6a37e2ba000000000f00456c)
- [我试了那个冲上GitHub第一的AI视频编辑器](https://www.xiaohongshu.com/discovery/item/6a40f016000000000f014248)
- [【开源】Palmier Pro 苹果硅专属开源视频剪辑软件，内置本地MCP服务](https://www.xiaohongshu.com/discovery/item/6a4319a1000000000702d7a2)
- [[2-Areas/Cubox/Reviews/2026-W27 Cubox Review|2026-W27 Cubox 复盘]]
