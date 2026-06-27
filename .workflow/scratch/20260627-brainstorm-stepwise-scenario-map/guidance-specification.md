# Guidance Specification: Stepwise Scenario Map

## 1. Project Positioning & Goals

Maestro Workflow Wiki MUST help users choose Maestro commands as a stepwise scenario journey, not as a single one-shot recommendation. The first scenario slice focuses on unclear requirements and MUST show how users select the first command, interpret output conditions, and choose stop or continuation routes.

## 2. Concepts & Terminology

| Term | Definition | Status |
|---|---|---|
| Scenario Model | Data model that groups workflow nodes, edges, steps, current step, available choices, and terminal options for one user scenario. | LOCKED |
| Scenario Slice | A focused subset of the workflow map for one user scenario, avoiding an unreadable global graph. | LOCKED |
| Continuation Route | Optional route from a closing node into another workflow path such as quality checks or knowledge capture. | LOCKED |
| Closing Node | Valid stopping or transition point after a command sequence. | LOCKED |
| Command-Chain Source of Truth | `maestro-flow` submodule is authoritative for command names, sequence semantics, and workflow facts. | LOCKED |

## 3. Non-Goals

- The MVP MUST NOT parse real `.workflow/.maestro/*/status.json` files.
- The MVP SHOULD NOT expand internal steps of quality or knowledge-capture pipelines.
- The MVP MUST NOT reuse `maestro-flow/docs-site` as product foundation.

## 4. Locked Grill Constraints

- The map MUST model completion as user-selectable exit or continuation routes.
- The MVP MUST introduce scenario-oriented data instead of relying only on selected node state.
- The MVP SHOULD use hand-authored built-in scenario data while preserving a future extraction seam.
- The Scenario Model SHOULD support cross-scenario transitions at key nodes.
- The MVP MUST keep recommended path primary and alternate routes secondary in the detail panel.
- Scenario command facts MUST align with the `maestro-flow` submodule.
- The map SHOULD render one active scenario slice at a time.

## 5. Existing Implementation Gap

- `src/main.tsx` currently supports node selection only through `selectedId`.
- Current `nodes` and `edges` are static and do not model scenarios, steps, choices, terminal options, or cross-scenario transitions.

## 10. Feature Decomposition

| ID | Feature | Priority | Description | Acceptance |
|---|---|---|---|---|
| F-001 | Scenario Model | MUST | Define data shape for scenario slices, steps, choices, terminal options, and source citations. | A scenario can express the unclear-requirements path, current step, next command options, and stop/continue routes without hardcoding UI logic. |
| F-002 | Scenario Slice Navigation | MUST | Render one active scenario slice at a time and allow switching at key nodes. | Users see a focused map for the active scenario and can switch to another scenario only from explicit transition points. |
| F-003 | Stepwise Command Choice | MUST | Let users progress through command choices based on previous output conditions. | Users can follow first command, output condition, next command choices, and reach a closing node. |
| F-004 | Continuation Route Panel | MUST | Present stop, quality pipeline, and knowledge-capture continuation choices as secondary actions. | Closing nodes show continuation choices in the detail panel without expanding downstream pipeline internals on the map. |
| F-005 | Upstream Citation Layer | SHOULD | Attach `maestro-flow` source references to scenario facts and command sequences. | Each command sequence can cite an upstream workflow/source reference or be marked as pending citation. |
| F-006 | Validation Checklist | SHOULD | Provide internal validation prompts to confirm users can choose the command sequence. | Users can self-check that they can choose the first command and subsequent commands until stopping or continuing. |

## 11. Appendix: Decision Tracking

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Brainstorm mode | 自动多角色 | user |
| 2 | Selected roles | product-manager, ux-expert, system-architect, test-strategist, ui-designer | user |
| 3 | Visual design foundation | 单独设计 | user |

## 12. Cross-Role Resolutions

### Cross-Role Resolutions (added 2026-06-27)

| ID | Type | Source(s) | Resolution | Applied to |
|---|---|---|---|---|
| G-001 | gap | product-manager, system-architect, test-strategist | The MVP SHOULD support `citationStatus` and may show pending citation labels for explanatory text, but command names and sequence semantics MUST align with `maestro-flow`. | guidance spec |
| G-002 | gap | product-manager, ux-expert, test-strategist | The validation checklist MUST test whether users can choose the first command and subsequent commands from scenario states until stop or continuation. | guidance spec |
| S-001 | synergy | ux-expert, ui-designer, system-architect | The detail panel SHOULD host secondary alternatives, terminal routes, and source badges so the map remains focused on the primary scenario path. | guidance spec |
