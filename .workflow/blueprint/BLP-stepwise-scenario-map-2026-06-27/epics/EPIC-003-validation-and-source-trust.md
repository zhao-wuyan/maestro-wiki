---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: epic
id: EPIC-003
---

# EPIC-003: Validation and Source Trust

## Requirements

- REQ-005 Upstream Citation Layer
- REQ-006 Validation Checklist
- NFR-MAINT-001 Source-aligned Maintainability

## Stories

### Story 1: Display Source Citation Status

As a maintainer, I want source badges so that users know which command facts are aligned or pending.

Acceptance criteria:
- Command facts show cited or pending status.
- Citation UI does not distract from primary command choice.

Size: S

### Story 2: Add Internal Validation Checklist

As an internal validator, I want to test whether I can choose command sequences so that we know the map works.

Acceptance criteria:
- Checklist asks for first command, next command, and stop/continue choice.
- Checklist is local-only and non-persistent.

Size: M

### Story 3: Add Scenario Fixture Validation

As a maintainer, I want scenario fixture checks so that broken step references do not ship.

Acceptance criteria:
- Fixture validation detects missing step targets.
- Fixture validation reports citation coverage.

Size: M
