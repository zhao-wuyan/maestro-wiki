---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
requirement_id: REQ-005
---

# REQ-005: Route Persistence

The product SHOULD persist recent and favorite routes in browser storage with recommendation evidence.

## Acceptance Criteria

- Recent non-favorite routes SHOULD keep the latest 10 entries.
- Favorite routes MUST be uncapped and protected from automatic cleanup.
- Saved routes MUST include schemaVersion and ruleVersion.
- Saved routes MUST include scenario, command nodes, recommendation evidence, and sourceRefs.
