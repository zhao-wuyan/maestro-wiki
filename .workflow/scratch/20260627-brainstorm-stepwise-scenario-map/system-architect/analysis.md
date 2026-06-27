# System Architect Analysis

## 1. Role Mandate

Define the technical architecture, data model, state machine, and integration seams for the stepwise scenario map.

## 2. Decision Digest

### Architecture Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Scenario data MUST be separated from React rendering logic. | locked | current `src/main.tsx:18` embeds node data inline |
| F-002 | Scenario slices SHOULD be selected by scenario ID, not by filtering one global graph at render time. | locked | grill Q5.1 |
| F-003 | Step progression MUST be modeled with activeStepId and choices. | locked | grill Q2.1 |
| F-004 | Terminal options MUST be first-class data, not special UI cases. | locked | grill Q1.1 |
| F-005 | Citation fields SHOULD be optional but typed. | locked | grill Q4.1 |
| F-006 | Validation events MAY be local-only in MVP. | open | no persistence requirement yet |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-001 | Overfitting to first scenario makes future slices hard. | high | Define generic `Scenario`, `ScenarioStep`, `ScenarioChoice` types. |
| F-005 | Source drift if citations are not maintained. | high | Add `sourceRefs` array and `citationStatus`. |
| F-003 | Branching state becomes complex. | medium | Keep MVP state client-local and deterministic. |

### Dependencies

| Feature | Depends On | Rationale | Evidence |
|---|---|---|---|
| F-002 | F-001 | Slice navigation requires scenario registry. | grill Q2.1 |
| F-004 | F-003 | Terminal options are shown after step choices. | grill Q1.1 |
| F-005 | F-001 | Citations attach to commands, steps, and choices. | grill Q4.1 |

### Open Questions

| Feature | Question | Owner | Status |
|---|---|---|---|
| F-005 | Should missing citations block release or show pending badges? | product + architecture | open |

## 3. Cross-Cutting Foundations

### Data Model

The MVP SHOULD introduce these core types: `Scenario`, `ScenarioStep`, `ScenarioChoice`, `TerminalOption`, and `SourceRef`. Scenario data SHOULD live outside the React component tree, likely in a separate module.

### State Machine

State SHOULD be minimal: `activeScenarioId`, `activeStepId`, `selectedNodeId`, and optionally `visitedStepIds`. Choices transition to another step, a terminal option, or a cross-scenario transition.

## 4. File Index

| File | Purpose |
|---|---|
| analysis-F-001-scenario-model.md | Data model |
| analysis-F-002-scenario-slice-navigation.md | Scenario registry and switching |
| analysis-F-003-stepwise-command-choice.md | State machine |
| analysis-F-004-continuation-route-panel.md | Terminal option structure |
| analysis-F-005-upstream-citation-layer.md | SourceRef model |
| analysis-F-006-validation-checklist.md | Validation event model |

## 5. TODOs

- Extract current inline `nodes` and `edges` into scenario data module.
