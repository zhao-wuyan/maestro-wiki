---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: epic
id: EPIC-002
---

# EPIC-002: Stepwise Scenario Interaction

## Requirements

- REQ-002 Scenario Slice Navigation
- REQ-003 Stepwise Command Choice
- REQ-004 Continuation Route Panel
- NFR-UX-001 Comprehension-first Interaction
- NFR-A11Y-001 Keyboard Accessible Workflow Map

## Stories

### Story 1: Render Active Scenario Slice

As a learner, I want to see one active scenario path so that the map stays understandable.

Acceptance criteria:
- Active Scenario Slice is highlighted.
- Current scenario and step are visible.
- Inactive scenarios do not clutter the map.

Size: M

### Story 2: Choose Next Command from Output Conditions

As a learner, I want output conditions and next choices so that I can continue the command sequence.

Acceptance criteria:
- Detail panel shows current command, condition, and next choices.
- Recommended next choice is visually primary.
- Choice selection advances to the target step or terminal option.

Size: L

### Story 3: Show Continuation Routes at Closing Nodes

As a learner, I want stop and continuation choices so that I can decide whether to end or continue.

Acceptance criteria:
- Closing node shows stop, quality, and knowledge route options.
- Routes are keyboard reachable.
- Downstream pipeline internals are not expanded in MVP.

Size: M
