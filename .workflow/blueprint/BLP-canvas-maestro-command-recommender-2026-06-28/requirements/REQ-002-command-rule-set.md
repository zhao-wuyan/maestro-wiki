---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
requirement_id: REQ-002
---

# REQ-002: Command Rule Set

The product MUST provide a local `CommandRuleSet` that includes command facts, scenario types, workflow paths, and recommendation rules.

## Acceptance Criteria

- Every command fact MUST cite a `maestro-flow/` source path.
- Every recommendation rule MUST include at least one sourceRef.
- Rule output MUST support ranked and equal-rank recommendation groups.
- The UI MUST consume rules without parsing upstream markdown at render time.
