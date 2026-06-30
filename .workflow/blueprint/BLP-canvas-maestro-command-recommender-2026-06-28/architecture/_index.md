---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
phase: P4
updated_at: 2026-06-30T09:30:00Z
---

# Architecture Index

## Components

```mermaid
graph TD
  Sources[maestro-flow sources] --> Protocol[Rule Update Protocol]
  Protocol --> RuleSet[CommandRuleSet]
  RuleSet --> Recommender[Recommendation Engine]
  Recommender --> CanvasState[Canvas Route State]
  CanvasState --> CanvasUI[Canvas UI - React Flow]
  CanvasState --> LocalStore[Browser Persistence]
  CanvasState --> ShareAPI[Future Share/Gallery API]
```

> **2026-06-30 更新**：Canvas UI 已从 SVG 自研迁移到 @xyflow/react（见 ADR-005）。

## ADRs

| ID | Title | Status | Notes |
|---|---|---|---|
| ADR-001 | Local CommandRuleSet Layer | accepted | 锚点已修订（2026-06-30） |
| ADR-002 | Branch-Aware Canvas State | accepted | 数据层有效；渲染层被 ADR-005 取代 |
| ADR-003 | Browser Persistence and Future Sharing Boundary | accepted | |
| ADR-004 | Source Provenance and LLM Update Protocol | accepted | |
| ADR-005 | React Flow 技术栈迁移 | accepted | 2026-06-30 新增 |
