---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
requirement_id: REQ-004-v2
status: active
replaces: REQ-004
created_at: 2026-06-30T09:50:00Z
decision_ref: ADR-006
---

# REQ-004-v2: Form-Driven Recommendation UI

The product MUST provide a form-driven recommendation UI with a clear input → action → result flow, responsive layout, and accessible interactions.

## User Story

As a user, I want a simple form where I can describe my task, hit recommend, and see clear results, so that I don't have to learn a complex canvas interface just to find the right command.

## Acceptance Criteria

### Layout

- The UI MUST have a single-column form layout on mobile (sm: 640px breakpoint stacks vertically).
- The UI MUST use a centered max-width container (max-w-3xl) for the form area.
- The UI MUST NOT use any sidebar (left or right) for core recommendation interaction.

### Input Area

- The UI MUST have a multi-line textarea as primary task input, with placeholder showing an example task.
- The UI MUST have 4 flag toggle chips below the textarea: `-y` / `--dry-run` / `-c` / `--super`, each with a one-line description.
- The UI MUST have a prominent primary action button "分析并推荐命令" that triggers recommendation.

### Scenario Cards

- The UI MUST have 7 scenario cards as secondary input: 探索想法 / 生成规格 / 分析代码 / 制定计划 / 执行实现 / 质量检查 / 查看状态.
- Each card MUST have: name, hint (technical term), description, example sentence.
- Card selection MUST visually toggle (border + accent background + selection indicator).
- Only one card can be selected at a time (radio-style behavior).

### Result Panel

- The UI MUST have a result panel below the action button, with 5 fields: 推荐命令 / 推荐链路 / 推荐理由 / 置信度 / 需要澄清.
- When no input is provided, the panel MUST show placeholder descriptions for each field.
- When scenario card or flag is selected but no analysis triggered, the panel MUST show a "等待分析输入…" hint.
- When recommendation is computed, the panel MUST render actual values from `RecommendationResult`.

### Interaction Quality

- The textarea MUST show a focus ring on focus.
- The primary button MUST have hover state (color shift + glow shadow) and active state (scale-down).
- All interactive elements MUST be keyboard-accessible.
- The header MUST be sticky with backdrop blur on scroll.

## Out of Scope (deferred to v2+)

- Canvas / node-graph interaction (ADR-006 作废)
- Drag-to-reorder result cards
- Inline editing of recommendation rationale

## Traceability

- Replaces: REQ-004 (canvas UI)
- Decision: ADR-006
- Source: 当前 `src/App.tsx` wireframe 已实现 ~80% 的本需求（待接数据 + 完成键盘可访问性细节）
