# Cross-Role Review

## Summary

No hard cross-role conflicts detected. The five roles converge on the same MVP spine: scenario data model, one active scenario slice, stepwise command choice, secondary continuation routes, upstream citation awareness, and internal validation.

## Findings

| ID | Type | Source(s) | Finding | Resolution | Patch Targets |
|---|---|---|---|---|---|
| G-001 | gap | product-manager, system-architect, test-strategist | Upstream citations are required for trust, but missing citations should not block MVP delivery. | Add `citationStatus` handling and allow pending labels for non-command explanatory text; command names and sequence semantics still require source alignment. | `guidance-specification.md` §12 |
| G-002 | gap | product-manager, ux-expert, test-strategist | Validation must test stepwise command selection, not general satisfaction. | Validation checklist should use scenario prompts that ask users to choose first and subsequent commands. | `guidance-specification.md` §12 |
| S-001 | synergy | ux-expert, ui-designer, system-architect | Detail panel can host secondary choices, terminal options, and citations without cluttering the map. | Treat detail panel as the primary container for alternatives, terminal routes, and source badges. | `guidance-specification.md` §12 |

## Patch Targets

All findings are applied as guidance-level resolutions. No role file patches required because role analyses already align and no superseded statements were found.
