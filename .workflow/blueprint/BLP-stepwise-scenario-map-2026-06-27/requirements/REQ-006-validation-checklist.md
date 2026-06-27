---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: functional-requirement
id: REQ-006
---

# REQ-006: Validation Checklist

## Description

The system SHOULD include an internal Validation Checklist that tests whether users can choose the first command and subsequent commands from scenario states until stopping or continuing.

## User Story

As an internal validator, I want a short checklist after using the scenario map so that I can confirm whether the experience taught me how to choose the next command.

## Acceptance Criteria

- The checklist SHOULD ask users to identify the first command for unclear requirements.
- The checklist SHOULD ask users to choose at least one subsequent command based on an output condition.
- The checklist SHOULD ask users to identify a valid stop or continuation route.
- The checklist MAY remain local-only and non-persistent in the MVP.
