# Analysis: Phase 2 Local Canvas Recommender

## Executive Summary

Phase 2 should proceed. The current app is a working Phase 1 scenario map, but Phase 2 requires replacing the single authored scenario/right-panel model with a local, source-backed recommender and branch-aware canvas state. The recommended plan is incremental: rules and validation first, state model second, canvas UI third, persistence fourth, verification last.

## Dimension Scores

| Dimension | Score | Confidence | Evidence |
|---|---:|---:|---|
| Feasibility | 4/5 | 76% | `src/main.tsx:66`, `src/main.test.tsx:6`, `package.json:6` |
| Impact | 5/5 | 86% | `.workflow/roadmap.md:34`, blueprint context requirements REQ-001..REQ-005 |
| Risk | 3/5 | 64% | `src/main.tsx:306`, `src/main.tsx:404`, `src/styles.css:78` |
| Complexity | 3/5 | 70% | Rule, canvas state, UI, and persistence must change together. |
| Dependencies | 4/5 | 82% | Static/local MVP; no backend dependency for Phase 2. |
| Alternatives | N/A | 72% | Direct rewrite rejected; staged migration preferred. |

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Rule and UI state become coupled | Medium | High | Create typed helpers and tests before UI replacement. |
| SourceRef drift | Medium | Medium | Validate sourceRefs against `maestro-flow/` paths. |
| Canvas complexity overwhelms MVP | Medium | Medium | Use authored positions or simple layout first; defer auto-layout. |
| Persistence tests miss favorites cap behavior | Low | Medium | Add unit tests for recent/favorite storage helpers. |

## Recommendation

GO_WITH_CONCERNS.

Confidence is medium because required independent agent exploration failed and delegate analysis timed out. Proceed to planning, but require the plan to include explicit tests for CommandRuleSet validation, branch growth, evidence rendering, and route persistence limits.
