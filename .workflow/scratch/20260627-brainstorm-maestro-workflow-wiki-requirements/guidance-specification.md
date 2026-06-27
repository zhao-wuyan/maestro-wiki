# Guidance Specification: Maestro Workflow Wiki Requirements

## 1. Project Positioning & Goals

This session refines the early Maestro Workflow Wiki idea into a clear project requirements package. The product MUST remain an independent interactive wiki in the root project and MUST use `maestro-flow` only as a reference source, not as the product site's `docs-site` foundation.

## 2. Concepts & Terminology

| Term | Definition | Status |
|---|---|---|
| Maestro Workflow Wiki | Independent interactive site for explaining Maestro workflows and command selection. | CONFIRMED |
| Interactive Flow Node | Clickable and keyboard-accessible visual node that exposes input, output, responsibility, and next action. | CONFIRMED |
| Command Recommendation | Browser-side or future agent-assisted guidance that maps user intent and current step outcome to the next Maestro command choice. | OPEN |
| Ralph Session | `.workflow/.maestro/{session_id}/status.json` driven execution record used to explain progress and next action. | CONFIRMED |

## 3. Non-Goals

- The site MUST NOT reuse `maestro-flow/docs-site` as its product foundation.
- The site MUST NOT modify Maestro CLI execution behavior.
- The first version SHOULD avoid backend LLM dependency unless user explicitly selects agent-backed recommendation as MVP scope.

## 4. Current Context

- Root project already contains a Vite + React + TypeScript MVP.
- Existing MVP includes a clickable SVG flow diagram and detail panel.
- Existing project docs identify active needs: workflow encyclopedia, command guide, interactive flow, plain-language explanations, recommendation engine, and session visualization.

## 5. Exploration Direction Decisions

- The brainstorm SHOULD prioritize product direction exploration before locking detailed PRD scope.
- The session SHOULD identify differentiated product shapes, user value, and viable MVP focus areas.
- The first validation audience SHOULD be internal users, so the MVP MAY optimize for fast learning, honest feedback, and iteration speed over broad public onboarding polish.
- The first core experience SHOULD validate an interactive workflow map as the primary learning surface.
- The first interactive depth SHOULD support scenario-based path highlighting, so users can select a task scenario and see the recommended Maestro route emphasized on the map.
- The first highlighted scenario SHOULD focus on unclear requirements and idea exploration.
- The first command recommendation surface SHOULD use explicit scenario buttons rather than free-form natural-language parsing.
- Each interactive flow node SHOULD use a five-part explanation structure: what it does, input, output, next step, and common mistake.
- The primary validation criterion MUST be that users can select the first command for a scenario, then continue selecting the appropriate next command based on the previous command's output until the scenario goal is satisfied.

## 6. Product Hypothesis

For internal users who are still learning Maestro, an interactive workflow map with scenario-based path highlighting WILL reduce command selection uncertainty better than a static command list. The first validation scenario SHOULD be unclear requirements, because it matches the current project stage and gives a concrete route from ambiguity through the first command and then through follow-up commands until the requirement is clear enough to proceed.

## 7. MVP Boundary

The MVP MUST include a scenario button for unclear requirements, highlight the related Maestro route, and explain each highlighted node using the five-part content model. It MUST also show how the user chooses the next command after each command output, continuing until the scenario's completion condition is met. The MVP SHOULD NOT include free-form natural-language parsing, LLM-backed recommendation, custom chain editing, or full `status.json` simulation.

## 8. Risks & Constraints

- The path map MAY become too abstract if it explains every Maestro concept at once; the first map SHOULD stay centered on unclear requirements.
- Users MAY still ask for direct command recommendation; the first version SHOULD answer this with explicit scenario buttons and step-by-step next-command choices rather than NLP.
- Content accuracy MUST be checked against the `maestro-flow` submodule source, while UI and product structure MUST remain independent.

## 10. Feature Decomposition

| ID | Feature | Priority | Description | Acceptance |
|---|---|---|---|---|
| F-001 | Scenario Path Selector | MUST | Provide a visible scenario button for unclear requirements / idea exploration. | Selecting the scenario highlights the recommended path and surfaces `maestro-brainstorm` as the next command. |
| F-002 | Interactive Workflow Map | MUST | Show Maestro flow nodes as clickable and keyboard-accessible map elements. | Users can select nodes and see the selected node reflected in the details panel. |
| F-003 | Path Highlighting | MUST | Highlight the route for unclear requirements from intent input through brainstorm-oriented routing. | The highlighted nodes and edges visually differ from inactive paths. |
| F-004 | Five-Part Node Explanation | MUST | Each relevant node explains what it does, input, output, next step, and common mistake. | Every highlighted node contains all five explanation fields. |
| F-005 | Stepwise Next-Command Guide | MUST | After each highlighted command, show the output condition and the next command choices available from that state. | Users can follow a scenario from first command through subsequent command choices until the stated goal is satisfied. |
| F-006 | Internal Validation Prompt | SHOULD | Capture whether internal users can choose the command sequence after using the map. | The page includes a simple feedback or checklist prompt for “I can choose the next command at each step until the goal is met”. |
| F-007 | Future Recommendation Placeholder | MAY | Reserve space for future rule-based or agent-backed command recommendation. | UI does not imply free-form recommendation is available in MVP. |

## 11. Appendix: Decision Tracking

| # | Decision | Choice | Source |
|---|---|---|---|
| 1 | Brainstorm output depth | 探索方向 | user |
| 2 | First-stage target audience | 内部验证 | user |
| 3 | First core experience | 流程地图 | user |
| 4 | First interactive depth | 路径高亮 | user |
| 5 | First highlighted scenario | 探索需求 | user |
| 6 | First command recommendation surface | 场景按钮 | user |
| 7 | Flow node content model | 五段解释 | user |
| 8 | Primary MVP success criterion | 按场景连续选择命令直到目标满足 | user-corrected |

## 12. Cross-Role Resolutions

Pending role analysis.
