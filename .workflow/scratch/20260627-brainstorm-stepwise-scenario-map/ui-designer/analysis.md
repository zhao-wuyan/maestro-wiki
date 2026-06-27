# UI Designer Analysis

## 1. Role Mandate

Define visual hierarchy for path highlighting, scenario slices, detail-panel secondary actions, and future visual design work.

## 2. Decision Digest

### UI Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Scenario state SHOULD be visible through badges and step indicators. | locked | UX need for orientation |
| F-002 | Active scenario path MUST be visually dominant over inactive context. | locked | grill Q3.2 |
| F-003 | Recommended next command SHOULD use a primary action treatment. | locked | UX analysis F-003 |
| F-004 | Continuation routes SHOULD use grouped secondary cards. | locked | grill Q1.2 |
| F-005 | Citations SHOULD be subdued badges or expandable source rows. | open | source layer not yet designed |
| F-006 | Validation checklist SHOULD feel like a lightweight confidence check, not a form. | open | no design system yet |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-002 | Overuse of highlights reduces clarity. | medium | Use one dominant active route color and muted inactive nodes. |
| F-004 | Secondary options look like primary next steps. | medium | Separate visual hierarchy and labels. |
| F-005 | Source badges add clutter. | low | Use progressive disclosure. |

### Dependencies

| Feature | Depends On | Rationale | Evidence |
|---|---|---|---|
| F-002 | F-001 | Highlighting depends on scenario state. | architecture analysis |
| F-004 | F-003 | Continuation appears after command step choices. | grill Q1.1 |

### Open Questions

| Feature | Question | Owner | Status |
|---|---|---|---|
| F-006 | Should validation be inline in the map or a final panel? | UI + UX | open |

## 3. Cross-Cutting Foundations

Visual design SHOULD support comprehension: active route, current command, condition, next choice, and optional exits must have distinct hierarchy. A dedicated design pass should refine style tokens later.

## 4. File Index

| File | Purpose |
|---|---|
| analysis-F-001-scenario-model.md | State visibility |
| analysis-F-002-scenario-slice-navigation.md | Active route visual hierarchy |
| analysis-F-003-stepwise-command-choice.md | Primary next command treatment |
| analysis-F-004-continuation-route-panel.md | Secondary action design |
| analysis-F-005-upstream-citation-layer.md | Citation badge design |
| analysis-F-006-validation-checklist.md | Validation UI |

## 5. TODOs

- Run a dedicated visual design pass before implementation polish.
