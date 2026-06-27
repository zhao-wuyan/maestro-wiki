# Product Manager Analysis

## 1. Role Mandate

Define product scope, user value, adoption path, and prioritization for the canvas Maestro command recommender.

## 2. Decision Digest

### Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Protocol is a must-have because users will ask the assistant to refresh rules from upstream. | locked | `guidance-specification.md#F-001`; grill Q2.2 |
| F-002 | Rule facts must be presented in user language while retaining source refs. | locked | `maestro-help` catalog descriptions; grill C-006 |
| F-003 | Stepwise node growth is the primary product interaction. | locked | grill Q5.1/Q5.2 |
| F-004 | The visible product promise is canvas decision-making, not a documentation sidebar. | locked | `src/styles.css:78`; `src/main.tsx:404` |
| F-005 | Favorites are a retention feature and should not be subject to cleanup. | locked | grill Q2.3 |
| F-006 | Sharing should be split into private link sharing and optional public gallery publishing. | locked | User sharing request |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-002 | Users may trust recommendations too much. | medium | Show source refs, reasons, confidence, and equal-rank groups. |
| F-004 | Canvas may become a novelty UI without learning value. | medium | Keep recommendation evidence attached to nodes. |
| F-006 | Public gallery changes the product from local learning tool to community surface. | high | Treat gallery as an explicit online capability with management and revocation controls. |

### Dependencies

| Feature | Depends On | Notes |
|---|---|---|
| F-004 | F-002, F-003 | UI depends on rules and branch state. |
| F-005 | F-003 | Saved route payload depends on canvas state shape. |
| F-006 | F-005 | Shared routes build on saved route payloads. |

### Open Questions

| Feature | Question | Impact |
|---|---|---|
| F-004 | Tree vs swimlane vs graph layout for parallel branches? | Affects visual design. |
| F-006 | Which backend stores shared route records and gallery index? | Determines release scope. |

## 3. Cross-Cutting Foundations

### Product Strategy

The MVP should make Maestro command selection understandable by combining task scenarios, source-backed rules, and progressive branch growth.

### Success Metrics

- Users can choose a scenario and understand the first command recommendation.
- Users can grow at least two branches from one node.
- Users can save a favorite route and reopen its recommendation evidence.

## 4. File Index

| File | Purpose |
|---|---|
| `analysis-F-001-rule-update-protocol.md` | Product framing for rule update protocol. |
| `analysis-F-002-command-rule-set.md` | Product framing for rules and source refs. |
| `analysis-F-003-stepwise-canvas-model.md` | Product framing for branch growth. |
| `analysis-F-004-canvas-interaction-ui.md` | Product framing for canvas UX. |
| `analysis-F-005-route-persistence.md` | Product framing for saved routes. |
| `analysis-F-006-route-sharing-gallery.md` | Product framing for share links and gallery. |
