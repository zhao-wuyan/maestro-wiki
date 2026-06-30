---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-002
status: superseded
updated_at: 2026-06-30T09:50:00Z
superseded_by: ADR-006
---

# ADR-002: Branch-Aware Canvas State (superseded)

> **本 ADR 已被 [ADR-006](./ADR-006-form-driven-shape.md) 完全取代**（数据层 + 渲染层均作废）。
> 保留原文仅作历史追溯。新 execute 不再实现本 ADR 描述的模型。

## Decision (legacy)

The canvas MUST use branch-aware state with nodes, edges, recommendation groups, and activeBranchId.

## Evidence (legacy)

- REQ-003 requires multiple independently growing branches.
- ~~`src/main.tsx:309`~~（已归档至 `archive/src-reference-20260630/main.tsx`）

## Consequences (legacy, all void)

~~数据层：The model supports multi-branch exploration.~~（作废）

~~渲染层：rendering must control visual complexity with active branch focus.~~（作废）

## Supersession

**ADR-006 替代方案**：

- 推荐结果直接展示在表单结果面板，不进入节点
- 多 rank 推荐通过结果面板分组展示
- 数据 schema 从 `nodes/edges/activeBranchId` 简化为 `RecommendationResult` 单一对象
