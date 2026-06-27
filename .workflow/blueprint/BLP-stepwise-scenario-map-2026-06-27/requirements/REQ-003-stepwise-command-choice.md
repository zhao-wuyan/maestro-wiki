---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: functional-requirement
id: REQ-003
---

# REQ-003: Stepwise Command Choice

## Description

The system MUST guide users through command choices step by step. Each step MUST show the current command, why it is relevant, possible output conditions, and next available choices.

## User Story

As a user with unclear requirements, I want to choose commands based on the previous command's output conditions so that I can continue until I decide to stop or proceed to another workflow.

## Acceptance Criteria

- The first unclear-requirements step MUST identify the recommended starting command.
- Each command step MUST show at least one output condition and one next choice.
- The recommended next choice SHOULD be visually primary.
- The UI MUST avoid implying that it executes commands or reads live command output.
