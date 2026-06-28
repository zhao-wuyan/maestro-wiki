# Discussion: Phase 2 Local Canvas Recommender

## Table of Contents

- [Session Metadata](#session-metadata)
- [User Intent](#user-intent)
- [Current Understanding](#current-understanding)
- [Round 1](#round-1-codebase-and-blueprint-alignment)
- [Intent Coverage](#intent-coverage)
- [Confidence](#confidence)
- [Pressure Test](#pressure-test)
- [Conclusions](#conclusions)

## Session Metadata

| Field | Value |
|---|---|
| Artifact | ANL-002 |
| Scope | phase |
| Phase | 2 — Local Canvas Recommender |
| Milestone | M2-canvas-command-recommender-mvp |
| Mode | auto |
| Warnings | W001 cli-explore-agent failed; W002 delegate timed out |

## User Intent

Run `-y` Ralph continuation against the current roadmap. The inferred target is Phase 2 MVP: build the local canvas recommender while preserving out-of-scope sharing/gallery and backend boundaries.

## Current Understanding

Phase 2 is feasible as an incremental replacement of the current Phase 1 scenario map. The safest sequence is rule/data contracts first, branch-aware route state second, canvas UI third, local persistence fourth, and tests/build verification last.

## Round 1: Codebase and Blueprint Alignment

### Sources Used

- `.workflow/roadmap.md`
- `.workflow/blueprint/BLP-canvas-maestro-command-recommender-2026-06-28/context-package.json`
- `src/main.tsx`
- `src/styles.css`
- `src/main.test.tsx`

### Findings

- `src/main.tsx:66` defines `ScenarioModel`; Phase 2 needs a new `CommandRuleSet` and route-state model rather than stretching this type.
- `src/main.tsx:306` uses `activeStepId` and `selectedNodeId`; this only supports one active path.
- `src/main.tsx:404` and `src/styles.css:78` show a permanent right detail panel; this conflicts with the roadmap's canvas-first target.
- `src/main.tsx:273` and `src/main.tsx:292` provide validation patterns that can be reused for rule/sourceRef validation.
- `src/main.test.tsx:6` proves an existing test harness, but it needs Phase 2 cases for rules, branch growth, route save limits, and evidence display.

### Decision Records

> **Decision**: Build Phase 2 around typed local rule/state contracts before visual replacement.
> - **Context**: Current implementation is single-file and single-path.
> - **Options considered**: Direct UI rewrite; rule-first migration.
> - **Chosen**: Rule-first migration — **Reason**: lowers regression risk and makes tests meaningful.
> - **Rejected**: Direct UI rewrite because branch and persistence behavior would be hard to validate.
> - **Evidence Source**: exploration-codebase.json anchors — LOW CONFIDENCE due cli-explore-agent failure, supported by manual code anchors.
> - **Impact**: Planner should sequence implementation by contracts, engine, canvas, persistence, tests.

## Intent Coverage

| # | Original Intent | Status | Where Addressed | Notes |
|---|---|---|---|
| 1 | Execute current roadmap with `-y` | addressed | Session Metadata | Target inferred as Phase 2. |
| 2 | Start from correct lifecycle state | addressed | Current Understanding | Phase 2 has no analyze/plan/execute artifacts, so analyze is correct. |
| 3 | Preserve out-of-scope boundaries | addressed | Findings, Conclusions | Sharing/backend/real parsing remain deferred. |

## Confidence

| Dimension | Confidence | Notes |
|---|---:|---|
| Feasibility | 76% | Existing React/SVG app and tests support incremental change. |
| Impact | 86% | Directly matches the new product direction. |
| Risk | 64% | State model and UI replacement are coupled; delegate evidence is missing. |
| Complexity | 70% | Single app area, but data/state/UI/persistence all change together. |
| Dependencies | 82% | No backend required; source files are local. |
| Alternatives | 72% | Direct rewrite vs staged migration considered. |

Overall confidence: 75% (medium). Evidence concern accepted in auto mode due W001/W002.

## Pressure Test

Highest-confidence finding: rule-first migration is safer.

- Evidence demand: Current code has validation helpers and typed scenario data, but no recommender state. This supports extracting contracts first.
- Assumption probe: If UI is rewritten first, tests may assert visuals without validating rule provenance.
- Boundary check: Rule-first must not become real `.workflow/state.json` parsing; simulated state remains enough.
- Root cause: Phase 2's risk is not missing UI widgets; it is missing data contracts for explainable recommendations.

## Conclusions

Recommendation: GO with concerns.

Concerns: cli-explore-agent failed and delegate timed out, so independent evidence is incomplete. The analysis still has enough roadmap, blueprint, and code-anchor support to proceed to planning with explicit caution.
