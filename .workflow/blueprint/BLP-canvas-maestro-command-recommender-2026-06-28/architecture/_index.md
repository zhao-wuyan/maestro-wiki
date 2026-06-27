---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
phase: P4
---

# Architecture Index

## Components

```mermaid
graph TD
  Sources[maestro-flow sources] --> Protocol[Rule Update Protocol]
  Protocol --> RuleSet[CommandRuleSet]
  RuleSet --> Recommender[Recommendation Engine]
  Recommender --> CanvasState[Canvas Route State]
  CanvasState --> CanvasUI[Canvas UI]
  CanvasState --> LocalStore[Browser Persistence]
  CanvasState --> ShareAPI[Future Share/Gallery API]
```

## ADRs

| ID | Title | Status |
|---|---|---|
| ADR-001 | Local CommandRuleSet Layer | accepted |
| ADR-002 | Branch-Aware Canvas State | accepted |
| ADR-003 | Browser Persistence and Future Sharing Boundary | accepted |
| ADR-004 | Source Provenance and LLM Update Protocol | accepted |
