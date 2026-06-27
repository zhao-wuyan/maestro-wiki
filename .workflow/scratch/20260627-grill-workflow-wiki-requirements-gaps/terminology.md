# Terminology

| Term | Definition | Code Reference | Status |
|------|------------|----------------|--------|
| Scenario Path Selector | User-facing control for choosing a usage scenario, which activates a recommended command path. | `src/main.tsx:102` currently missing dedicated scenario state | open |
| Path Highlighting | Visual emphasis for the active route through workflow nodes and edges. | `src/main.tsx:135` renders all edges uniformly | open |
| Stepwise Next-Command Guide | State-aware guidance that shows what command to pick after each previous command output. | `src/main.tsx:102` only tracks `selectedId` | open |
| Five-Part Node Explanation | Node content model: what it does, input, output, next step, common mistake. | `src/main.tsx:5` has explanation/input/output/tip but lacks explicit common mistake | open |
| Goal Satisfied | A user-decided or workflow-defined stopping point where the user can stop, continue to quality, or continue to knowledge capture. | no current implementation | locked |
| Closing Node | A map node that represents a valid stopping or transition point after a command sequence. | no current implementation | locked |
| Continuation Route | Optional route from a closing node into another workflow path such as quality checks or knowledge capture. | no current implementation | locked |
| Scenario Model | Data model that groups workflow nodes, edges, steps, current step, available choices, and terminal options for one user scenario. | `src/main.tsx:5` currently lacks this model | locked |
| Cross-Scenario Transition | A choice that lets the user leave the current scenario path and continue in another workflow path when context changes. | no current implementation | locked |
| Command-Chain Source of Truth | The authoritative upstream reference for command names, sequence semantics, and workflow facts. | `maestro-flow/` submodule | locked |
| Scenario Slice | A focused subset of the workflow map for one user scenario, avoiding an unreadable global graph. | no current implementation | locked |
