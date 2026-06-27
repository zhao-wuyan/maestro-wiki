---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: functional-requirement
id: REQ-005
---

# REQ-005: Upstream Citation Layer

## Description

The system SHOULD attach Upstream Citations to command names, sequence semantics, and scenario facts. Command facts MUST align with the `maestro-flow` submodule.

## User Story

As a maintainer, I want each command sequence to cite its source or show pending status so that the wiki remains trustworthy and updateable.

## Acceptance Criteria

- Command names and sequence semantics MUST align with `maestro-flow`.
- Scenario data SHOULD support source reference arrays.
- Non-command explanatory text MAY show pending citation status.
- Command sequence facts SHOULD NOT remain uncited after MVP validation.
