---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: functional-requirement
id: REQ-004
---

# REQ-004: Continuation Route Panel

## Description

The system MUST present Continuation Routes as secondary actions in the detail panel at closing nodes. The MVP MUST show stop, quality pipeline, and knowledge-capture routes without expanding downstream pipeline internals.

## User Story

As a user reaching a closing node, I want to see valid options for stopping or continuing so that I can decide whether my scenario goal is satisfied.

## Acceptance Criteria

- Closing nodes MUST show at least stop and continuation route options.
- Continuation routes SHOULD be grouped as stop, quality, and knowledge capture.
- The map SHOULD NOT expand full downstream pipeline internals in the MVP.
- Continuation choices MUST be keyboard reachable.
