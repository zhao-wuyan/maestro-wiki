# Test Strategist Analysis

## 1. Role Mandate

Define validation strategy for scenario comprehension, interaction correctness, accessibility, and source alignment.

## 2. Decision Digest

### Test Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Scenario data MUST have fixture-level tests once logic expands. | locked | `.workflow/specs/test.md` says command recommendation logic needs scenario fixtures |
| F-002 | Scenario switching SHOULD be tested through user-visible interactions. | locked | grill Q3.1 |
| F-003 | Stepwise command selection MUST be tested as an end-to-end scenario. | locked | corrected success criterion |
| F-004 | Terminal options MUST be tested for visibility without deep pipeline expansion. | locked | grill Q1.2 |
| F-005 | Source citation coverage SHOULD be auditable. | open | grill Q4.1 |
| F-006 | Validation checklist MUST test sequence comprehension. | locked | F-006 acceptance |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-003 | Passing UI tests but failing comprehension. | high | Add human validation script/checklist. |
| F-004 | Continuation choices become hidden to keyboard users. | high | Test keyboard focus and screen-reader labels. |
| F-005 | Citation pending labels become permanent. | medium | Add citation coverage metric. |

### Dependencies

| Feature | Depends On | Rationale | Evidence |
|---|---|---|---|
| F-006 | F-003 | Checklist follows scenario progression. | user correction |
| F-005 | F-001 | Citations attach to structured scenario data. | architecture analysis |

### Open Questions

| Feature | Question | Owner | Status |
|---|---|---|---|
| F-006 | What is the minimum passing threshold for internal validation? | product + test | open |

## 3. Cross-Cutting Foundations

Test strategy SHOULD combine build validation, interaction checks, accessibility checks, and internal comprehension prompts. Automated tests can verify state transitions; human validation verifies command-selection learning.

## 4. File Index

| File | Purpose |
|---|---|
| analysis-F-001-scenario-model.md | Fixture testing |
| analysis-F-002-scenario-slice-navigation.md | Scenario switching tests |
| analysis-F-003-stepwise-command-choice.md | E2E sequence tests |
| analysis-F-004-continuation-route-panel.md | Terminal option tests |
| analysis-F-005-upstream-citation-layer.md | Citation coverage |
| analysis-F-006-validation-checklist.md | Comprehension validation |

## 5. TODOs

- Define 3 internal validation prompts before roadmap.
