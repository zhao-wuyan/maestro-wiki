---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: epic
id: EPIC-001
---

# EPIC-001: Scenario Data Foundation

## Requirements

- REQ-001 Scenario Model
- REQ-005 Upstream Citation Layer
- NFR-MAINT-001 Source-aligned Maintainability

## Stories

### Story 1: Extract Scenario Data Types

As a maintainer, I want typed scenario data so that scenario content is not embedded in JSX.

Acceptance criteria:
- Scenario, Step, Choice, TerminalOption, and SourceRef types exist.
- Existing map content can be represented by the new model.
- Broken references can be detected in tests or validation.

Size: M

### Story 2: Create Unclear Requirements Scenario Fixture

As a user, I want the unclear-requirements scenario to have a first command and next-step options so that I can learn the sequence.

Acceptance criteria:
- Fixture includes first step, at least one follow-up command step, and terminal options.
- Fixture includes citation status for command facts.

Size: M

### Story 3: Add SourceRef Support

As a maintainer, I want source references so that command facts stay aligned with `maestro-flow`.

Acceptance criteria:
- Scenario facts can store cited or pending status.
- Command facts are not silently uncited.

Size: S
