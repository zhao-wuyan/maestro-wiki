# Roadmap: Maestro Workflow Wiki

## Overview

This roadmap preserves the completed Stepwise Scenario Map MVP and pivots the next work toward the Canvas Maestro Command Recommender blueprint. The path is progressive: first convert the current single-scenario UI into a source-backed, branch-aware local recommender with browser persistence, then add share links and a public gallery after an online storage/API decision is made.

## Milestones

### Milestone 1: Stepwise Scenario Map MVP (v0.1)
**Target**: Users can follow one unclear-requirements scenario, choose the first and next Maestro commands from state explanations, and decide whether to stop or continue into quality or knowledge routes.
**Status**: completed

**Minimum-phase principle:** One phase was sufficient because scenario data, interaction state, detail-panel routes, citation badges, and validation checks could be developed against agreed TypeScript contracts without a full runtime barrier between them.

#### Phases

- [x] **Phase 1: Scenario Map MVP** — Build the data-driven stepwise scenario flow and internal validation loop.

#### Phase Details

##### Phase 1: Scenario Map MVP
**Goal**: Deliver a data-driven Scenario Model, active Scenario Slice navigation, stepwise command choices, continuation route panel, upstream citation status, and internal validation checklist.
**Depends on**: Nothing (first phase)
**Requirements**: Previous BLP REQ-001, Previous BLP REQ-002, Previous BLP REQ-003, Previous BLP REQ-004, Previous BLP REQ-005, Previous BLP REQ-006; Project Validated: independent Vite + React site; Project Validated: MVP interactive flow diagram
**Success Criteria** (what must be TRUE):
  1. Users can select the unclear-requirements scenario and see the current recommended command, condition, and next choices.
  2. The active scenario path highlights on the SVG map while alternatives, source status, and terminal routes stay in the detail panel.
  3. Closing nodes offer stop, quality pipeline, and knowledge-capture continuation choices without expanding downstream pipeline internals.
  4. Scenario data lives outside JSX and validates broken step references plus citation coverage.
  5. Pointer and keyboard users can select scenario nodes and complete the internal validation checklist.

---

### Milestone 2: Canvas Command Recommender MVP (v0.2)
**Target**: Replace the fixed scenario/right-panel experience with a canvas-first, source-backed local Maestro command recommender that supports branch-aware route growth and local saved routes.
**Status**: active

**Minimum-phase principle:** One phase is sufficient because rule schema, local recommendation logic, canvas state, UI rendering, concept/status explanations, and browser persistence can be developed against shared TypeScript contracts. Sharing is split out because public URLs and gallery browsing require a real online storage/API boundary.

#### Phases

- [ ] **Phase 2: Local Canvas Recommender** — Build the local rule layer, branch-aware canvas, recommendation evidence, and browser route persistence.

#### Phase Details

##### Phase 2: Local Canvas Recommender
**Goal**: Deliver a canvas-based recommender with source-backed `CommandRuleSet`, explainable local recommendations, multi-branch route expansion, edge notes, concept/status explanations, and local saved routes.
**Depends on**: Phase 1
**Requirements**: BLP-canvas REQ-001, BLP-canvas REQ-002, BLP-canvas REQ-003, BLP-canvas REQ-004, BLP-canvas REQ-005, BLP-canvas NFR-001, BLP-canvas NFR-002; Project Active: core concept encyclopedia; Project Active: command scenario guide; Project Active: interactive flow extension; Project Active: status.json example anatomy; Project Active: browser-side recommendation rules engine
**Success Criteria** (what must be TRUE):
  1. Users start from a central scenario/state node and receive local, explainable Maestro command recommendations.
  2. Recommendation cards show applicability, rationale, confidence/equal-rank status, and source references into `maestro-flow/`.
  3. Users can expand multiple canvas branches independently and add notes to edges explaining route choices.
  4. The large permanent right sidebar is replaced by canvas-first interaction with lightweight contextual detail surfaces.
  5. Users can save recent routes with evidence, keep favorites uncapped, and retain only the latest 10 non-favorite routes.
  6. Concept and `status.json` explanation content remains available inside the recommender experience without modifying `maestro-flow/`.

---

### Milestone 3: Route Sharing and Gallery (v0.3)
**Target**: Add shareable route maps, opt-in public gallery publishing, and management controls after the storage/API decision is made.
**Status**: planned

**Minimum-phase principle:** One phase is sufficient once the storage/API contract exists because share serialization, publish/revoke actions, gallery listing, and route rendering all depend on the same shared route contract.

#### Phases

- [ ] **Phase 3: Share and Gallery Integration** — Implement private share links, public gallery publishing, and route management controls.

#### Phase Details

##### Phase 3: Share and Gallery Integration
**Goal**: Turn saved route maps into shareable artifacts with private links, optional public gallery visibility, and owner-side revocation/removal controls.
**Depends on**: Phase 2
**Requirements**: BLP-canvas REQ-006
**Success Criteria** (what must be TRUE):
  1. Users can generate standalone share URLs for saved route maps.
  2. Users can publish selected routes to a public gallery through explicit opt-in.
  3. Users can remove a route from the public gallery without deleting the local saved route.
  4. Users can revoke an existing private share link.
  5. Gallery visitors can browse public route cards and open read-only route maps with preserved recommendation evidence.

---

## Scope Decisions

- **In scope**: Independent Vite + React wiki app, `maestro-flow` source-backed rule protocol, local `CommandRuleSet`, explainable recommendation engine, branch-aware canvas state, canvas-first interaction, edge notes, concept/status explanations, browser route persistence, and later share/gallery flows.
- **Deferred**: Real `.workflow/state.json` parsing, LLM-backed runtime recommendation, bilingual strategy, authenticated personalization, and final sharing backend/storage choice.
- **Out of scope**: Reusing `maestro-flow/docs-site`, modifying Maestro CLI execution semantics, modifying the `maestro-flow` submodule, browser-runtime LLM calls, and public gallery without online storage/API.

## Roadmap Decisions

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Mode | Revise existing roadmap preserving completed M1 | code |
| 2 | Requirement scope | Phased MVP then sharing expansion | blueprint |
| 3 | Decomposition strategy | Progressive milestones with one phase each | default |
| 4 | Milestone boundaries | M2 local canvas recommender, M3 sharing/gallery | blueprint |
| 5 | Phase dependencies and order | Phase 2 depends on Phase 1; Phase 3 depends on Phase 2; no circular dependencies | code |
| 6 | Push before continuation | Attempted push first; blocked by GitHub private email protection GH007 | user/code |

## Requirement Mapping

| Requirement | Phase | Notes |
|---|---|---|
| Project Validated: independent Vite + React site | Phase 1 | Already shipped foundation. |
| Project Validated: MVP interactive flow diagram | Phase 1 | Already shipped interaction baseline. |
| Project Active: core concept encyclopedia | Phase 2 | Reframed as concept support inside the recommender experience. |
| Project Active: command scenario guide | Phase 2 | Reframed as source-backed command recommendations. |
| Project Active: interactive flow extension | Phase 2 | Reframed as branch-aware canvas expansion. |
| Project Active: status.json example anatomy | Phase 2 | Included as simulated state/status explanation content. |
| Project Active: browser-side recommendation rules engine | Phase 2 | Implemented through local `CommandRuleSet` and recommendation engine. |
| BLP-canvas REQ-001 Rule Update Protocol | Phase 2 | Protocol governs future rule updates. |
| BLP-canvas REQ-002 Command Rule Set | Phase 2 | Local source-backed rules. |
| BLP-canvas REQ-003 Stepwise Canvas Model | Phase 2 | Branch-aware canvas state. |
| BLP-canvas REQ-004 Canvas Interaction UI | Phase 2 | Canvas-first interaction. |
| BLP-canvas REQ-005 Route Persistence | Phase 2 | Browser local saved routes. |
| BLP-canvas REQ-006 Route Sharing and Gallery | Phase 3 | Requires online storage/API. |
| BLP-canvas NFR-001 Provenance Integrity | Phase 2 | SourceRef validation and evidence display. |
| BLP-canvas NFR-002 Static MVP Boundary | Phase 2 | Keeps MVP static/local. |

## Progress

| Milestone | Phase | Status | Completed |
|-----------|-------|--------|-----------|
| 1. Stepwise Scenario Map MVP | 1. Scenario Map MVP | Completed | 2026-06-27 |
| 2. Canvas Command Recommender MVP | 2. Local Canvas Recommender | Not started | - |
| 3. Route Sharing and Gallery | 3. Share and Gallery Integration | Not started | - |
