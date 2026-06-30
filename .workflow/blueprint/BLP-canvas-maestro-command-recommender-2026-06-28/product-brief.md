---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
phase: P2
updated_at: 2026-06-30T09:50:00Z
decision_ref: ADR-006
---

# Product Brief: Form-Driven Maestro Command Recommender

> **2026-06-30 修订**：原 "Canvas Maestro Command Recommender" 已重命名为 "Form-Driven Maestro Command Recommender"（ADR-006）。

## Vision

Transform Maestro Workflow Wiki from a fixed explanatory scenario page into a **simple form-driven tool** that helps users choose Maestro commands by describing their task, understanding why recommendations appear, saving useful routes, and eventually sharing command chains with others.

## Target Users

- Developers learning which Maestro command to run next.
- Users who describe tasks in informal language and need mapping to Maestro workflow concepts.
- Teams who want to share reusable command chains and explain decision rationale.

## Goals (revised)

1. The product MUST present a clear form (textarea + scenario cards + flags) and run a rule engine on submit.
2. Recommendations MUST be source-backed by `maestro-flow` references.
3. The UI MUST be a single-column form layout (no canvas, no sidebar) for the recommendation experience.
4. The system SHOULD persist recent and favorite routes with recommendation evidence.
5. The product MAY support standalone share links and optional gallery publishing as an online capability (deferred to Phase 3).

## Scope (revised)

In scope: local rule update protocol, command rule set, form-flow recommendation model, form-driven UI, route persistence, inline rationale.

Out of scope for static MVP: canvas / node-graph interaction, reading real `.workflow/state.json`, browser runtime LLM recommendation, public gallery without online storage/API.

## Multi-Perspective Synthesis

Product value comes from understandable command choice, not visual novelty. Architecture requires a testable rule layer and versioned persistence. UX requires clear input → action → result flow, peer-option display for equal-rank recommendations, and inline rationale.
