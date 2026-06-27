---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-003
status: accepted
---

# ADR-003: Browser Persistence and Future Sharing Boundary

## Decision

Route persistence SHOULD use browser storage for recent/favorite routes. Public sharing and gallery SHOULD be modeled as future online capability requiring storage/API.

## Evidence

- REQ-005 requires local persistence with recommendation evidence.
- REQ-006 requires standalone URLs and public gallery management, which cannot be satisfied by localStorage alone.

## Consequences

MVP can implement local saved routes without blocking on backend. Sharing can be specified and staged as a later integration.
