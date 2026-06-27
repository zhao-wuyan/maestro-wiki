# Discussion: Phase 1 Scenario Map MVP

## Session Metadata

| Field | Value |
|---|---|
| Session ID | ANL-P1-scenario-map-mvp-2026-06-27 |
| Scope | phase |
| Phase | 1 — Scenario Map MVP |
| Milestone | M1-stepwise-scenario-map-mvp |
| Depth | Standard |
| Dimensions | Feasibility, Impact, Risk, Complexity, Dependencies, Alternatives |

## Table of Contents

- [User Intent](#user-intent)
- [Current Understanding](#current-understanding)
- [Interview Decisions](#interview-decisions)
- [Round 1: Exploration Findings](#round-1-exploration-findings)
- [Intent Coverage](#intent-coverage)
- [Confidence Tracking](#confidence-tracking)
- [Round 2: Citation Source Deep Dive](#round-2-citation-source-deep-dive)
- [Pressure Pass](#pressure-pass)

## User Intent

Analyze Phase 1 from `.workflow/roadmap.md`: deliver the Stepwise Scenario Map MVP using the blueprint context and existing codebase.

## Current Understanding

Phase 1 is feasible as a focused React/SVG refactor: extract scenario data, replace single selected node state with local scenario/step state, keep the map focused on the active path, and move choices/routes/citations/validation into the detail panel.

## Interview Decisions

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Scope | Phase 1 micro analysis | user input |
| 2 | Depth | Standard | default |
| 3 | Dimensions | All 6 dimensions | default |
| 4 | Go/No-Go threshold | GO if overall confidence >= 80% and no unresolved blocking risk | default |

## Round 1: Exploration Findings

### Sources Used

- `exploration-codebase.json` from cli-explore-agent style code exploration.
- `explorations.json` from independent CLI analysis.
- `.workflow/roadmap.md` and blueprint context package.

### Key Findings

- The current graph is concentrated in `src/main.tsx`, with `FlowNode`, `nodes`, `edges`, `selectedId`, SVG rendering, and detail panel in one file.
- Existing click and keyboard handling provide a useful accessibility foundation for node selection.
- Phase 1 can stay within React local state; no global store, backend, or graph library is needed for MVP.
- The main implementation seam is a typed scenario data module plus current step state and detail-panel choice rendering.
- The open implementation concern is source citation selection for the first command sequence.

### Technical Solutions

> **Solution**: Typed scenario data module plus local step state
> - **Status**: Validated
> - **Problem**: Static graph cannot express steps, choices, terminal routes, or citations.
> - **Rationale**: Meets blueprint constraints with minimal app changes.
> - **Alternatives**: Single-file hardcoding rejected; graph library deferred.
> - **Evidence**: `src/main.tsx:18`, `src/main.tsx:103`, `src/main.tsx:174`
> - **Next Action**: Plan implementation tasks for Phase 1.

### Open Questions

- Which `maestro-flow` files should be treated as authoritative source references for the first scenario commands?
- Should validation checklist success be purely informational or require all checklist items to pass before MVP is considered complete?

## Intent Coverage

| # | Original Intent | Status | Where Addressed | Notes |
|---|---|---|---|
| 1 | Analyze Phase 1 roadmap scope | ✅ Addressed | Round 1 findings | Phase 1 scope mapped to current code seams. |
| 2 | Produce plan-ready context | 🔄 In progress | Pending context.md | Decision extraction still pending. |
| 3 | Use evidence-backed exploration | ✅ Addressed | exploration-codebase.json, explorations.json | Agent and independent CLI evidence captured. |

## Confidence Tracking

| Dimension | Baseline Confidence | Factors |
|---|---:|---|
| Feasibility | 88% | Strong code anchors and low technology risk. |
| Impact | 84% | Directly serves Phase 1 user journey. |
| Risk | 76% | Citation source and validation threshold remain open. |
| Complexity | 82% | Mostly local refactor; no backend. |
| Dependencies | 80% | Depends on source references and existing React/Vite app. |
| Alternatives | 86% | Graph library and single-file alternatives evaluated. |

Overall confidence: 83%.

## Round 2: Citation Source Deep Dive

### User Feedback

The user chose to continue deeper on the weakest Risk dimension, then selected Citation Source as the focus.

### New Evidence

- Authoritative command definitions are available in `maestro-flow/.claude/commands/*.md`, including command purpose, pipeline, flags, and gates.
- Codex-specific command mirrors are available in `maestro-flow/.codex/skills/*/SKILL.md` and should be checked when behavior differs by platform.
- Scenario-level routing evidence is available in `maestro-flow/guide/maestro-coordinator-guide.md`, especially the chain selection and unified executor descriptions.
- Ralph/status semantics are available in `maestro-flow/guide/maestro-ralph-guide.md` and `maestro-flow/.claude/commands/maestro-ralph-execute.md`.

### Citation Policy Decision

> **Decision**: First scenario command facts should cite command definitions first, then guide documents for flow semantics, with Codex skill files used for platform-specific confirmation.
> - **Context**: REQ-005 requires upstream alignment, and Round 1 left exact citation source open.
> - **Options considered**: command definitions only; guide documents only; command definitions plus guide documents plus platform mirrors.
> - **Chosen**: command definitions plus guide documents plus platform mirrors — **Reason**: command files are authoritative for individual commands, guides explain routing/sequence semantics, and Codex mirrors catch environment differences.
> - **Rejected**: catalog-only citation because it is an index, not behavioral authority.
> - **Evidence Source**: cli-explore-agent — Round 2 citation source exploration.
> - **Impact**: REQ-005 can move from high-risk pending to medium-risk implementation detail.

### Round 2 Confidence Re-score

Confidence: 83% → 87% (+4%). Risk improved from 76% to 82% because authoritative citation sources are now identified.

## Pressure Pass

### Highest-Confidence Finding Tested

Finding: The MVP should use a typed scenario data module plus local step state rather than a graph library or single-file hardcoded data.

### Pressure Ladder

- **Evidence demand**: Code anchors show current data/state/rendering are centralized in `src/main.tsx:18`, `src/main.tsx:93`, `src/main.tsx:103`, and `src/main.tsx:174`; roadmap and blueprint require data-driven scenario model.
- **Assumption probe**: If the first scenario were the only planned scenario, single-file hardcoding would be faster. However Phase 2 reuses the foundation, so hardcoding would create immediate rework.
- **Boundary/tradeoff**: A graph library may help later, but current SVG already supports pointer and keyboard node selection, so adding a library increases risk without solving Phase 1 acceptance gaps.
- **Root cause check**: The actual gap is not layout rendering; it is missing scenario semantics, step transitions, terminal routes, and citations.

Pressure pass result: validated. The recommendation survives because it addresses the root semantic gap while keeping implementation minimal.

## Round 2 Intent Coverage Check

| # | Original Intent | Status | Where Addressed | Notes |
|---|---|---|---|
| 1 | Analyze Phase 1 roadmap scope | ✅ Addressed | Round 1, Round 2 | Feasibility and citation risks covered. |
| 2 | Produce plan-ready context | 🔄 In progress | Pending context.md | Ready for decision extraction. |
| 3 | Use evidence-backed exploration | ✅ Addressed | exploration-codebase.json, explorations.json, Round 2 citation exploration | Evidence sources are agent/CLI-sourced. |

## Readiness Gate

- No unresolved missed intent items.
- All dimensions are above 40% confidence.
- Pressure pass completed.
- Overall confidence is 87%, above the 80% threshold.
- Residual risks are non-blocking: validation threshold and ADR-001 document cleanup.
