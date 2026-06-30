---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
phase: P3
updated_at: 2026-06-30T09:50:00Z
---

# Requirements Index

| ID | Title | Priority | Status | Source |
|---|---|---|---|---|
| REQ-001 | Rule Update Protocol | Must | active | brainstorm F-001 |
| REQ-002 | Command Rule Set | Must | active | brainstorm F-002 |
| ~~REQ-003~~ | ~~Stepwise Canvas Model~~ | Must | **superseded → REQ-003-v2** | brainstorm F-003 |
| REQ-003-v2 | Form-Flow Recommendation Model | Must | **active** | ADR-006 |
| ~~REQ-004~~ | ~~Canvas Interaction UI~~ | Must | **superseded → REQ-004-v2** | brainstorm F-004 |
| REQ-004-v2 | Form-Driven Recommendation UI | Must | **active** | ADR-006 |
| REQ-005 | Route Persistence | Should | active | brainstorm F-005 |
| REQ-006 | Route Sharing and Gallery | Should | active | brainstorm F-006 |
| NFR-001 | Provenance Integrity | Must | active | C-002 |
| NFR-002 | Static MVP Boundary | Must | active | non-goals |

## MoSCoW (revised 2026-06-30)

Must: REQ-001, REQ-002, **REQ-003-v2**, **REQ-004-v2**, NFR-001, NFR-002.
Should: REQ-005, REQ-006.

## Traceability

Each requirement traces to `BRN-20260628-canvas-maestro-command-recommender` and its upstream grill artifact.
REQ-003-v2 / REQ-004-v2 trace additionally to ADR-006 (form-driven shape decision).
