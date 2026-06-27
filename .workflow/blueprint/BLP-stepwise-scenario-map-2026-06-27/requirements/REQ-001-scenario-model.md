---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: functional-requirement
id: REQ-001
---

# REQ-001: Scenario Model

## Description

The system MUST define a Scenario Model that separates scenario data from React rendering logic. The model MUST represent scenario slices, steps, choices, terminal options, transitions, and source citations.

## User Story

As a maintainer, I want scenario data represented independently from UI rendering so that new command scenarios can be added without rewriting component logic.

## Acceptance Criteria

- The Scenario Model MUST include scenario ID, title, nodes, edges, steps, choices, terminal options, and source references.
- A scenario MUST express the unclear-requirements path without hardcoding transition logic in JSX.
- Each choice MUST reference an existing step, terminal option, or cross-scenario transition.
- Missing source citations SHOULD be representable through `citationStatus`.
