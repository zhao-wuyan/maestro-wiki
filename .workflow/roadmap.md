# Roadmap: Maestro Workflow Wiki

## Overview

This roadmap turns the current interactive Maestro Workflow Wiki prototype into a scenario-driven command-selection guide. It uses a progressive strategy: first ship the Stepwise Scenario Map MVP from the blueprint, then expand the same foundation into broader Maestro encyclopedia content, status.json explanation, and browser-side recommendation rules.

## Milestones

### Milestone 1: Stepwise Scenario Map MVP (v0.1)
**Target**: Users can follow one unclear-requirements scenario, choose the first and next Maestro commands from state explanations, and decide whether to stop or continue into quality or knowledge routes.
**Status**: active

**Minimum-phase principle:** One phase is sufficient because scenario data, interaction state, detail-panel routes, citation badges, and validation checks can be developed against agreed TypeScript contracts without a full runtime barrier between them.

#### Phases

- [ ] **Phase 1: Scenario Map MVP** — Build the data-driven stepwise scenario flow and internal validation loop.

#### Phase Details

##### Phase 1: Scenario Map MVP
**Goal**: Deliver a data-driven Scenario Model, active Scenario Slice navigation, stepwise command choices, continuation route panel, upstream citation status, and internal validation checklist.
**Depends on**: Nothing (first phase)
**Requirements**: BLP REQ-001, BLP REQ-002, BLP REQ-003, BLP REQ-004, BLP REQ-005, BLP REQ-006; Project Active: command scenario guide, interactive flow extension
**Success Criteria** (what must be TRUE):
  1. Users can select the unclear-requirements scenario and see the current recommended command, condition, and next choices.
  2. The active scenario path highlights on the SVG map while alternatives, source status, and terminal routes stay in the detail panel.
  3. Closing nodes offer stop, quality pipeline, and knowledge-capture continuation choices without expanding downstream pipeline internals.
  4. Scenario data lives outside JSX and validates broken step references plus citation coverage.
  5. Pointer and keyboard users can select scenario nodes and complete the internal validation checklist.

---

### Milestone 2: Workflow Knowledge Expansion (v0.2)
**Target**: The wiki expands from one scenario into a broader Maestro learning surface covering core concepts, command selection rules, status.json anatomy, and browser-side recommendation logic.
**Status**: planned

**Minimum-phase principle:** One phase is sufficient because content expansion, additional diagram nodes, status examples, and browser rules share the v0.1 data and UI contracts and can be sequenced inside the phase plan.

#### Phases

- [ ] **Phase 2: Knowledge and Recommendation Expansion** — Add broader Maestro concepts, workflow topology coverage, status examples, and first browser-side recommendation rules.

#### Phase Details

##### Phase 2: Knowledge and Recommendation Expansion
**Goal**: Complete the first broader wiki layer by extending content coverage, graph topology, status.json explanations, and local recommendation rules using the validated Scenario Model foundation.
**Depends on**: Phase 1
**Requirements**: Project Active: core concept encyclopedia, command scenario guide, interactive flow extension, status.json example anatomy, browser-side recommendation rules engine
**Success Criteria** (what must be TRUE):
  1. Users can read clear explanations for intent classification, chain selection, session creation, Ralph execution, decision nodes, quality pipeline, and knowledge system.
  2. The interactive diagram covers S_PARSE, S_CLASSIFY, S_DECOMPOSE, S_CREATE, S_DISPATCH, and maestro-ralph-execute handoff relationships.
  3. Users can inspect a status.json example and understand steps[], classification_rationale, task_decomposition, and completion_confirmed.
  4. The browser-side rule engine can recommend candidate commands with applicability boundaries and reasons for supported task scenarios.
  5. Content and recommendation facts remain aligned with the maestro-flow submodule source references.

---

## Scope Decisions

- **In scope**: Independent Vite + React wiki app, data-driven Scenario Model, active scenario path highlighting, stepwise command-choice UI, source citation status, local validation checklist, broader Maestro concept content, status.json examples, and browser-side recommendation rules.
- **Deferred**: Bilingual strategy, LLM-backed recommendation, shareable custom chains, logged-in personalization, and real status.json parsing.
- **Out of scope**: Reusing maestro-flow/docs-site, modifying Maestro CLI execution semantics, adding a backend service for MVP, login, multi-tenant features, and personal history.

## Roadmap Decisions

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Mode | Create | default |
| 2 | Requirement scope | Phased MVP then expansion | user |
| 3 | Decomposition strategy | Progressive | default |
| 4 | Milestone boundaries | Stepwise Scenario Map MVP, then Workflow Knowledge Expansion | user |
| 5 | Phase dependencies and order | Phase 2 depends on Phase 1; no circular dependencies | code |

## Requirement Mapping

| Requirement | Phase | Notes |
|---|---|---|
| BLP REQ-001 Scenario Model | Phase 1 | Data foundation for scenario slices and choices. |
| BLP REQ-002 Scenario Slice Navigation | Phase 1 | Active path and focused navigation. |
| BLP REQ-003 Stepwise Command Choice | Phase 1 | Command, condition, and next-choice flow. |
| BLP REQ-004 Continuation Route Panel | Phase 1 | Stop, quality, and knowledge routes. |
| BLP REQ-005 Upstream Citation Layer | Phase 1 | Citation status foundation. |
| BLP REQ-006 Validation Checklist | Phase 1 | Internal comprehension validation. |
| Project Active: core concept encyclopedia | Phase 2 | Broader knowledge layer. |
| Project Active: command scenario guide | Phase 1 | MVP scenario guide foundation. |
| Project Active: interactive flow extension | Phase 1 | MVP expands current map around scenario flow. |
| Project Active: status.json example anatomy | Phase 2 | Status explanation layer. |
| Project Active: browser-side recommendation rules engine | Phase 2 | Built after Scenario Model foundation. |

## Progress

| Milestone | Phase | Status | Completed |
|-----------|-------|--------|-----------|
| 1. Stepwise Scenario Map MVP | 1. Scenario Map MVP | Not started | - |
| 2. Workflow Knowledge Expansion | 2. Knowledge and Recommendation Expansion | Not started | - |
