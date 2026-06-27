---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: architecture-decision-record
id: ADR-001
---

# ADR-001: Data-driven Scenario Model

## Context

REQ-001 requires scenario data to express slices, steps, choices, terminal options, and citations. Current code embeds static `nodes` and `edges` in `src/main.tsx`, and tracks only selected node state.

## Decision

The system MUST introduce a data-driven Scenario Model outside React rendering components.

## Alternatives

- Keep static inline arrays: rejected because it cannot scale to stepwise command choices.
- Generate data from `maestro-flow` immediately: deferred because MVP can use built-in data with an extraction seam.

## Consequences

- Rendering components become simpler and scenario-driven.
- Scenario fixtures can be tested independently.
- Future source extraction remains possible.

## Evidence

- REQ-001, REQ-002, REQ-003.
- Brainstorm architecture analysis: `system-architect/analysis.md` recommends `Scenario`, `ScenarioStep`, `ScenarioChoice`, `TerminalOption`, and `SourceRef`.
*** Add File: /workspace/.workflow/blueprint/BLP-stepwise-scenario-map-2026-06-27/architecture/ADR-002-detail-panel-secondary-routes.md
---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: architecture-decision-record
id: ADR-002
---

# ADR-002: Detail Panel for Secondary Routes

## Context

REQ-004 requires stop, quality, and knowledge continuation choices without expanding downstream pipeline internals. NFR-UX-001 requires active route clarity.

## Decision

The detail panel SHOULD host secondary alternatives, terminal routes, and source badges while the map keeps the active Scenario Slice primary.

## Alternatives

- Render all continuation branches on the map: rejected due to choice overload.
- Hide continuation routes: rejected because the user explicitly wants optional stop/continue routes.

## Consequences

- Map remains readable.
- Detail panel becomes the main interaction surface for alternatives.
- UI must preserve keyboard access for secondary actions.

## Evidence

- REQ-004, NFR-UX-001, NFR-A11Y-001.
- Cross-role review S-001 resolved that the detail panel should host secondary alternatives.
