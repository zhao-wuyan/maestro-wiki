# Analysis: Phase 1 Scenario Map MVP

## Executive Summary

Recommendation: GO. Phase 1 is feasible with a focused React/SVG refactor that extracts a typed Scenario Model, adds local step state, derives active path rendering, and expands the detail panel with choices, routes, citations, and local validation.

Overall confidence: 87%.

## Six-Dimension Scoring

| Dimension | Score | Confidence | Evidence |
|---|---:|---:|---|
| Feasibility | 5/5 | 90% | Existing Vite/React app and SVG interaction seams in `src/main.tsx:18`, `src/main.tsx:103`, `src/main.tsx:174`; independent CLI analysis rates feasibility high. |
| Impact | 5/5 | 86% | Directly satisfies Phase 1 success criteria in `.workflow/roadmap.md:21` and blueprint REQ-001 through REQ-006. |
| Risk | 4/5 | 82% | Citation source risk reduced by Round 2; residual risks are validation threshold and ADR-001 document cleanup. |
| Complexity | 4/5 | 84% | Mostly local frontend refactor; no backend, persistence, graph library, or global store required. |
| Dependencies | 4/5 | 84% | Depends on existing React/Vite app and `maestro-flow` source references; no external runtime dependency required. |
| Alternatives | N/A | 88% | Single-file hardcoding rejected; graph library deferred; pure frontend schema plus React/SVG renderer recommended. |

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Scenario schema overfits first scenario | Medium | High | Define generic Scenario/Step/Choice/TerminalOption/SourceRef types before fixture content. |
| Users mistake output conditions for live execution | Medium | High | Use teaching language and avoid run/execute wording in choice UI. |
| Citation drift from upstream Maestro Flow | Medium | Medium | Store sourceRefs/citationStatus and cite command definitions first, guide docs second, Codex mirrors for platform differences. |
| No automated test framework exists | Medium | Medium | Use `npm run build` plus local validation for MVP; add lightweight tests only if transition helpers become non-trivial. |
| ADR-001 document pollution confuses implementation | Low | Medium | Treat blueprint summary and ADR-002 as source of truth; optionally clean ADR-001 before planning. |

## Confidence Summary

| Factor | Score | Notes |
|---|---:|---|
| Findings depth | 90% | Code exploration traced data, rendering, state, style, and workflow artifact seams. |
| Evidence strength | 88% | Evidence includes cli-explore-agent output and independent CLI analysis. |
| Coverage breadth | 86% | Covers architecture, UX, source alignment, validation, and testing implications. |
| User validation | 85% | User selected deeper citation-source analysis before synthesis. |
| Consistency | 86% | Blueprint, roadmap, and code evidence converge on minimal data-driven React/SVG implementation. |

## Alternatives

1. Keep single-file hardcoded graph: rejected because it fails data-driven scenario and stepwise choice requirements.
2. Add React Flow or another graph library: deferred because MVP layout and interaction needs are already supported by native SVG.
3. Implement pure frontend scenario schema with React/SVG renderer: recommended because it is the smallest approach satisfying Phase 1.

## Go/No-Go

GO with medium residual concerns. The implementation should start with schema and state transitions, not visual redesign. Source references should cite `maestro-flow/.claude/commands/*.md` first, `guide/*.md` for sequence semantics, and `.codex/skills/*/SKILL.md` for platform-specific confirmation.
