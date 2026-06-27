---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-002
status: accepted
---

# ADR-002: Branch-Aware Canvas State

## Decision

The canvas MUST use branch-aware state with nodes, edges, recommendation groups, and activeBranchId.

## Evidence

- REQ-003 requires multiple independently growing branches.
- `src/main.tsx:309` currently stores only `selectedNodeId` and `activeStepId`, which supports one active path.

## Consequences

The model supports multi-branch exploration, but rendering must control visual complexity with active branch focus.
