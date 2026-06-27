---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
type: architecture-decision-record
id: ADR-002
---

# ADR-002: Detail Panel for Secondary Routes

## Context

REQ-004 requires stop, quality, and knowledge continuation choices without expanding downstream pipeline internals. NFR-UX-001 requires active route clarity.

## Decision

The detail panel SHOULD host secondary alternatives, terminal routes, and source badges while the map keeps the active Scenario Slice primary.

## Alternatives

- Render all continuation branches on the map: rejected due to choice overload.
- Hide continuation routes: rejected because the user explicitly wants optional stop/continue routes.

## Consequences

- Map remains readable.
- Detail panel becomes the main interaction surface for alternatives.
- UI must preserve keyboard access for secondary actions.

## Evidence

- REQ-004, NFR-UX-001, NFR-A11Y-001.
- Cross-role review S-001 resolved that the detail panel should host secondary alternatives.
