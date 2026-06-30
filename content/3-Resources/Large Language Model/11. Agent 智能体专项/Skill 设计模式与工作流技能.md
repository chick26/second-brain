---
status: draft
created: 2026-06-29
tags:
  - cubox
  - topic/ai
  - topic/llm
topic: "Skill 设计模式与工作流技能"
source: cubox-review
---

# Skill 设计模式与工作流技能

Skill 是一份可被 Agent 按需加载的工作说明。它不新增神秘能力，而是把触发条件、流程、工具使用方式、脚本和参考资料组织成可复用上下文。

## 基本结构

```text
my-skill/
  SKILL.md
  scripts/
  references/
  resources/
  examples/
```

## 写作原则

- `description` 决定是否被加载：写清触发短语、适用场景和时序位置。
- 大 skill 要渐进披露：主文件只放路线图，细节放 `references/`。
- 能脚本化的步骤放到 `scripts/`，不要让模型每次重新发明流程。
- 复杂流程要给决策树，简单流程用线性步骤。
- 明确禁止事项和安全默认值，例如“默认 preview，不直接 production”。

## 五种模式

| 模式 | 适合场景 | 写法 |
|---|---|---|
| 线性流程 | 部署、安装、迁移 | `Prerequisites` -> `Quick Start` -> `Fallback` -> `Troubleshooting` |
| 决策树 | 平台选型、诊断 | 按用户意图分叉，给产品索引表。 |
| 检查清单 | Review、发布前检查 | 给必须确认的条件和失败处理。 |
| 资源索引 | 工具/资料合集 | 只列用途和触发方式，避免全文搬运。 |
| 工作流编排 | 多步骤交付 | 定义输入、输出、状态、可验证完成标准。 |

## 来源

- [[工作流的 Skill 怎么写？从 7 个顶级 Skill 中提炼的模式与最佳实践-2026-04-27]]
- [[2-Areas/Journal/Weekly/Cubox Reviews/2026-04 Cubox Review|2026-04 Cubox 复盘]]

## Cubox 回源复核

- 2026-06-29 已完成公开回源，证据方式为 `source_fetched`；详见 [[2-Areas/Journal/Weekly/Cubox Reviews/2026-04 Cubox Review|2026-04 Cubox 复盘]]。
- 本笔记可保留为 skill 写作模式总结；具体工具或示例仍应在实际采用前检查对应 skill/repo 文档。
