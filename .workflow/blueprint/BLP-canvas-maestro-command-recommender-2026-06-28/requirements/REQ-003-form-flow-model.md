---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
requirement_id: REQ-003-v2
status: active
replaces: REQ-003
created_at: 2026-06-30T09:50:00Z
decision_ref: ADR-006
---

# REQ-003-v2: Form-Flow Recommendation Model

The product MUST provide a form-driven recommendation model that accepts user task input and scenario selection, runs the rule engine, and presents ranked recommendation results.

## User Story

As a user confused about which Maestro command to use, I want to describe my task in plain language or pick a scenario card, then see clear ranked recommendations with rationale, so that I can decide which command chain to follow.

## Acceptance Criteria

- The model MUST accept free-text task description as primary input.
- The model MUST accept scenario card selection (7 scenarios: 探索想法 / 生成规格 / 分析代码 / 制定计划 / 执行实现 / 质量检查 / 查看状态) as a secondary input that pre-fills or scopes the recommendation.
- The model MUST accept optional flags (`-y` / `--dry-run` / `-c` / `--super`) that affect recommendation output.
- Recommendation results MUST be presented in a result panel (not a canvas), with fields: recommended command, recommended chain, rationale, confidence, clarifying questions.
- Equal-rank recommendations MUST be presented as peer options (max 3 per the underlying rule set).
- The model MUST support a "re-recommend" action when user provides additional clarification answers.

## Out of Scope (deferred to v2+)

- Canvas / node-graph interaction (ADR-006 作废)
- Multi-branch exploration (改为 result panel 中的 rank 分组)
- Drag-to-compose custom chains

## Traceability

- Replaces: REQ-003 (canvas model)
- Decision: ADR-006
- Source: 当前 `src/App.tsx` wireframe 已是该形态的骨架
