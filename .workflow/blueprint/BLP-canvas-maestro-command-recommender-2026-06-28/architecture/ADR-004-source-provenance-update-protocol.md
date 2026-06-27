---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-004
status: accepted
---

# ADR-004: Source Provenance and LLM Update Protocol

## Decision

Recommendation rules MUST cite `maestro-flow/` sources and MUST be maintained through a documented LLM update protocol.

## Evidence

- REQ-001 requires source priority, schema, ambiguity, and validation steps.
- NFR-001 requires sourceRef validation.
- User explicitly identified `maestro-flow` submodule as the reliable source.

## Consequences

Rules remain explainable and auditable. Upstream changes can be handled without browser runtime parsing.
