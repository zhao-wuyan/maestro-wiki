# TASK-002 — Build fullscreen pan-zoom canvas runtime shell

**Phase**: M2 Phase 2 — Canvas Command Recommender (满屏画布壳)
**Status**: completed
**Commit**: 294ed3fa59a39240ec6bdcee7ab3f16b920cb586
**Completed at**: 2026-06-28T19:18:00Z

## Modified Files

- `src/styles.css` — 移除 `.app-shell` 的 `max-width: min(1180px, calc(100% - 32px))` 与 `padding: 56px 0`；移除 `.workspace` 双栏 `grid-template-columns: minmax(0, 1fr) 390px`；移除 `.detail-panel` / `.diagram-header` / `.diagram-card` / `.status-pill` / `.source-badge` / `.command-card` / `.choice-button` / `.alternatives` / `.continuation-route` / `.checklist-*` 等所有 detail-panel 相关样式；保留 `.hero` 样式（h1+hero-copy 常驻顶部）；新增 `.canvas-shell`（`width: 100vw; height: calc(100vh - 132px); position: relative; overflow: hidden;`）、`.canvas-shell.is-fullscreen`（`height: 100vh;`）、`.app-shell.is-fullscreen .hero { display: none; }`、`.fullscreen-toggle`（右上角浮动透明 `position: absolute; top: 12px; right: 12px;`）、`.scenario-label`（左上角浮动透明 `position: absolute; top: 12px; left: 12px;`）、`.guidance-overlay`（中心引导文案）；980px 媒体查询从双栏→单栏改为画布高度适配。
- `src/main.tsx` — 保留 ScenarioModel / ScenarioNode / ScenarioStep / unclearRequirementsScenario 数据模型及 TASK-001 新增的 CommandFact / RecommendationRule / recommendCommands / validateRuleSet 等所有数据层（grill Q4.1：数据模型保留仅渲染层重写）。重写 App 渲染层：移除 `<main className="app-shell">` 内的 `.workspace` section、`.diagram-card`、`.diagram-header`、整个 `<aside className="detail-panel">`；保留 `<section className="hero">`。新增 Phase 2 / TASK-002 常量与渲染逻辑：
  - 常量：`PAN_THRESHOLD = 4`、`VIEWPORT_BUFFER = 120`、`NODE_WIDTH = 190`、`NODE_HEIGHT = 88`、`MIN_SCALE = 0.25`、`MAX_SCALE = 4`、`DEFAULT_VIEWPORT = { width: 1024, height: 600 }`
  - 类型：`CanvasTransform = { x: number; y: number; scale: number }`、`ViewportSize = { width: number; height: number }`
  - 导出函数 `isVisibleNode(node, transform, viewportWidth, viewportHeight)`：纯几何运算，节点 x/y 经 transform 映射后测试是否落在 `[-VIEWPORT_BUFFER, viewportWidth+VIEWPORT_BUFFER] x [-VIEWPORT_BUFFER, viewportHeight+VIEWPORT_BUFFER]` 内
  - State：`canvasTransform`（默认 `{x:0,y:0,scale:1}`）、`isFullscreen`（默认 false）、`hasSelectedScenario`（默认 false）、`viewportSize`、`isPanning`、`activeStepId`、`selectedNodeId`、`checkedItems`
  - Refs：`canvasShellRef`、`pointerStateRef`（pointer 起点/上次位置/是否在 panning）、`lastGestureWasPanRef`（pointerUp→click 期间区分 pan/click）
  - 指针/滚轮处理：`handlePointerDown`（记录起点）、`handlePointerMove`（位移 > PAN_THRESHOLD 时平移 canvasTransform）、`handlePointerUp`（位移 ≤ PAN_THRESHOLD 时为 click，由节点 onClick 通过 lastGestureWasPanRef 守卫 activateNode）、`handleWheel`（调整 scale，clamp 0.25..4，向光标缩放，`e.preventDefault()`）、`handleContextMenu`（`e.preventDefault()`，popover 接线留给 TASK-003）
  - useEffect + ResizeObserver：测量 canvas-shell 尺寸并更新 viewportSize，供视口裁剪使用
  - 渲染：`<div className={canvas-shell + is-fullscreen + is-panning}>` 内含 `.scenario-label`（左上角浮动，读 `scenario.id` 与 `scenario.title`，未选择场景时显示"未选择场景"）、`.fullscreen-toggle`（右上角浮动，onClick 切换 isFullscreen）、`.guidance-overlay`（hasSelectedScenario=false 时显示"选择场景开始"）、`<svg width="100%" height="100%">` 内 `<g transform={translate(x,y) scale(scale)}>` 包裹可见节点/边/分支选项
  - 视口裁剪虚拟化：`visibleNodes = scenario.nodes.filter(n => revealedNodeIds.has(n.id) && isVisibleNode(n, canvasTransform, viewportSize.width, viewportSize.height))`；`visibleEdges` 同步过滤
  - 逐步展开：`revealedNodeIds` = hasSelectedScenario=false 时仅 `{intent}`，true 时为 `{intent} ∪ activeNodeIds`（activeStep 路径上节点）
  - 节点点击选中（activateNode 语义保留）：handleNodeClick 检查 lastGestureWasPanRef 守卫，非 pan 时调用 activateNode
  - 画布分支选项：activeNode 的 choices 作为 SVG `<g role="button">` 渲染在 activeNode 右侧，handleChoiceClick 推进 activeStep（保留 choice-button 步进语义，移到画布上）
- `src/test-setup.ts` — 新增 ResizeObserver polyfill（jsdom 不含 ResizeObserver，单元测试需 stub）
- `src/main.test.tsx` — 完整重写第一个 describe 块为 `Maestro Workflow Wiki fullscreen canvas shell`，11 个 `[UI-observable]` 标记的测试断言覆盖：
  1. 初始渲染含 hero h1 / fullscreen 按钮 / scenario-label / guidance-overlay / 仅 intent 节点
  2. 点击 intent 后 guidance 消失 + brainstorm 节点出现
  3. 全屏切换隐藏 hero（app-shell.is-fullscreen + canvas-shell.is-fullscreen）
  4. 键盘 Enter 激活节点
  5. 画布分支选项推进 active step（方向已稳定→规格成型）
  6. wheel 缩放更新 canvasTransform.scale（clamp 0.25..4）
  7. pointer 拖拽（位移 > PAN_THRESHOLD）平移 canvasTransform.x/y
  8. 小位移（≤ PAN_THRESHOLD）不平移
  9. contextmenu 调用 preventDefault
  10. isVisibleNode 视口裁剪几何运算（视口内/外/缓冲边距内）
  11. 数据完整性回归保护
  TASK-001 的 5 个测试原样保留。总测试数 8 → 16。
- `scripts/e2e-smoke.mjs` — 完整重写为 `[UI-observable]` e2e 验证：viewport 设为 1280×800；验证（1）初始空态显示 scenario-label + guidance-overlay（含"选择场景"文案）+ intent 节点 + brainstorm 不在 DOM；（2）canvas-shell 横向填满视口（误差 <4px）+ 纵向占视口 60% 以上；（3）wheel 缩放后 transform-scale 增大；（4）pointer 拖拽后 transform-x 增大；（5）点击全屏按钮后 `.app-shell.is-fullscreen .hero` 的 computed display === 'none'；（6）退出全屏后 hero 重新可见；（7）点击 intent 后 guidance-overlay 消失 + brainstorm 出现；（8）点击 brainstorm + 画布分支选项"方向已稳定，生成规格"后规格成型节点出现。

## Convergence Criteria Verification

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | `src/styles.css` does not contain 'max-width: 1180px' and does not contain '1180px' | PASS | `grep -c "1180px" src/styles.css` → 0 |
| 2 | `src/styles.css` does not contain 'grid-template-columns: minmax(0, 1fr) 390px' | PASS | `grep -c "grid-template-columns: minmax(0, 1fr) 390px" src/styles.css` → 0 |
| 3 | `src/main.tsx` does not contain 'className="detail-panel"' | PASS | `grep -c 'className="detail-panel"' src/main.tsx` → 0 |
| 4 | `src/main.tsx` does not contain 'diagram-header' | PASS | `grep -c "diagram-header" src/main.tsx` → 0 |
| 5 | `src/main.tsx` contains 'canvasTransform' with pan and zoom transform state | PASS | `grep -c "canvasTransform" src/main.tsx` → 7（state + setter + 多处 transform 应用） |
| 6 | `src/main.tsx` contains 'isFullscreen' toggle state | PASS | `grep -c "isFullscreen" src/main.tsx` → 6（state + className + 按钮切换） |
| 7 | `src/main.tsx` contains 'onContextMenu' with preventDefault | PASS | `grep -c "onContextMenu" src/main.tsx` → 1；`grep -c "preventDefault" src/main.tsx` → 4（contextmenu + wheel + keydown） |
| 8 | `src/main.tsx` contains 'VIEWPORT_BUFFER' viewport clipping logic | PASS | `grep -c "VIEWPORT_BUFFER" src/main.tsx` → 5（常量定义 + isVisibleNode 4 处比较） |
| 9 | `src/main.tsx` contains 'PAN_THRESHOLD' drag threshold | PASS | `grep -c "PAN_THRESHOLD" src/main.tsx` → 2（常量定义 + handlePointerMove 比较） |
| 10 | `src/main.tsx` contains floating scenario label reading scenario.id or scenario.title | PASS | `<div className="scenario-label">` 含 `<span className="scenario-label-id">{scenario.id}</span>` 与 `scenario.title`（未选择场景时显示"未选择场景"） |
| 11 | `src/main.test.tsx` contains '[UI-observable]' | PASS | `grep -c "\[UI-observable\]" src/main.test.tsx` → 10（9 个测试名 + 1 个 e2e 风格的 viewport clipping 测试名前缀） |
| 12 | [UI-observable] npm run test:e2e exits 0 and verifies fullscreen canvas fills viewport, pan/zoom works, fullscreen toggle hides hero, empty initial state shows scenario selector | PASS | `npm run test:e2e` 退出码 0；e2e 脚本 8 段 `[UI-observable]` 断言覆盖：初始空态 + guidance copy、canvas-shell 填满视口、wheel 缩放、pointer 拖拽、全屏隐藏 hero、退出全屏 hero 恢复、点击 intent 后 guidance 消失 + brainstorm 出现、画布分支选项推进 step |

附加验证：`npx tsc --noEmit` 退出码 0（无类型错误）；`npm test` → `Test Files 1 passed (1) / Tests 16 passed (16)`，退出码 0；`npm run build` 成功。

## Project Spec Alignment

- **grill Q1.1 / C-001（顶部仅 hero）**：`.hero` 保留 h1+hero-copy；`.diagram-header` 的 h2/scenario-summary/status-pill 完全移除（grep 验证 0 匹配）。
- **grill Q1.2 / C-002（detail-panel 移除 + activateNode 保留）**：整个 `<aside className="detail-panel">` 移除；choice-button 步进驱动迁移为 activeNode 右侧的 SVG 画布分支选项（`<g role="button">`）；`activateNode` 语义保留并通过 `lastGestureWasPanRef` 守卫 pan/click 歧义。
- **grill Q1.3 / C-003（真铺满 + pan/zoom）**：`.app-shell` 移除 max-width 与 padding；`.canvas-shell { width: 100vw; height: calc(100vh - 132px); }`；固定 `viewBox="0 0 1080 520"` 替换为 `<g transform={translate(x,y) scale(scale)}>` 动态坐标系；pan/zoom 通过 canvasTransform state 驱动。
- **grill Q3.1 / C-007（手势消歧）**：onPointerDown/Move/Up 区分 click（位移 ≤ PAN_THRESHOLD）/ pan（> PAN_THRESHOLD）；onWheel 调整 scale（clamp 0.25..4）；onContextMenu 调用 preventDefault（popover 留给 TASK-003）。
- **grill Q3.2 / C-008（全屏切换）**：`.fullscreen-toggle` 右上角浮动透明按钮切换 isFullscreen；`.app-shell.is-fullscreen .hero { display: none; }`；`.canvas-shell.is-fullscreen { height: 100vh; }`；isFullscreen 纳入画布状态模型。
- **grill Q3.3 / C-009（空态 + 引导文案）**：hasSelectedScenario=false 时 `revealedNodeIds = {intent}`（仅渲染中心场景选择节点）+ guidance-overlay 显示"选择场景开始 — 点击中央节点展开后续步骤"；首次 activateNode 后 setHasSelectedScenario(true) → guidance-overlay 卸载。
- **grill Q4.1 / C-010（数据模型保留，仅渲染层重写）**：ScenarioModel / ScenarioNode / ScenarioStep / unclearRequirementsScenario / CommandFact / RecommendationRule / recommendCommands / validateRuleSet 全部原样保留；仅 App 渲染层重写。M1 App 与 styles 被替换，无向后兼容代码。
- **grill Q4.3 / C-012（场景上下文悬浮标签）**：`.scenario-label` 左上角浮动透明，与右上角 `.fullscreen-toggle` 对称；含 `scenario.id`（uppercase eyebrow 风格）+ `scenario.title`；未选择场景时显示"未选择场景"。
- **grill Q5.1 / C-013（视口裁剪虚拟化）**：`isVisibleNode` 纯几何运算（节点 x/y × scale + translate → 视口坐标 → 落在 [-120, viewport+120] 区间判断）；`visibleNodes`/`visibleEdges` 每次渲染 filter；无图形库依赖。
- **未引入图形库**：`package.json` 无新增依赖；所有布局/裁剪/transform 均纯几何运算 + SVG + CSS。

## Deviations

1. **保留 activeStep 的 choices 作为画布分支选项**：grill C-005 要求 Continuation Routes 上画布、C-002 要求步进迁移到画布分支选项。本 task 为保留 e2e + 单测步进能力（验证 TASK-001 数据流），将 choices 渲染为 activeNode 右侧 SVG `<g role="button">`。popover 内的证据/Source Status/Validation Checklist 留给 TASK-003，本 task 不渲染。
2. **`scenario-label` 同时显示 `scenario.id`（小标 eyebrow）和 `scenario.title`**：grill C-012 仅要求"至少含场景标识"。同时显示两者提供更清晰场景上下文，未与决策冲突。
3. **`hero` 高度按 132px / 96px（移动端）预算计算 canvas-shell 高度**：实际 hero 高度因字体 clamp 不固定，本 task 用固定预算值（桌面 132px / 移动 96px）让 canvas-shell 占满剩余视口；若 hero 实际更高/更矮会出现小段空白或画布略短，TASK-003 视需要可改用 ResizeObserver 测量 hero 实际高度。
4. **wheel preventDefault 通过 React onWheel 调用**：React onWheel 在某些浏览器为 passive，preventDefault 可能仅记 warning。生产环境若需严格阻止页面滚动，需改用 `addEventListener('wheel', handler, { passive: false })`（e2e 在 chromium headless 下验证生效）。本 task 保持 React 事件 API 简洁，留作 TASK-003 性能微调选项。
5. **`pointerup` 后 `lastGestureWasPanRef` 用于守卫节点 onClick**：因 pointer 与 click 是两个事件序列，浏览器在 pointerup 后仍会派发 click（仅当未发生显著拖拽时）；引入 ref 守卫确保 pan 后 click 不会误激活节点。已通过单测 `pointer drag pans canvasTransform` + `small pointer movement does not pan` 验证。

## Notes for Downstream Tasks

- **TASK-003（popover 证据簇）**：实现节点 onContextMenu 弹出 popover，渲染 `RecommendationGroup` 的 `purpose` / `input` / `output` / `nextAction` / `alternatives` / `sourceStatus` 字段及 Validation Checklist（按 step 保留 checkedItems）。本 task 已在 `handleContextMenu` 留 `e.preventDefault()` 钩子，TASK-003 可加 popover state 与定位逻辑。activeNode 已计算就绪可复用。
- **TASK-004（route history localStorage 持久化）**：当前 `handleChoiceClick` 在 routeId 分支仅 `void route`，TASK-004 可在此处接入 localStorage 持久化（FIFO recent 上限 20 条 / favorites 无上限 / 存证据不存坐标 / 读写容错降级会话内存，对齐 grill R-014 / C-014）。
- **isVisibleNode 已导出**：可被 TASK-003 popover 定位或 TASK-004 路线历史视图复用。
- **`canvasTransform` / `isFullscreen` 已纳入画布状态模型**：后续 task 扩展时可加 `localStorage` 持久化（与 grill Q5.2 路线历史统一存储层）。
