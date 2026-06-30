---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
requirement_id: REQ-004
status: superseded
superseded_at: 2026-06-30T09:50:00Z
superseded_by: REQ-004-v2
---

# REQ-004 (v1, superseded): Canvas Interaction UI

> **本需求已被 [REQ-004-v2](./REQ-004-form-interaction-ui.md) 取代**（ADR-006）。
> 保留原文仅作历史追溯。

## User Story (legacy)

As a user, I want a large canvas with an initial scenario node and node-local recommendations, so that I can explore commands spatially.

## Acceptance Criteria (legacy)

- The UI MUST NOT rely on a large permanent right sidebar for core interaction.
- Scenario selection MUST happen from the initial canvas node.
- Command recommendations MUST appear as selectable node-local options.
- Equal-rank recommendations MUST be presented as peer options.

## Supersession Reason

Canvas 中心形态作废（ADR-006），改为表单 + 结果面板。
