---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: functional-requirement
id: REQ-002
---

# REQ-002: Scenario Slice Navigation

## Description

The system MUST render one active Scenario Slice at a time and SHOULD allow switching to another scenario only from explicit transition points.

## User Story

As a learner, I want to see only the scenario path relevant to my current task so that I am not overwhelmed by the full Maestro command graph.

## Acceptance Criteria

- The map MUST highlight the active Scenario Slice.
- Inactive scenario paths SHOULD be hidden or visually de-emphasized.
- Cross-scenario transitions MUST be explicit and labeled.
- The UI MUST show current scenario identity and current step.
