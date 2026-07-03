---
status: draft
created: 2026-07-02
tags:
  - cubox
  - field/other
  - topic/ai
  - topic/llm
topic: "AI 视频制作工具链"
source: cubox-review
dashboard_type: review-output
dashboard_status: todo
review_source: cubox-review
review_batch: 2026-W27
---

# AI 视频制作工具链

这是一份自媒体运营学习用的候选工具链，不是“Codex 必备 Skill”清单。原始 Cubox 来源是二手小红书工具图，本轮只把它升级为学习专题和待验证工具地图。

## 制作链路

```text
选题 / 脚本
  → 分镜 / 镜头语言
  → 视频生成或程序化渲染
  → 时间线剪辑 / 字幕 / 转场
  → 配音 / 配乐 / 音频处理
  → 导出 / 发布 / 数据复盘
```

## 候选工具

| 工具 | 位置 | 当前判断 | 下一步 |
|---|---|---|---|
| [[Palmier Pro]] | AI-native 时间线剪辑 | 已做官方核验；适合研究 Agent 进入剪辑器时间线。 | 等本机环境满足 macOS 26 Tahoe + Apple Silicon 后再试。 |
| HyperFrames | HTML / CSS / JS 生成视频 | 已核验官网；适合 Agent 用网页技术生成可渲染视频。 | 需要时试 `npx skills add heygen-com/hyperframes`。 |
| Remotion | React 程序化视频 | 已核验官方 docs；适合模板化、数据可视化、批量视频。 | 优先做一个 10 秒数据可视化 demo。 |
| FFmpeg | 底层音视频处理 | 官方文档稳定；适合压缩、拼接、转码、抽音频、批处理。 | 建一个常用命令片段清单。 |
| Jianying Editor Skill | 剪映草稿 / 桌面自动化 | 已核验 GitHub，但它是第三方 skill，且推荐 Windows + 剪映专业版 5.9 或更低版本；macOS 只算实验性。 | 如果要试，先用隔离素材和测试工程，不放生产素材。 |
| Azure TTS | 配音 / 多语言语音 | 官方 Speech 文档可核验；涉及账号、费用、隐私。 | 需要多语言或企业级语音时再评估。 |
| ElevenLabs | AI 配音 / 声音生成 | 官方文档可核验；声音克隆、授权和费用需谨慎。 | 先确认商用授权和声音合规边界。 |
| Mubert | 背景音乐 / 音乐 API | 官方 API 页面可核验；核心风险是版权、商用授权和费用。 | 需要可商用 BGM 时再细查授权。 |
| Shots | 分镜 / 镜头脚本 | 原文信息不足，本轮未找到稳定对应官方来源。 | 暂不入正式工具清单，后续单独核验。 |

## 优先试用顺序

1. **FFmpeg + Remotion**：最适合先形成稳定、可自动化的程序化视频基础链路。
2. **HyperFrames**：适合验证“Agent 写 HTML，工具渲染视频”的工作流。
3. **Palmier Pro**：适合验证 Agent 直接操作时间线，但受 macOS 26 Tahoe + Apple Silicon 限制。
4. **Jianying Editor Skill**：如果要试，先看平台限制；不把它当成剪映官方能力。
5. **TTS / BGM 工具**：先解决版权、费用、隐私，再决定是否进入常用工具链。

## 核验缺口

- 原文星标数没有逐项采用。
- `Shots` 未找到稳定官方来源。
- Jianying Editor Skill 是第三方自动化，不是剪映官方 API。
- 声音克隆、TTS、配乐工具都需要单独确认授权与商用边界。

## 来源

- [HyperFrames](https://hyperframes.heygen.com/)
- [Remotion Docs](https://www.remotion.dev/docs/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Jianying Editor Skill](https://github.com/luoluoluo22/jianying-editor-skill)
- [Microsoft Azure Text to Speech](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech)
- [ElevenLabs Documentation](https://elevenlabs.io/docs/overview/intro)
- [Mubert API](https://mubert.com/api)
- [codex视频制作必备8个Skill技能，你知道吗](https://www.xiaohongshu.com/discovery/item/6a2d2672000000001702a023)
- [[2-Areas/Cubox/Reviews/2026-W27 Cubox Review|2026-W27 Cubox 复盘]]
