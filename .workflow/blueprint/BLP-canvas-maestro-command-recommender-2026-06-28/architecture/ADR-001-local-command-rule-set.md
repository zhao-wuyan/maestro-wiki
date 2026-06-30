---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-001
status: accepted
updated_at: 2026-06-30T09:30:00Z
---

# ADR-001: Local CommandRuleSet Layer

## Decision

The app MUST introduce a local `CommandRuleSet` consumed by the recommendation engine and React UI.

## Evidence

- REQ-002 requires local command facts and recommendation rules.
- ~~`src/main.tsx:66` currently defines a single authored `ScenarioModel`~~（**2026-06-30 锚点修订**：旧 `src/main.tsx` 已归档到 `archive/src-reference-20260630/main.tsx`；当前 `src/App.tsx` 是 v0.2 wireframe，使用静态 `SCENARIOS` 数组，待重构为 `src/data/command-rule-set.ts`，详见 ADR-005）
- `maestro-flow/.codex/skills/maestro-help/catalog.json` and `maestro-flow/.claude/commands/maestro-next.md` provide upstream catalog and scoring concepts.

## Consequences

Rules become testable outside React rendering. Rule updates require protocol and validation.
