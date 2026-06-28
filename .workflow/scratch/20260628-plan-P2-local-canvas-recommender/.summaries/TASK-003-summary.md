# TASK-003 — Implement node popover and canvas branch navigation

**Phase**: M2 Phase 2 — Canvas Command Recommender (节点 popover + 画布分支导航 + 泳道布局)
**Status**: completed
**Commit**: (filled post-commit)
**Completed at**: 2026-06-28T19:43:00Z

## Modified Files

- `src/main.tsx` — 在 TASK-002 满屏画布壳基础上实现节点 popover、画布分支导航和泳道布局：
  - **新增常量**：`MAIN_LINE_GAP = 220`（主路径水平间距）、`BRANCH_OFFSET = 90`（分支垂直偏移）、`MAIN_LINE_Y = 200`、`BASE_X = 40`、`LONG_PRESS_MS = 500`（grill Q4.2/C-011：纯几何规则计算坐标，不引入图形库）
  - **新增 state**：`popover: { nodeId: string; x: number; y: number } | null`（grill Q3.1/C-007：popover 由 onContextMenu 触发）
  - **新增 ref**：`longPressTimerRef`（触屏长按 ≥500ms 映射到 onContextMenu 行为）
  - **泳道布局**：`nodeLayout` useMemo 将主路径节点沿水平轴右展（`x = BASE_X + stepIndex * MAIN_LINE_GAP`，`y = MAIN_LINE_Y`），覆盖 TASK-002 的固定坐标；`getNodePos(nodeId)` 返回计算坐标供节点/边/视口裁剪统一使用
  - **统一画布分支**：`activeBranches` useMemo 合并 Next Choices（`step.choices`，推进 `targetStepId`）、Continuation Routes（`step.terminalRoutes` 映射到 `continuationRoutes`，作 terminal 节点画布分支）和 Alternatives（`step.alternatives`，作次级泳道分支）；分支按 `index % 2` 交替 `±BRANCH_OFFSET` 上下偏移（泳道感）；terminal routes 用 `data-branch-kind="route"` 标记，alternatives 用 `data-branch-kind="alternative"` + `canvas-branch-secondary` 次级样式（opacity 0.55 + stroke-width 1）
  - **onContextMenu handler**：`handleNodeContextMenu(event, nodeId)` 调用 `event.preventDefault()` + `event.stopPropagation()` 并设置 popover state（事件坐标相对 canvas-shell）；shell 级 `handleContextMenu` 保留 `preventDefault`（空画布右键关闭 popover）
  - **触屏长按**：`handleNodeTouchStart`（记录坐标 + setTimeout 500ms 设 popover）、`handleNodeTouchEnd`/`handleNodeTouchMove`（清除 timer）
  - **Popover 渲染**：HTML `<div className="node-popover">` 绝对定位在事件坐标，内容含 Recommended Command 卡（`popoverStep.command` + rank 标签）、Purpose/Input/Output/Next Action `<dl>`、Alternatives 列表、Source Status（`popoverStep.citations` 映射到 `scenario.citations` 显示 cited/pending/platform-check badge）、Validation Checklist（`scenario.checklist` + checkbox，`checkedItems` 按 step 保留 via `checklistKey(stepId, checkId) = "${stepId}::${checkId}"`）
  - **checkedItems 按 step 保留**：`toggleCheck(stepId, checkId)` 使用 `${stepId}::${checkId}` 复合键，不同 step 的 checklist 状态独立保留（grill Q2.3/C-006）
  - **自动居中**：`useEffect([activeStepId])` 在 step 推进时自动平移 canvasTransform 使活动节点位于视口 1/3 处（确保右侧分支可见）
  - **主画布常驻**：仅含节点框 + 导航分支（choices/routes/alternatives），证据文字仅在 popover 内（grill Q2.1/C-004）
  - **移除**：`className="choice-button"` 面板按钮（TASK-002 已迁移到 SVG `<g>`，本 task 用 `activeBranches` 统一替换原 `activeStep.choices.map` 渲染）
- `src/styles.css` — 新增 251 行样式：
  - `.canvas-branch` / `.canvas-branch-rect`：可点击画布分支，full saturation + stroke-width 2；`:hover`/`:focus` 增强反馈
  - `.canvas-branch-secondary`：次级分支 opacity 0.55 + stroke-width 1（grill Q4.2 未选分支次级样式）
  - `.canvas-branch-label` / `.canvas-branch-condition`：分支文字样式
  - `.node-popover`：绝对定位、半透明背景（`rgba(8,22,39,0.94)` + `backdrop-filter: blur(14px)`）、圆角 18px、z-index 50、宽 340px、max-height 70vh overflow-y auto
  - `.popover-close`：关闭按钮
  - `.popover-command-card`：Recommended Command 卡片样式
  - `.popover-evidence` / `.popover-evidence-row` / `dt` / `dd`：Purpose/Input/Output/Next Action `<dl>` 网格布局
  - `.popover-alternatives` / `.popover-source-status` / `.popover-checklist`：证据簇子区样式
  - `.source-badge-cited`（绿）/ `.source-badge-pending`（黄）/ `.source-badge-platform-check`（紫）：citation 状态 badge
  - `.popover-checklist input[type="checkbox"]`：checkbox 样式
- `src/main.test.tsx` — 新增 6 个 `[UI-observable]` 测试（总 16→22）：
  1. 右键节点弹 popover 显示证据簇（command card + Purpose/Input/Output/Next Action dl + alternatives + source status + checklist + 定位坐标）
  2. popover source status 显示 citation badge 和 maestro-flow/ 路径
  3. validation checklist checkbox 切换 + 关闭/重开 popover 后按 step 持久
  4. alternatives 作次级画布分支渲染（data-branch-kind="alternative"）
  5. terminal routes 作画布分支渲染（Stop/Quality Pipeline/Knowledge Capture + data-branch-kind="route"）
  6. 主路径节点使用 MAIN_LINE_GAP 水平间距
- `scripts/e2e-smoke.mjs` — 新增 5 段 `[UI-observable]` e2e 断言：
  1. 右键规格成型节点弹 popover 显示 maestro-blueprint + Purpose + Source Status + Validation Checklist + maestro-flow/
  2. checklist checkbox 勾选 + 关闭 popover + 重开后仍勾选（per-step 持久）
  3. alternatives 作画布分支渲染（先 roadmap）
  4. 导航到 terminal 节点后 Stop/Quality Pipeline/Knowledge Capture 作画布分支渲染
  5. terminal route 分支 data-branch-kind="route"

## Convergence Criteria Verification

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | src/main.tsx contains 'onContextMenu' handler opening popover | PASS | `grep -c "onContextMenu" src/main.tsx` → 2（shell handler + node handler）；`handleNodeContextMenu` 调用 `setPopover({ nodeId, x, y })` |
| 2 | src/main.tsx contains 'preventDefault' in context menu handler | PASS | `handleNodeContextMenu` 内 `event.preventDefault()`；shell `handleContextMenu` 内 `event.preventDefault()` |
| 3 | src/main.tsx contains 'checkedItems' retained per step | PASS | `checklistKey(stepId, checkId) = "${stepId}::${checkId}"` 复合键；`toggleCheck` 按 step 维度更新；`checkedItems` state 3 处引用 |
| 4 | src/main.tsx contains 'MAIN_LINE_GAP' or 'BRANCH_OFFSET' | PASS | `MAIN_LINE_GAP = 220` + `BRANCH_OFFSET = 90` 常量定义；`nodeLayout` useMemo 使用 `MAIN_LINE_GAP`；`activeBranches` 渲染使用 `BRANCH_OFFSET` |
| 5 | src/main.tsx does not contain 'className="choice-button"' | PASS | `grep -c 'className="choice-button"' src/main.tsx` → 0 |
| 6 | src/main.tsx contains terminalRoutes rendered as canvas branch options | PASS | `activeBranches` useMemo 显式遍历 `step.terminalRoutes` 映射到 `continuationRoutes`，作 `kind: 'route'` 画布分支渲染（6 处 terminalRoutes 引用） |
| 7 | src/main.test.tsx contains '[UI-observable]' | PASS | `grep -c "\[UI-observable\]" src/main.test.tsx` → 16 |
| 8 | [UI-observable] npm run test:e2e exits 0 | PASS | `npm run test:e2e` 退出码 0；e2e 验证右键 popover 显示证据、checklist 持久、alternatives 分支、terminal routes 分支 + data-branch-kind=route |

附加验证：`npx tsc --noEmit` 退出码 0；`npm test` → `Test Files 1 passed (1) / Tests 22 passed (22)`，退出码 0；`npm run build` 成功。

## Project Spec Alignment

- **grill Q2.1 / C-004（推荐证据由节点 popover 承载）**：Recommended Command/Purpose/Input/Output/Next Action/Alternatives/Source Status 全部在 popover 内渲染；主画布常驻仅含节点框 + 导航分支（choices/routes/alternatives SVG `<g>`），无常驻证据文字。
- **grill Q2.2 / C-005（Continuation Routes 上画布）**：terminal 节点的 stop/quality/knowledge 路线作为 `activeBranches` 中的 `kind: 'route'` 画布分支渲染，与 Next Choices 共用同一套"活动节点发出可点击分支"机制；MUST NOT 作独立面板或 popover 内按钮。
- **grill Q2.3 / C-006（Validation Checklist 入 popover）**：Validation Checklist 在 popover 证据簇下方渲染，`checkedItems` 按 step 保留（`${stepId}::${checkId}` 复合键），MUST NOT 作独立常驻控件。
- **grill Q3.1 / C-007（popover 由 onContextMenu 触发）**：节点 `onContextMenu`（右键）调用 `preventDefault` + `stopPropagation` 并设 popover；触屏 `onTouchStart` + 长按 ≥500ms 映射同一行为；左键 click 选中节点；左键拖拽平移；shell 级 onContextMenu 仍 preventDefault（空画布右键）。
- **grill Q4.2 / C-011（水平主线+上下分支布局）**：`MAIN_LINE_GAP = 220` 主路径水平右展 y 对齐；`BRANCH_OFFSET = 90` 分支上下交替偏移（`index % 2` 决定 sign）；选中主线 full saturation + stroke-width 2，未选分支 opacity 0.55 + stroke-width 1；坐标纯几何运算，无图形库。
- **grill Q1.2 / C-002（Next Choices 上画布）**：`className="choice-button"` 面板按钮已移除（grep 0 匹配）；Next Choices 作 activeNode 发出的可点击 SVG `<g role="button">` 画布分支，onClick 用 `choice.targetStepId` 推进 `setActiveStepId` + `setSelectedNodeId`。

## Deviations

1. **自动居中 effect**：grill 未显式要求 auto-pan，但导航到远处节点时分支会移出视口导致不可点击。新增 `useEffect([activeStepId])` 在 step 推进时自动平移使活动节点位于视口 1/3 处（右侧分支可见）。仅依赖 `activeStepId`，不干扰用户手动 pan/zoom。
2. **alternatives 作可点击但无导航的画布分支**：`step.alternatives` 渲染为 `data-branch-kind="alternative"` 的 SVG `<g role="button">`，次级样式（opacity 0.55 + stroke-width 1）。点击调用 `handleChoiceClick(undefined, undefined)`（无 targetStepId/routeId，不导航）——满足 grill Q4.2"备选/并行分支上下偏移"的视觉要求；完整 alternatives 证据在 popover 内展示。
3. **checkedItems 用 `Record<string, boolean>` + 复合键**：grill Q2.3 允许 `Record<string, boolean>` 或 `Record<stepId, string[]>`。采用 `${stepId}::${checkId}` 复合键实现 per-step 保留，比嵌套 Record 更简单且与 TASK-002 现有 `Record<string, boolean>` 类型兼容。
4. **terminal routes 用 continuationRoutes label 渲染**：terminal step 的 `choices` 含 routeId 但 label 为中文（"停止"/"进入质量管线"/"进入知识沉淀"）；本 task 改用 `step.terminalRoutes` + `continuationRoutes` 数据渲染，label 为 "Stop"/"Quality Pipeline"/"Knowledge Capture"，与 C-005"复用 terminalRoutes 数据"要求一致。

## Notes for Downstream Tasks

- **TASK-004（route history localStorage 持久化）**：`handleChoiceClick` 的 `routeId` 分支当前仅 `void route`，可在该处接入 localStorage 持久化（FIFO recent 上限 20 / favorites 无上限 / 存证据不存坐标 / 读写容错降级会话内存，对齐 grill R-014/C-014）。popover 的 `popoverStep` + `popoverCitations` 可直接用作"推荐证据"存入 route history。
- **`activeBranches` 已统一**：后续 task 如需扩展分支类型（如 quality pipeline 内部步骤），可在 `activeBranches` useMemo 中追加 branch kind。
- **`checklistKey` 复合键**：后续 task 如需跨 step 查询 checklist 状态，可遍历 `Object.entries(checkedItems)` 按 `::` 分割 stepId/checkId。
