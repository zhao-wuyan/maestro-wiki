---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
requirement_id: REQ-003
status: superseded
superseded_at: 2026-06-30T09:50:00Z
superseded_by: REQ-003-v2
---

# REQ-003 (v1, superseded): Stepwise Canvas Model

> **本需求已被 [REQ-003-v2](./REQ-003-form-flow-model.md) 取代**（ADR-006）。
> 保留原文仅作历史追溯。新 execute 不再实现本需求。

## User Story (legacy)

As a user, I want the model to support multiple independently growing branches so that I can explore alternative command chains.

## Acceptance Criteria (legacy)

- The model MUST support multiple independently growing branches.
- The model MUST include an active branch selection.
- Nodes MUST store selected command and recommendation evidence.
- Edges SHOULD store optional user-authored notes.

## Supersession Reason

Canvas 中心形态作废（ADR-006），多分支生长改为表单结果面板中的 rank 分组展示。
