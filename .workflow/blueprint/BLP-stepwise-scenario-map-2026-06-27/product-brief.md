---
session_id: BLP-stepwise-scenario-map-2026-06-27
status: complete
phase: P2-product-brief
---

# Product Brief: Stepwise Scenario Map

## Vision

Maestro Workflow Wiki will help users understand Maestro command chains as scenario-based journeys. Instead of presenting a one-shot command recommendation, the Stepwise Scenario Map shows the user how to choose a first command, interpret possible output conditions, and choose a next command, stopping or continuing when appropriate.

## Problem

Users currently struggle to understand how Maestro commands connect. The existing MVP explains individual workflow nodes, but it does not model scenarios, command choices, continuation routes, or source-backed command semantics.

## Target Users

- Internal validators testing whether the wiki reduces command-selection uncertainty.
- Future Maestro users learning how to choose command sequences.
- Maintainers who need a source-aligned way to explain Maestro workflow behavior.

## Goals

1. Users MUST be able to follow the unclear-requirements scenario from first command through subsequent choices.
2. Users MUST understand stop and continuation options without seeing full downstream pipeline internals.
3. The Scenario Model MUST separate workflow data from React rendering logic.
4. Command names and sequence semantics MUST align with the `maestro-flow` submodule.
5. Internal validation SHOULD confirm users can choose the next command at each scenario state.

## Scope

### In Scope

- Scenario Model and scenario slice rendering.
- Stepwise command choice interaction.
- Continuation Route Panel in the detail area.
- Upstream citation status for command facts.
- Internal Validation Checklist.

### Out of Scope

- Real `status.json` parsing.
- Full visual design system.
- Expansion of quality or knowledge pipelines beyond top-level continuation choices.
- Reuse of `maestro-flow/docs-site` as the product foundation.

## Multi-Perspective Synthesis

- Product view: the MVP is successful when users can choose command sequences, not merely identify the first command.
- UX view: the map should keep one primary path visible and place alternatives in the detail panel.
- Architecture view: data must be scenario-oriented and separated from rendering.
- Test view: automated tests should verify transitions, while internal validation checks comprehension.

## Success Criteria

- An internal tester can start from unclear requirements and choose the first command.
- The same tester can choose a subsequent command based on described output conditions.
- The tester can identify when to stop, continue to quality, or continue to knowledge capture.
- Command sequence content is source-aligned or marked pending citation.
