---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
phase: P6
updated_at: 2026-06-30T09:50:00Z
---

# Blueprint Summary

> **2026-06-30 修订**：原 "canvas-centered" 形态已作废（ADR-006），回归表单驱动形态。

The **Form-Driven Maestro Command Recommender** is a feature-set redesign of Maestro Workflow Wiki. It provides a simple input → action → result form flow backed by a local, source-cited rule engine, so users can describe their task in plain language and get clear ranked Maestro command recommendations.

MVP should prioritize the local rule foundation, the form-driven recommendation UI, and browser persistence (REQ-005). Canvas/node-graph interaction is out of scope; @xyflow/react is retained for future read-only visualization pages (运行流程 / 命令地图) but not for the recommendation experience.

Readiness: 88% — Pass (revised for v0.2 stack + form-driven shape).
