# UX Expert Analysis

## 1. Role Mandate

Define the interaction model for scenario slices, path highlighting, primary/secondary choices, and user comprehension.

## 2. Decision Digest

### UX Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Scenario Model MUST map directly to visible user steps. | locked | grill Q2.1 |
| F-002 | The map SHOULD render one active scenario slice and avoid global graph overload. | locked | grill Q5.1 |
| F-003 | Each step MUST show current command, output condition, recommended next command, and alternatives. | locked | corrected success criterion |
| F-004 | Continuation choices MUST appear as secondary actions in the detail panel. | locked | grill Q3.2 |
| F-005 | Citations SHOULD be visually quiet but available on demand. | open | grill Q4.1 |
| F-006 | Validation SHOULD use task-based prompts, not abstract satisfaction questions. | locked | F-006 acceptance |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-003 | Users confuse conditional outputs with actual command results. | high | Use labels like “If output shows...” and “Suggested next”. |
| F-004 | Too many secondary options compete with the main path. | medium | Limit secondary actions to grouped route cards. |
| F-002 | Scenario switching can disorient users. | medium | Show breadcrumb: Scenario > Step > Choice. |

### Dependencies

| Feature | Depends On | Rationale | Evidence |
|---|---|---|---|
| F-004 | F-003 | Continuation choices appear after step resolution. | grill Q1.1 |
| F-006 | F-003 | Validation mirrors the command-choice journey. | user correction |

### Open Questions

| Feature | Question | Owner | Status |
|---|---|---|---|
| F-002 | Should inactive future scenarios be hidden or shown as disabled? | UX | open |

## 3. Cross-Cutting Foundations

The UX MUST prioritize orientation: where am I, why this command, what output matters, what can I do next. The map is a guide, not a graph database.

## 4. File Index

| File | Purpose |
|---|---|
| analysis-F-001-scenario-model.md | User-visible state model |
| analysis-F-002-scenario-slice-navigation.md | Navigation and orientation |
| analysis-F-003-stepwise-command-choice.md | Command-choice interaction |
| analysis-F-004-continuation-route-panel.md | Secondary actions |
| analysis-F-005-upstream-citation-layer.md | Citation UX |
| analysis-F-006-validation-checklist.md | User validation flow |

## 5. TODOs

- Prototype detail panel states for active step, output condition, alternatives, and continuation routes.
