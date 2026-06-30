---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-002
status: accepted
updated_at: 2026-06-30T09:30:00Z
rendering_superseded_by: ADR-005
---

# ADR-002: Branch-Aware Canvas State

## Decision

The canvas MUST use branch-aware state with nodes, edges, recommendation groups, and activeBranchId.

> **数据层决策仍然有效**（nodes/edges/activeBranchId 数据结构可直接映射到 React Flow nodes/edges props）。
> **渲染层约束已被 ADR-005 取代**（见下方 Consequences）。

## Evidence

- REQ-003 requires multiple independently growing branches.
- ~~`src/main.tsx:309` currently stores only `selectedNodeId` and `activeStepId`~~（**2026-06-30 锚点修订**：旧文件已归档至 `archive/src-reference-20260630/main.tsx`；当前 `src/App.tsx` wireframe 用 `useState<ScenarioId>` 管理单一选中态，待扩展为 branch-aware 模型）

## Consequences

数据层：The model supports multi-branch exploration.

~~渲染层：rendering must control visual complexity with active branch focus.~~（**2026-06-30 作废**）

**渲染层替代方案（ADR-005）**：使用 React Flow 内置能力控制视觉复杂度：
- 节点 `selected` 状态 + 自定义 style 实现激活分支高亮
- 边 `animated` / `style.stroke` 区分活跃路径
- `nodesDraggable` / `nodesConnectable` 配置控制交互边界
