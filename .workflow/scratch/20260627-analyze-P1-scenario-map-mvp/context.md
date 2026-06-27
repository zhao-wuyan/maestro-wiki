# Context: Phase 1 -- Scenario Map MVP

**Date**: 2026-06-27
**Areas discussed**: Scenario Model, local interaction state, detail panel responsibilities, source citation policy, validation boundaries.

## Interview Decisions

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Scope | Phase 1 micro analysis | user |
| 2 | Depth | Standard | default |
| 3 | Dimensions | All 6 dimensions | default |
| 4 | Deepen weak dimension | Citation Source | user |

## Decisions

### Decision 1: Data-Driven Scenario Model
- **Context**: Current `src/main.tsx` hardcodes nodes and edges in the render entry file.
- **Options**:
  1. Keep hardcoded graph data in `src/main.tsx`.
  2. Extract typed scenario data and helpers outside JSX.
  3. Adopt a graph library and external graph schema.
- **Chosen**: Extract typed scenario data and helpers outside JSX.
- **Reason**: Satisfies blueprint ADR-001/REQ-001 with the smallest implementation change.

### Decision 2: Local Step State
- **Context**: Current app has only `selectedId`; Phase 1 needs current scenario and current step.
- **Options**:
  1. Keep `selectedId` only.
  2. Add local `activeScenarioId`, `activeStepId`, and optional `visitedStepIds`.
  3. Add global state management.
- **Chosen**: Add local scenario/step state.
- **Reason**: Enough for MVP and avoids unnecessary state infrastructure.

### Decision 3: Detail Panel as Secondary Surface
- **Context**: The map should stay readable while still showing choices, terminal routes, and citation status.
- **Options**:
  1. Put all branches on the SVG map.
  2. Hide alternatives until later.
  3. Keep the map focused and place alternatives/routes/citations in the detail panel.
- **Chosen**: Keep the map focused and place alternatives/routes/citations in the detail panel.
- **Reason**: Matches ADR-002 and avoids choice overload.

### Decision 4: Citation Source Policy
- **Context**: REQ-005 requires command facts to align with `maestro-flow`.
- **Options**:
  1. Use only command catalog entries.
  2. Use only guide documents.
  3. Cite command definitions first, guide docs second, and Codex skill mirrors for platform differences.
- **Chosen**: Cite command definitions first, guide docs second, and Codex skill mirrors for platform differences.
- **Reason**: Command files are authoritative for command semantics; guides explain chain flow; Codex mirrors reveal environment-specific behavior.

## Constraints

### Locked

- Scenario data must live outside React rendering components.
- Phase 1 should not introduce a backend, login, LLM service, or real `status.json` parser.
- The SVG map should emphasize the active scenario path; alternatives, terminal routes, and source badges belong in the detail panel.
- First scenario citation policy must prefer `maestro-flow/.claude/commands/*.md`, then `maestro-flow/guide/*.md`, then `maestro-flow/.codex/skills/*/SKILL.md` for platform checks.
- UI copy must not imply commands are being executed; output conditions are educational scenario states.

### Free

- Exact file/module names for scenario types and fixtures are implementation discretion, though `src/scenarios.ts` is recommended.
- Validation checklist pass threshold may be informational or require all checks; implementation should choose the least surprising local-only behavior.
- Whether source reference validation is a runtime helper, TypeScript check, or later test can be decided during planning.

### Deferred

- Full visual design system polish belongs after the core scenario loop works.
- Graph library adoption remains deferred until manual SVG layout becomes a real blocker.
- LLM-backed recommendation, shareable custom chains, real status parsing, and personalization remain out of Phase 1.
- Cleanup of suspected ADR-001 patch pollution is useful but not required for Phase 1 implementation.

## Code Context

- `src/main.tsx:18` contains hardcoded graph node data.
- `src/main.tsx:93` contains hardcoded edge data.
- `src/main.tsx:103` initializes selected-only graph state.
- `src/main.tsx:156` already supports keyboard selection for map nodes.
- `src/main.tsx:174` is the detail panel seam for choices, routes, source badges, and validation.
- `src/styles.css:71` supports the current map/detail two-column layout.
- `package.json:6` has no test script; `npm run build` is the current baseline validation command.

## Plan Handoff

Recommended implementation order:
1. Scenario types and first scenario fixture.
2. Local current scenario/current step state and active path derivation.
3. Detail panel step content, choices, terminal routes, and source badges.
4. Local validation checklist and styling.
5. Build validation with `npm run build`.
