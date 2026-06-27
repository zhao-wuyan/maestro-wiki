---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-001
status: accepted
---

# ADR-001: Local CommandRuleSet Layer

## Decision

The app MUST introduce a local `CommandRuleSet` consumed by the recommendation engine and React UI.

## Evidence

- REQ-002 requires local command facts and recommendation rules.
- `src/main.tsx:66` currently defines a single authored `ScenarioModel`, which cannot represent source-backed recommendation rules.
- `maestro-flow/.codex/skills/maestro-help/catalog.json` and `maestro-flow/.claude/commands/maestro-next.md` provide upstream catalog and scoring concepts.

## Consequences

Rules become testable outside React rendering. Rule updates require protocol and validation.
