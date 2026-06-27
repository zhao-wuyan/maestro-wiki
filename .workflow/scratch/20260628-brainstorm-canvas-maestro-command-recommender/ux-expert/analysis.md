# UX Expert Analysis

## 1. Role Mandate

Design the interaction model, information architecture, branch behavior, and evidence presentation for the canvas recommender.

## 2. Decision Digest

### Decisions

| Feature | Decision | Status | Evidence |
|---|---|---|---|
| F-001 | Rule update protocol should be visible only as metadata/status, not the main user flow. | locked | Users need command guidance first. |
| F-002 | Scenario labels must be user-language first, with Maestro terminology secondary. | locked | User described informal scenarios. |
| F-003 | Equal-rank recommendation groups should be displayed as peer cards inside a node. | locked | Grill Q3.1 |
| F-004 | Large persistent sidebars must be removed from the core interaction. | locked | `src/styles.css:78`; `src/main.tsx:404` |
| F-005 | Favorites need naming and evidence preview so users can recognize saved routes. | locked | Grill Q2.4 |
| F-006 | Share UI must distinguish copy-link, publish-to-gallery, unpublish, and revoke-link actions. | locked | User sharing request |

### Risks

| Feature | Risk | Severity | Mitigation |
|---|---|---|---|
| F-003 | Multi-branch graph overwhelms users. | medium | Active branch focus, compact inactive branches. |
| F-004 | Evidence popovers hide too much information. | medium | Provide clear reason snippets on cards and expandable source detail. |
| F-006 | Sharing controls can be destructive or confusing. | medium | Use clear labels: remove from gallery vs revoke link. |

### Dependencies

| Feature | Depends On | Notes |
|---|---|---|
| F-004 | F-003 | UI depends on branch graph behavior. |
| F-005 | F-004 | Saved route affordances live in canvas UI. |
| F-006 | F-005 | Share management starts from saved/shared route list. |

### Open Questions

| Feature | Question | Impact |
|---|---|---|
| F-004 | Should branch lanes be horizontal swimlanes or organic graph layout? | Affects visual complexity. |
| F-006 | Where should edge notes be authored: inline on edge, side popover, or command-node form? | Affects annotation workflow. |

## 3. Cross-Cutting Foundations

### Interaction Model

The user starts at a central initial node, selects a scenario, reviews recommendation groups, selects one or more commands, and watches branches grow to the right. Inactive branches remain visible but visually quieter.

### Evidence Presentation

Each recommendation card SHOULD show a concise reason. Source details can expand inline or in a small overlay.

## 4. File Index

| File | Purpose |
|---|---|
| `analysis-F-001-rule-update-protocol.md` | UX framing for protocol metadata. |
| `analysis-F-002-command-rule-set.md` | UX framing for scenario labels and recommendations. |
| `analysis-F-003-stepwise-canvas-model.md` | UX framing for branch behavior. |
| `analysis-F-004-canvas-interaction-ui.md` | UX framing for canvas UI. |
| `analysis-F-005-route-persistence.md` | UX framing for saved route controls. |
| `analysis-F-006-route-sharing-gallery.md` | UX framing for share and gallery controls. |
