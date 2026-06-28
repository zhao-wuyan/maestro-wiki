# Context: Phase 2 -- Local Canvas Recommender

**Date**: 2026-06-28
**Areas discussed**: recommendation rules, canvas state, canvas UI, local persistence, source provenance

## Interview Decisions

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Mode | Auto `-y` | user |
| 2 | Scope | Phase 2 Local Canvas Recommender | state/roadmap |
| 3 | Depth | Standard with concerns | default/tooling |

## Decisions

### Decision 1: Rule-First Migration
- **Context**: Current app has typed scenario data but no recommender rule layer.
- **Options**:
  1. Directly rewrite UI.
  2. Define rules/state contracts first.
- **Chosen**: Define rules/state contracts first.
- **Reason**: It keeps recommendation evidence, equal-rank handling, and sourceRef validation testable.

### Decision 2: Keep Phase 2 Static and Local
- **Context**: Blueprint separates local MVP from sharing/gallery and real state parsing.
- **Chosen**: Use simulated browser state and localStorage only.
- **Reason**: Backend/share URLs belong to Phase 3.

## Constraints

### Locked

- `CommandRuleSet` or equivalent local rule layer must be introduced before the UI depends on recommendation output.
- Recommendation facts and rules must cite `maestro-flow/` source paths.
- Canvas state must be branch-aware.
- Public sharing/gallery, backend storage, browser-runtime LLM, and real `.workflow/state.json` parsing are out of scope for Phase 2.
- The `maestro-flow/` submodule remains read-only.

### Free

- Rule storage can be TypeScript-first for MVP if it preserves schema clarity and validation.
- Canvas layout can use authored/simple coordinates first; auto-layout is optional.
- Context details may be inline popovers/drawers/cards as long as the permanent large right sidebar is removed.

### Deferred

- Route sharing and public gallery are deferred to Phase 3.
- Backend or hosted storage decision is deferred to Phase 3.
- Real project `.workflow/state.json` import is deferred beyond static MVP.

## Code Context

- `src/main.tsx:66` current `ScenarioModel` boundary.
- `src/main.tsx:273` current reference validator pattern.
- `src/main.tsx:306` current single-path active state.
- `src/main.tsx:404` permanent right detail panel.
- `src/styles.css:78` two-column layout with 390px panel.
- `src/main.test.tsx:6` current interaction test suite.
