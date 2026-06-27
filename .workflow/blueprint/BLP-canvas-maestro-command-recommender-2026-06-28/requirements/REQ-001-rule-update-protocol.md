---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
requirement_id: REQ-001
---

# REQ-001: Rule Update Protocol

The product MUST include a documented LLM-governed protocol for updating recommendation rules from `maestro-flow`.

## User Story

As a maintainer, I want an AI assistant to update rules from upstream sources consistently so recommendations remain accurate.

## Acceptance Criteria

- The protocol MUST define source priority.
- The protocol MUST define output schemas for command facts, scenario types, workflow paths, recommendation rules, and source refs.
- The protocol MUST require ambiguity to be recorded instead of invented.
- The protocol MUST require validation tests for sourceRefs and command existence.
