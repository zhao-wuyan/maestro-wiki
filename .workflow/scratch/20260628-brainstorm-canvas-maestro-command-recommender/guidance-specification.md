# Guidance Specification: Canvas Maestro Command Recommender

## 1. Project Positioning & Goals

The product MUST evolve from a fixed scenario page into a canvas-based Maestro command recommender. Users start from a central scenario node, select a task scenario, receive source-backed command recommendations, and grow one or more route branches step by step.

The recommender MUST teach users why a command is suggested, not merely display a command chain.

## 2. Concepts & Terminology

| Term | Definition | Source |
|---|---|---|
| Canvas | Main interaction surface for generated scenario and command nodes. | grill |
| Initial Node | Central start node where users choose a task scenario. | grill |
| Scenario Type | User-facing task category derived from Maestro help/workflow taxonomy. | `maestro-flow/.codex/skills/maestro-help/catalog.json` |
| Command Fact | Extracted command metadata: name, category, description, source refs, applicability. | `maestro-help` catalog |
| Recommendation Rule | Local rule mapping simulated state and scenario signals to ranked command candidates. | `maestro-next` routing/scoring |
| Saved Route | Browser-persisted route map with recommendation evidence. | grill |
| Shared Route | A route map published to a standalone URL for other people to view. | user |
| Public Gallery | A browsable public area showing route maps that users explicitly choose to publish. | user |
| Edge Note | User-authored explanation on a connection describing why a command choice was made. | user |

## 3. Non-Goals

- MVP MUST NOT read real `.workflow/state.json` from the user's filesystem.
- MVP MUST NOT call an LLM at browser runtime for recommendations.
- MVP MUST NOT require exact canvas coordinates in saved routes.
- MVP MUST NOT treat root `.claude/commands` as source of truth when `maestro-flow/` exists.
- Static-only MVP MAY defer live public sharing until a storage/API backend exists.

## 4. Product Decisions

| ID | Decision | RFC 2119 | Evidence |
|---|---|---|---|
| PM-01 | The entry interaction MUST be scenario-first, not command-search-first. | MUST | Grill R-001 |
| PM-02 | The UI MUST explain recommendation reasons and source refs at every command node. | MUST | Grill C-004/C-006 |
| PM-03 | Recent routes SHOULD keep the latest 10 non-favorite routes. | SHOULD | Grill Q3.2 |
| PM-04 | Favorites MUST be uncapped and protected from automatic cleanup. | MUST | Grill Q2.3 |
| PM-05 | Users SHOULD be able to create a standalone share URL for a route map. | SHOULD | User sharing request |
| PM-06 | Sharing MUST include an explicit "share to gallery" option separate from private link sharing. | MUST | User sharing request |
| PM-07 | Users MUST be able to manage shared content, disable gallery visibility, and revoke share links. | MUST | User sharing request |

## 5. Architecture Decisions

| ID | Decision | RFC 2119 | Evidence |
|---|---|---|---|
| SA-01 | The app MUST introduce a local `CommandRuleSet` layer consumed by React. | MUST | Current `ScenarioModel` at `src/main.tsx:66` is one authored flow. |
| SA-02 | Rule provenance MUST cite `maestro-flow/` submodule paths. | MUST | Grill C-006 |
| SA-03 | Rule updates MUST follow an LLM update protocol with source priority, schema checks, and ambiguity handling. | MUST | Grill C-002/C-003 |
| SA-04 | Canvas state MUST support multiple independently growing branches plus an active branch. | MUST | Grill C-007 |
| SA-05 | Public sharing and gallery SHOULD be modeled as an online capability requiring share records, visibility state, and revocation state. | SHOULD | User sharing request |

## 6. UX Decisions

| ID | Decision | RFC 2119 | Evidence |
|---|---|---|---|
| UX-01 | The canvas MUST expand stepwise from the current node. | MUST | Grill Q5.1 |
| UX-02 | Equal-rank recommendations MUST be shown as peer options, not forced into a fake primary command. | MUST | Grill Q3.1 |
| UX-03 | Command evidence SHOULD be visible on demand near the node, not in a large persistent right sidebar. | SHOULD | Current `detail-panel` conflict at `src/main.tsx:404`. |
| UX-04 | Parallel branches SHOULD use focus/active branch affordances to prevent visual overload. | SHOULD | Grill Risk 2 |
| UX-05 | Connections between nodes SHOULD support user-authored notes explaining why a path was chosen. | SHOULD | User sharing request |
| UX-06 | Share dialogs MUST distinguish "copy private link" from "publish to gallery". | MUST | User sharing request |

## 7. Data & Persistence Decisions

| ID | Decision | RFC 2119 | Evidence |
|---|---|---|---|
| DA-01 | Saved routes MUST store scenario choice, selected command nodes, recommendation groups, reasons, sourceRefs, name, createdAt, and schemaVersion. | MUST | Grill Q2.4 |
| DA-02 | Saved routes SHOULD omit exact coordinates in MVP and rely on deterministic layout. | SHOULD | Grill Q2.4 |
| DA-03 | Recent history MUST exclude favorite routes from cleanup. | MUST | Grill Q2.3 |
| DA-04 | Simulated project state MUST be explicit in each route node's recommendation context. | MUST | Grill Q4.1 |
| DA-05 | Shared route records MUST include shareId, route payload, visibility, createdAt, updatedAt, revokedAt, and galleryPublishedAt. | MUST | User sharing request |
| DA-06 | Edge notes SHOULD be persisted as part of saved/shared route evidence. | SHOULD | User sharing request |

## 8. Risks & Constraints

| Risk | Severity | Mitigation |
|---|---|---|
| Rule drift from `maestro-flow` | High | Add update protocol, source refs, and validation tests. |
| Canvas crowding from branches | Medium | Lazy expansion and active branch focus. |
| Simulated state misunderstood as real project state | Medium | Label simulated state and source limitations. |
| Recommendation ambiguity | Medium | Peer recommendation groups and confidence labels. |
| Public gallery introduces moderation, privacy, and abuse risks | High | Treat as post-MVP online capability with explicit publish/revoke controls. |

## 9. Cross-Role Integration

- Product and UX MUST align scenario labels with user language while preserving rule provenance.
- System architecture MUST keep recommendation logic testable outside React rendering.
- Persistence MUST be versioned because saved route evidence can outlive UI layout changes.

## 10. Feature Decomposition

| ID | Feature | Description | Priority | Related Roles | Acceptance |
|---|---|---|---|---|---|
| F-001 | Rule Update Protocol | Define the LLM-governed process for updating local rules from `maestro-flow`. | must | system-architect, product-manager | Protocol lists source priority, schema, diff, ambiguity, and validation steps. |
| F-002 | Command Rule Set | Create local command facts, scenario types, workflow paths, and recommendation rules with sourceRefs. | must | system-architect, product-manager | Rules cite `maestro-flow` and pass consistency validation. |
| F-003 | Stepwise Canvas Model | Replace fixed single-flow model with generated nodes, edges, recommendation groups, and branch-aware state. | must | system-architect, ux-expert | Multiple branches can grow independently from selected commands. |
| F-004 | Canvas Interaction UI | Redesign UI around a large canvas, initial scenario node, node-local choices, and lightweight evidence surfaces. | must | ux-expert, product-manager | No large permanent right sidebar; recommendations are selectable from nodes. |
| F-005 | Route Persistence | Persist recent routes and favorites with recommendation evidence in browser storage. | should | system-architect, ux-expert | Latest 10 recent routes retained; favorites uncapped and protected. |
| F-006 | Route Sharing and Gallery | Allow users to generate share URLs, optionally publish routes to a public gallery, manage shared items, revoke links, and hide gallery entries. | should | product-manager, system-architect, ux-expert | Share state supports private link, gallery visibility, revocation, and management actions. |

## 11. Appendix: Decision Tracking

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Mode | Auto brainstorm from grill context | user |
| 2 | Roles | product-manager, system-architect, ux-expert | default based on topic |
| 3 | Upstream | GRL-20260628-canvas-node-scenario-redesign | user |
| 4 | Runtime recommendation | Local rules, no browser LLM | grill |
| 5 | State | Simulated state for MVP | grill |
| 6 | Sharing | Add standalone share URL, optional gallery publish, edge notes, and share management | user |

## 12. Cross-Role Resolutions

| ID | Type | Source(s) | Resolution | Applied to |
|---|---|---|---|---|
| G-001 | gap | product-manager / system-architect | Route persistence schema must include `schemaVersion` and source rule version. | F-005, DA-01 |
| S-001 | synergy | system-architect / ux-expert | Equal-rank recommendation groups map directly to node-local peer option UI. | F-003, F-004 |
| G-002 | gap | user / product-manager / system-architect | Sharing requires an online capability beyond pure local persistence; keep local saved routes in MVP and define public sharing as a distinct feature with storage/API needs. | F-006, PM-05..07, SA-05, DA-05 |
