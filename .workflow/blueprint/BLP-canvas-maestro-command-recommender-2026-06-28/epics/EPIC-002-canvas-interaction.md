---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
epic_id: EPIC-002
status: revised
revised_at: 2026-06-30T09:50:00Z
decision_ref: ADR-006
---

# EPIC-002: Form Interaction (revised from Canvas Interaction)

> 原 EPIC-002（canvas interaction）已随 ADR-006 重写为表单交互。

## Stories (revised)

- ~~Replace the fixed scenario map with a central initial node.~~ → **Provide a textarea as primary task input.**
- ~~Generate recommendation groups from simulated state and rules.~~ → **Run rule engine on form submit, render results in result panel.**
- ~~Allow multiple branches to grow independently.~~ → **Drop multi-branch; show ranked recommendations as peer options in panel.**
- ~~Remove large permanent right sidebar from core interaction.~~ → **DONE: wireframe never had sidebar.**
- ~~Add edge notes for path rationale.~~ → **Show rationale inline in result panel field "推荐理由".**

## Acceptance

REQ-003-v2 and REQ-004-v2 are satisfied.
