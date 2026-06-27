# System Architect Analysis

## 1. Role Mandate

Design the data model, update protocol, recommendation rule layer, branch state, and persistence architecture.

## 2. Decision Digest

### Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Add `docs/rule-update-protocol.md` or equivalent workflow spec before rule extraction. | locked | grill Q2.2; `maestro-flow/.codex/skills/maestro-help/catalog.json` |
| F-002 | Use typed `CommandFact`, `ScenarioType`, `WorkflowPath`, `RecommendationRule`, and `RuleSourceRef`. | locked | Current `ScenarioModel` at `src/main.tsx:66` is insufficient. |
| F-003 | Replace `activeStepId`-only state with `CanvasRouteState` containing nodes, edges, branches, and activeBranchId. | locked | Current `src/main.tsx:309` holds only one flow pointer. |
| F-004 | Keep rendering deterministic; compute layout from graph depth and branch index. | locked | Saved routes should not persist coordinates. |
| F-005 | Persist `SavedRoute[]` in localStorage with schemaVersion and ruleVersion. | locked | Grill Q2.3/Q2.4 |
| F-006 | Model shared routes separately from local saved routes with visibility and revocation fields. | locked | User sharing request |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-001 | LLM extraction drift. | high | Fixed source priority, schema validation, source hash checks. |
| F-003 | Branch graph state grows complex. | medium | Keep graph model normalized by IDs. |
| F-006 | Gallery needs backend storage and abuse controls. | high | Defer implementation until API/storage choice is made. |

### Dependencies

| Feature | Depends On | Notes |
|---|---|---|
| F-003 | F-002 | Branch recommendations need rule output. |
| F-005 | F-003 | Persistence serializes graph state. |
| F-006 | F-005 | Shared route payload derives from saved route evidence. |

### Open Questions

| Feature | Question | Impact |
|---|---|---|
| F-002 | Should generated rules live in JSON or TypeScript? | Affects validation and imports. |
| F-006 | Should sharing use an existing hosting/showcase API or a custom backend? | Determines architecture boundary. |

## 3. Cross-Cutting Foundations

### Data Model

The implementation SHOULD split rule data from canvas state:

- `CommandFact`: command identity, category, description, command source path.
- `ScenarioType`: user-facing scenario, simulated state defaults, initial rule IDs.
- `RecommendationRule`: conditions, rank signals, candidate commands, sourceRefs.
- `RecommendationGroup`: ranked or equal-rank command candidates for a node.
- `CanvasRouteState`: nodes, edges, branches, activeBranchId, selectedScenarioId.
- `SavedRoute`: schemaVersion, ruleVersion, name, createdAt, scenario, route state, recommendation evidence.
- `SharedRoute`: shareId, savedRouteSnapshot, visibility, galleryPublishedAt, revokedAt, createdAt, updatedAt.
- `EdgeNote`: edgeId, text, authorLocalId or anonymous marker, createdAt.

### State Machine

`empty canvas → scenario selected → recommendations generated → command selected → node fixed → child recommendations generated → branch selected/favorited/saved`.

## 4. File Index

| File | Purpose |
|---|---|
| `analysis-F-001-rule-update-protocol.md` | Architecture for rule update protocol. |
| `analysis-F-002-command-rule-set.md` | Rule schema architecture. |
| `analysis-F-003-stepwise-canvas-model.md` | Canvas graph state architecture. |
| `analysis-F-004-canvas-interaction-ui.md` | Rendering and layout architecture. |
| `analysis-F-005-route-persistence.md` | Browser persistence architecture. |
| `analysis-F-006-route-sharing-gallery.md` | Sharing and gallery architecture. |
