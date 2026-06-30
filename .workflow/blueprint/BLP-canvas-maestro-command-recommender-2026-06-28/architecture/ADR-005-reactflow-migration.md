---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-005
status: accepted
created_at: 2026-06-30T09:30:00Z
supersedes_partial:
  - ADR-002 (rendering approach only)
---

# ADR-005: React Flow 技术栈迁移

## Decision

Canvas 渲染层从「SVG + React state 自研」迁移到 **@xyflow/react 12**（原 React Flow）。

技术栈整体定为：

- React 18 + TypeScript 5 + Vite 6
- Tailwind CSS 3（暗色主题 + 自定义 canvas/accent 色板）
- @xyflow/react 12（负责所有节点图/状态机/命令地图/无限画布场景）
- Vitest 4 + Testing Library（单元测试）

## Evidence

### 触发事件

v0.1 的 `src/main.tsx`（单文件 + SVG 自研）和 `src/styles.css` 已归档到 `archive/src-reference-20260630/`。当前 `src/App.tsx` 是基于新栈的 wireframe，脚手架已完成（commit `811e609` / `0ccb012` / `32e5129`）。

### 选型理由

1. **R3 状态机 + 命令地图 + 后续无限画布**是项目核心，自研 SVG 需 3-5 倍工作量
2. React Flow 原生满足 R3「节点点击 + 键盘聚焦 + 详情面板联动」（`nodesFocusable` + `onNodeClick` + 本地 state）
3. 性能在 <2000 节点场景无瓶颈，足够覆盖 Phase 2 范围
4. 社区生态成熟（n8n / Langflow / ComfyUI 新版均采用）

详细决策记录见 `.monkeycode/specs/maestro-workflow-wiki/design.md` D-001 ~ D-002。

## Consequences

### 与 ADR-002 的关系（部分修订）

ADR-002 的**数据层决策仍然有效**（branch-aware state: nodes / edges / recommendationGroups / activeBranchId），但**渲染层约束作废**：

- ❌ 作废：「rendering must control visual complexity with active branch focus」（这是基于 SVG 自研的约束）
- ✅ 替代：使用 React Flow 的节点高亮（`selected`）、边样式（`animated` / `style`）、`nodesDraggable` 等内置能力控制视觉复杂度

ADR-002 中 branch-aware state 数据结构（nodes / edges / activeBranchId）可以直接映射到 React Flow 的 nodes/edges props，无需中介层。

### 代码锚点迁移

| 旧锚点（已失效） | 新锚点 |
|----------------|-------|
| `src/main.tsx:66` (ScenarioModel) | `src/App.tsx`（当前 wireframe，待重构为 `src/data/scenarios.ts`） |
| `src/main.tsx:309` (selectedNodeId/activeStepId) | `src/App.tsx` 中的 `useState<ScenarioId>` |
| `src/styles.css` (workspace layout 1fr+390px) | `tailwind.config.js` + `src/index.css`（暗色主题，无右 sidebar） |

### EPIC-002 影响修正

EPIC-002 提到的「Remove large permanent right sidebar」在新 App.tsx wireframe 中**天然满足**（wireframe 根本没有 sidebar）。该 story 可直接标记 done。

### 后续 ADR 锚点规范

后续 ADR 引用代码必须使用 `src/` 当前路径，禁止引用 `archive/` 下文件。引用归档文件时必须显式标注 `(archived)`。

## References

- `.monkeycode/specs/maestro-workflow-wiki/design.md` v2 决策记录 D-001 / D-002
- `.monkeycode/specs/maestro-workflow-wiki/design-v1.md`（已归档，仅历史参考）
- React Flow 官方文档：https://reactflow.dev/
