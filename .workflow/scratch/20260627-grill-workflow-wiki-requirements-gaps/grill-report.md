# Grill Report: Maestro Workflow Wiki Requirements Gaps

**Session**: GRL-20260627-workflow-wiki-requirements-gaps  
**Depth**: standard (5 branches)  
**Date**: 2026-06-27T04:05:00Z  
**Upstream**: `.workflow/scratch/20260627-brainstorm-maestro-workflow-wiki-requirements/guidance-specification.md`

## Discovery Summary

### Project Context

The project is an independent Vite + React + TypeScript wiki app. Current requirements say the MVP MUST validate scenario-based path highlighting and stepwise next-command choice for unclear requirements.

### Codebase Surface

- `src/main.tsx:18` defines static `nodes` data with node explanation fields.
- `src/main.tsx:93` defines static `edges` data.
- `src/main.tsx:102` uses only `selectedId` state, so current UI supports node selection but not scenario selection, path highlighting, or command-step progression.
- `src/main.tsx:119` labels the section as `Maestro 交互流程图`.
- `src/main.tsx:151` renders SVG nodes as keyboard-focusable buttons.

### Upstream Material

The brainstorm output defines `F-001 Scenario Path Selector`, `F-003 Path Highlighting`, and `F-005 Stepwise Next-Command Guide` as core MVP requirements.

---

## Branch Log

| # | Branch | Status | Decisions | Open Questions |
|---|--------|--------|-----------|----------------|
| 1 | Scope & Boundaries | Complete | 2 | 0 |
| 2 | Data Model & State | Complete | 2 | 0 |
| 3 | Edge Cases & Failure Modes | Complete | 2 | 0 |
| 4 | Integration & Dependencies | Complete | 2 | 0 |
| 5 | Scale & Performance | Complete | 2 | 0 |

---

## Branch 1: Scope & Boundaries

**Status**: In Progress  
**Questions asked**: 0  
**Decisions locked**: 0

### Q1.1: What counts as scenario completion?

**Question**: `src/main.tsx:102` currently has only `selectedId` state, while the requirement says users continue choosing commands until the goal is satisfied. What is the stopping condition for the `探索需求` scenario?

**Answer**: The scenario does not need one fixed terminal command. It can reach a closing node, a closing workflow, or a user-decided stopping point. For example, after executing a plan, the user may stop, continue into the quality pipeline, or continue into a knowledge-capture pipeline. The product should show the available routes and let users decide.

**Evidence**: User confirmation in grill session; current code lacks route/terminal-state modeling (`src/main.tsx:102`, `src/main.tsx:135`).

**Decision**: locked

**Constraint**: The workflow map MUST model completion as a set of user-selectable exit or continuation routes, not as a single mandatory terminal command.

### Q1.2: How deep should closing branches expand in MVP?

**Question**: Since closing points can branch into stop, quality pipeline, and knowledge-capture pipeline, how deep should the first map expand? Current code uses one static edge list (`src/main.tsx:93`), so full branch expansion would significantly increase complexity.

**Answer**: The first version should only show the closing branches as options: stop, continue to quality pipeline, or continue to knowledge-capture pipeline. It should not expand every internal step of those downstream pipelines yet.

**Evidence**: User confirmation in grill session; current static graph structure (`src/main.tsx:93`) is not ready for deep multi-pipeline expansion.

**Decision**: locked

**Constraint**: The MVP MUST show closing/continuation branch choices, but SHOULD NOT expand the internal steps of quality or knowledge-capture pipelines.

**Branch Completion**: Branch 1 locked the MVP boundary around visible command-sequence continuation choices without deep downstream pipeline expansion.

---

## Branch 2: Data Model & State

**Status**: In Progress  
**Questions asked**: 0  
**Decisions locked**: 0

### Q2.1: What state model supports stepwise command choice?

**Question**: To support selecting commands step by step until stop/continue routes, what data model should replace the current `FlowNode` shape? `src/main.tsx:5` has no command, step, choice, or terminal option fields.

**Answer**: Use a Scenario model containing nodes, edges, steps, currentStep, choices, and terminalOptions.

**Evidence**: User confirmation in grill session; current implementation only has `FlowNode` and `selectedId` (`src/main.tsx:5`, `src/main.tsx:102`).

**Decision**: locked

**Constraint**: The MVP MUST introduce a scenario-oriented data model for stepwise command selection instead of relying only on per-node selection state.

### Q2.2: Where does scenario data come from?

**Question**: Should scenario data be hand-authored, extracted from `maestro-flow`, or parsed at runtime? The project currently has no backend and no build script that reads `maestro-flow`; automatic synchronization would add complexity.

**Answer**: Use built-in scenario data for the first version, while reserving a future extraction/synchronization interface.

**Evidence**: User confirmation in grill session; current code has static in-file data (`src/main.tsx:18`, `src/main.tsx:93`) and no extraction layer.

**Decision**: locked

**Constraint**: The MVP SHOULD use hand-authored built-in scenario data, but the data shape SHOULD remain separable enough to support future extraction from `maestro-flow`.

**Branch Completion**: Branch 2 locked a Scenario Model with built-in data for MVP and a future extraction seam.

---

## Branch 3: Edge Cases & Failure Modes

**Status**: In Progress  
**Questions asked**: 0  
**Decisions locked**: 0

### Q3.1: What if the user needs to switch scenarios mid-path?

**Question**: If a user starts from `探索需求` but realizes the requirement is already clear and wants roadmap or plan, should the MVP force the original path or allow switching? Current requirements define only one first scenario.

**Answer**: Allow switching at key nodes to other scenario paths, such as from requirement exploration into planning/execution.

**Evidence**: User confirmation in grill session; current code has no scenario switch state (`src/main.tsx:102`).

**Decision**: locked

**Constraint**: The Scenario Model SHOULD support cross-scenario transitions at key nodes, even if only one primary scenario is fully detailed in the MVP.

### Q3.2: How does the UI avoid choice overload?

**Question**: If path highlighting, closing branches, and cross-scenario transitions are all visible, users may not know where to click next. How should the first version prevent overload?

**Answer**: Use primary/secondary layering. The main path stays highlighted on the map, while branches and cross-scenario transitions appear as secondary actions in the detail panel rather than being fully expanded on the map.

**Evidence**: User confirmation in grill session; current UI already has a detail panel (`src/main.tsx:174`) suitable for secondary actions.

**Decision**: locked

**Constraint**: The MVP MUST visually prioritize the recommended path on the map and place alternate branches/cross-scenario transitions in the detail panel as secondary actions.

**Branch Completion**: Branch 3 locked scenario switching and choice-overload mitigation through primary/secondary UI layering.

---

## Branch 4: Integration & Dependencies

**Status**: In Progress  
**Questions asked**: 0  
**Decisions locked**: 0

### Q4.1: What is the authority for command-chain truth?

**Question**: Hand-authored Scenario data can drift from actual `maestro-flow` command chains. Which source wins? Current project has the submodule as reference but no sync mechanism.

**Answer**: The `maestro-flow` submodule is the source of truth for command-chain facts. The site can hand-author MVP data, but it must mark its source and remain updateable.

**Evidence**: User confirmation in grill session; project decision says submodule is reference only, while content accuracy must be checked against it.

**Decision**: locked

**Constraint**: Scenario command names, sequence semantics, and workflow facts MUST align with the `maestro-flow` submodule as the authoritative source.

### Q4.2: Is this ready for roadmap or does it need more elaboration?

**Question**: After this grill, should the project go directly to roadmap, or does it need another intermediate artifact such as PRD, analyze, or multi-role brainstorm?

**Answer**: Run multi-role brainstorm next to expand product, UX, architecture, and testing perspectives before roadmap.

**Evidence**: User confirmation in grill session; current brainstorm was directional and did not run multi-role analysis.

**Decision**: locked

**Constraint**: The recommended next step SHOULD be multi-role brainstorm using this grill context before roadmap generation.

**Branch Completion**: Branch 4 locked upstream authority and next-step dependency: submodule-aligned facts plus multi-role elaboration before roadmap.

---

## Branch 5: Scale & Performance

**Status**: In Progress  
**Questions asked**: 0  
**Decisions locked**: 0

### Q5.1: How should the map scale beyond one scenario?

**Question**: If later versions cover planning, continue, quality repair, and knowledge capture, the graph may become unreadable. How should the first architecture avoid becoming one giant map?

**Answer**: Use scenario slicing. Show only the path relevant to the active scenario, with switch entries to other scenarios when needed.

**Evidence**: User confirmation in grill session; current static SVG map (`src/main.tsx:129`) would not scale well as one large graph.

**Decision**: locked

**Constraint**: The workflow map SHOULD be scenario-sliced, rendering one active scenario path at a time rather than one ever-growing global graph.

### Q5.2: How deeply should command outputs be simulated?

**Question**: Stepwise command selection depends on previous command outputs. Should the MVP parse real state, let users choose command results, or only explain conditions?

**Answer**: Only explain possible outputs and decision conditions. Do not simulate real execution state in the first version.

**Evidence**: User confirmation in grill session; current app is a static explanatory wiki and has no execution-state parser.

**Decision**: locked

**Constraint**: The MVP SHOULD explain output conditions that influence next-command choices, but MUST NOT require real `status.json` parsing or execution-state simulation.

**Branch Completion**: Branch 5 locked scenario slicing and condition-only output explanation to keep the MVP scalable and educational.

---

## Synthesis

### Decision Summary

| # | Decision | Status | Branch | RFC 2119 |
|---|----------|--------|--------|----------|
| D-001 | Completion is not a single terminal command; users choose stop or continuation routes. | locked | Scope & Boundaries | MUST model completion as exit/continuation choices. |
| D-002 | MVP shows closing branches but does not expand downstream pipeline internals. | locked | Scope & Boundaries | MUST show branch choices; SHOULD NOT expand pipeline internals. |
| D-003 | A Scenario Model is required for stepwise command selection. | locked | Data Model & State | MUST introduce scenario-oriented data. |
| D-004 | MVP scenario data is hand-authored, with a future extraction seam. | locked | Data Model & State | SHOULD use built-in data and keep extraction-ready shape. |
| D-005 | Users may switch scenarios at key nodes. | locked | Edge Cases & Failure Modes | SHOULD support cross-scenario transitions. |
| D-006 | Main path and alternatives use primary/secondary layering. | locked | Edge Cases & Failure Modes | MUST keep recommended path primary and alternatives secondary. |
| D-007 | `maestro-flow` submodule is workflow fact authority. | locked | Integration & Dependencies | MUST align command facts with upstream submodule. |
| D-008 | Next step should be multi-role brainstorm before roadmap. | locked | Integration & Dependencies | SHOULD elaborate with multi-role brainstorm. |
| D-009 | Workflow maps should scale by scenario slices. | locked | Scale & Performance | SHOULD render one active scenario path at a time. |
| D-010 | MVP explains output conditions but does not parse real execution state. | locked | Scale & Performance | SHOULD explain conditions; MUST NOT require real status parsing. |

### Verified Constraints

- Current code supports node selection only (`src/main.tsx:102`), so scenario selection, active path state, next-command choices, and terminal options are implementation gaps.
- Current static `edges` (`src/main.tsx:93`) is insufficient for branch choices, cross-scenario transitions, and scenario slicing.
- Current detail panel (`src/main.tsx:174`) is a suitable location for secondary alternatives and continuation choices.

### Open Questions

- Which roles should run in the follow-up multi-role brainstorm? Recommended: product-manager, ux-expert, system-architect, test-strategist.
- Which exact upstream files in `maestro-flow` should be cited for each command path in the first scenario slice?

### Risk Register

| # | Risk | Branch | Severity | Mitigation |
|---|------|--------|----------|------------|
| R-001 | Hand-authored scenario data drifts from `maestro-flow`. | Integration | High | Cite upstream source per scenario and plan future extraction seam. |
| R-002 | Too many branches make the map unreadable. | Edge Cases / Scale | Medium | Use scenario slicing and keep alternatives in detail panel. |
| R-003 | Users mistake condition explanations for real execution guidance. | Scale | Medium | Label MVP as educational and avoid implying real state parsing. |
| R-004 | Completion remains ambiguous without per-scenario exit criteria. | Scope | Medium | Define stop/quality/knowledge continuation options per closing node. |

### Recommended Next Step

Run multi-role brainstorm from this grill package before roadmap:

`/maestro-brainstorm "Maestro Workflow Wiki stepwise scenario map" --from grill:GRL-20260627-workflow-wiki-requirements-gaps`
