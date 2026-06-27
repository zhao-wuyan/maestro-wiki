---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
phase: P2
---

# Product Brief: Canvas Maestro Command Recommender

## Vision

Transform Maestro Workflow Wiki from a fixed explanatory scenario page into an interactive canvas that helps users choose Maestro commands step by step, understand why recommendations appear, save useful routes, and eventually share command chains with others.

## Target Users

- Developers learning which Maestro command to run next.
- Users who describe tasks in informal language and need mapping to Maestro workflow concepts.
- Teams who want to share reusable command chains and explain decision rationale.

## Goals

1. The product MUST present a central scenario-selection node and grow recommendation branches step by step.
2. Recommendations MUST be source-backed by `maestro-flow` references.
3. The UI MUST avoid the existing large right sidebar and make the canvas the primary surface.
4. The system MUST persist recent and favorite routes with recommendation evidence.
5. The product SHOULD support standalone share links and optional gallery publishing as an online capability.

## Scope

In scope: local rule update protocol, command rule set, branch-aware canvas model, canvas UI, route persistence, edge notes, share/gallery specification.

Out of scope for static MVP: reading real `.workflow/state.json`, browser runtime LLM recommendation, public gallery without online storage/API.

## Multi-Perspective Synthesis

Product value comes from understandable command choice, not visual novelty. Architecture requires a testable rule layer and versioned persistence. UX requires node-local explanations, equal-rank choices, and controlled branch complexity.
