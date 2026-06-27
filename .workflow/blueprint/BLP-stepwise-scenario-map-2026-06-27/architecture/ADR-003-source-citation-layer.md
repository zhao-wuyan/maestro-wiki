---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: architecture-decision-record
id: ADR-003
---

# ADR-003: Source Citation Layer

## Context

REQ-005 and NFR-MAINT-001 require command facts to align with `maestro-flow`. The MVP may use hand-authored scenario data, so drift is a known risk.

## Decision

Scenario facts SHOULD support `SourceRef` entries and `citationStatus` values. Command names and sequence semantics MUST align with `maestro-flow`; explanatory text MAY be pending citation.

## Alternatives

- Require every citation before MVP: rejected as too slow for internal validation.
- Omit citations entirely: rejected because command-chain trust is a core requirement.

## Consequences

- MVP can progress while surfacing source gaps.
- Command-sequence facts remain auditable.
- Future extraction can populate `SourceRef` automatically.

## Evidence

- REQ-005, NFR-MAINT-001.
- Cross-role review G-001.
