# Product Manager Analysis

## 1. Role Mandate

Clarify MVP value, prioritization, and roadmap readiness for the stepwise scenario map.

## 2. Decision Digest

### Product Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Scenario Model MUST be treated as an MVP enabler, not technical polish. | locked | `guidance-specification.md` §10; grill C-002 |
| F-002 | Scenario Slice Navigation MUST keep the first release focused on unclear requirements. | locked | grill D-009 |
| F-003 | Stepwise Command Choice MUST be the core validation loop. | locked | user-corrected success criterion |
| F-004 | Continuation Route Panel MUST show optional exits without expanding pipelines. | locked | grill D-001, D-002 |
| F-005 | Upstream citations SHOULD ship as visible trust markers or pending-citation labels. | open | grill D-007 |
| F-006 | Validation Checklist SHOULD measure whether users can continue command selection, not just pick the first command. | locked | grill D-010 |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-002 | Adding multiple scenarios too early dilutes MVP value. | medium | Ship one primary scenario slice first. |
| F-003 | Users may expect real execution guidance. | medium | Label outputs as conditions, not live status. |
| F-005 | Citation work may slow MVP. | medium | Mark pending citations and prioritize source alignment for the first scenario. |

### Dependencies

| Feature | Depends On | Rationale | Evidence |
|---|---|---|---|
| F-003 | F-001 | Stepwise choices require scenario state. | `src/main.tsx:102` only has selected node state. |
| F-004 | F-003 | Continuation routes appear after command progression. | grill Q1.1 |
| F-006 | F-003 | Validation checks the sequence, not isolated nodes. | user correction |

### Open Questions

| Feature | Question | Owner | Status |
|---|---|---|---|
| F-005 | Which upstream files are authoritative for unclear-requirements scenario sequence? | product + architecture | open |

## 3. Cross-Cutting Foundations

The MVP SHOULD be framed as an internal validation tool. Success is not page completeness; success is whether users can use a scenario slice to decide the next Maestro command repeatedly until they stop or continue.

## 4. File Index

| File | Purpose |
|---|---|
| analysis-F-001-scenario-model.md | Product value of scenario data |
| analysis-F-002-scenario-slice-navigation.md | Scope and prioritization of slice navigation |
| analysis-F-003-stepwise-command-choice.md | Core product loop |
| analysis-F-004-continuation-route-panel.md | Exit and continuation choices |
| analysis-F-005-upstream-citation-layer.md | Trust and source alignment |
| analysis-F-006-validation-checklist.md | Internal validation criteria |

## 5. TODOs

- Define first scenario's command sequence with upstream citations.
- Turn F-001 to F-006 into roadmap phases after multi-role review.
