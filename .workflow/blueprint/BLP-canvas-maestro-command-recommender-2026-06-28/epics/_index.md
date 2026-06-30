---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
phase: P5
updated_at: 2026-06-30T09:50:00Z
---

# Epics Index

| Epic | Title | MVP | Notes |
|---|---|---|---|
| EPIC-001 | Rule Foundation | yes | 不变 |
| EPIC-002 | ~~Canvas Interaction~~ Form Interaction | yes | 2026-06-30 重写（ADR-006） |
| EPIC-003 | Route Persistence | yes | 不变 |
| EPIC-004 | Sharing and Gallery | no | 不变 |

## Dependency Map

```mermaid
graph TD
  E1[EPIC-001 Rule Foundation] --> E2[EPIC-002 Form Interaction]
  E2 --> E3[EPIC-003 Route Persistence]
  E3 --> E4[EPIC-004 Sharing and Gallery]
```
