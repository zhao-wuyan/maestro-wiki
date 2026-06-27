# Project: Maestro Workflow Wiki

## What This Is

Maestro Workflow Wiki 是一个独立的交互式百科网站，用通俗、可探索的方式解释 Maestro Flow 的工作流、命令选择和 Ralph session 执行机制。它面向初次接触 Maestro 的开发者，以及需要快速判断“该用哪个命令”的高级用户。

## Core Value

把 Maestro 的复杂命令拓扑和执行状态机变成可点击、可理解、可用于决策的交互地图。

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- [x] 独立 Vite + React 站点骨架已创建，不复用 `maestro-flow/docs-site`。
- [x] MVP 交互流程图已实现，支持点击和键盘选择节点，并联动详情面板。

### Active

<!-- Current scope being built toward. These are hypotheses until shipped. -->

- [ ] 提供 Maestro 核心概念百科内容，覆盖 intent classification、chain selection、session creation、Ralph execution、decision node、quality pipeline 和 knowledge system。
- [ ] 提供按任务场景组织的命令选择指南，能给出候选命令、适用边界和推荐理由。
- [ ] 扩展可交互流程图，覆盖 `S_PARSE`、`S_CLASSIFY`、`S_DECOMPOSE`、`S_CREATE`、`S_DISPATCH` 与 `maestro-ralph-execute` 接力关系。
- [ ] 提供 `status.json` 示例解剖，解释 `steps[]`、`classification_rationale`、`task_decomposition` 和 `completion_confirmed`。
- [ ] 实现第一版浏览器端需求分析与命令推荐规则引擎。

### Out of Scope

<!-- Explicit boundaries. Include reasoning to prevent re-adding. -->

- 不复用 `maestro-flow/docs-site` 作为产品站点 — 原站点面向项目文档，本项目面向交互理解和命令选择辅助。
- 不修改 Maestro CLI 执行语义 — 本项目解释和辅助选择命令，不改变底层工作流行为。
- 第一阶段不接入真实云端 LLM — 避免后端、密钥管理和成本复杂度，先用前端规则引擎验证体验。
- 第一阶段不做登录、多租户或个人历史 — 当前核心风险是信息架构和交互理解，不是账户系统。

## Context

上游 `maestro-flow` 以 Git submodule 方式保留在仓库中，仅作为 Maestro 工作流源码、README 和命令文档参考。主仓库是独立产品站，当前技术栈为 Vite、React、TypeScript、原生 SVG 和 CSS。现有需求与设计草案位于 `.monkeycode/specs/maestro-workflow-wiki/`。

## Constraints

- **Product**: 子模块只作参考，不把 `maestro-flow/docs-site` 作为产品底座 — 两者信息架构和使用目标不同。
- **Interaction**: 核心流程图必须可点击、可键盘访问，并能在详情面板显示节点说明 — 静态图不足以降低理解成本。
- **Runtime**: 第一阶段推荐器在浏览器端运行 — 避免引入服务端和 API key 管理。
- **Preview**: Vite dev server 需要允许 `.monkeycode-ai.online` 预览域名 — 保证开发环境可访问。

## Tech Stack

- **Language**: TypeScript
- **Framework**: React 18 + Vite 6
- **Database**: None for MVP

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build a standalone wiki app in the root project | The product goal differs from `maestro-flow/docs-site`, which is source project documentation. | Accepted |
| Keep `maestro-flow` as a submodule reference only | The wiki still needs accurate workflow source material without coupling to upstream docs UI. | Accepted |
| Use React state with SVG for the first interactive flow | It is enough for clickable nodes and detail panels without adding a graph library too early. | Accepted |
| Start with browser-side recommendation rules | Validates command-selection UX before adding backend or LLM dependencies. | Pending |
| Phase 1 Scenario Model outside React rendering | Data-driven scenario slices are required for stepwise command choices and future expansion. | Phase 1 — 2026-06-27 |
| Phase 1 detail panel hosts secondary routes and source badges | Keeps the SVG map focused on the active path while preserving alternatives and terminal choices. | Phase 1 — 2026-06-27 |
| Phase 1 citation policy uses maestro-flow command files first | Command definitions are the primary source of command semantics; guides explain flow and Codex skills confirm platform differences. | Phase 1 — 2026-06-27 |

## Stakeholders

- Product owner / repository maintainer
- New Maestro Flow users
- Developers choosing between Maestro commands
- Future content maintainers for workflow explanations

---
*Last updated: 2026-06-27 after initialization*
