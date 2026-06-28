# Grill Report: 单一满屏画布布局 — 只保留顶部标题和项目简介，移除其他所有页面布局元素

**Session**: GRL-20260628-fullscreen-canvas-layout
**Depth**: standard (5 branches)
**Date**: 2026-06-28T00:00:00Z
**Upstream**: none (interactive)
**Prior Related Artifact**: GRL-20260628-canvas-node-scenario-redesign (12 locked decisions — must be honored / explicitly superseded)

## Discovery Summary

### Project Context

项目是独立的 Vite + React + TypeScript 的 Maestro Workflow Wiki（`.workflow/project.md`）。M1（stepwise scenario map MVP）已完成并审计通过；M2（canvas command recommender MVP）处于 plan 阶段（PLN-002，inline fallback plan，confidence 0.72）。技术栈：React 18 + Vite 6 + 原生 SVG + CSS，无图形库、无后端、无路由库。上一个 grill（GRL-20260628-canvas-node-scenario-redesign）已锁定 10 条核心决策，其中 #1「重写为规则驱动画布而非侧栏改皮肤」、#10「逐步展开画布+支持并行分支」与本轮布局诉求高度相关但未解决视觉边界。

### Codebase Surface

当前页面布局由 `src/main.tsx` + `src/styles.css` 实现，关键结构：

| 代码位置 | 元素 | 当前职责 |
|----------|------|----------|
| `src/main.tsx:333` | `<main className="app-shell">` | 居中容器，`max-width: 1180px`（styles.css:29），`padding: 56px 0` |
| `src/main.tsx:334-340` | `<section className="hero">` | 顶部标题区：eyebrow + `h1` + `hero-copy`（站点简介） |
| `src/main.tsx:342` | `<section className="workspace">` | 双栏 grid：`minmax(0,1fr) 390px`（styles.css:78-83） |
| `src/main.tsx:343-402` | `.diagram-card` | 左栏：含 `.diagram-header`（eyebrow+h2+scenario-summary+status-pill）+ `<svg viewBox="0 0 1080 520">` |
| `src/main.tsx:404-506` | `.detail-panel` (aside, 390px) | 右栏：Selected Node 标题+purpose、Recommended Command 卡、Purpose/Input/Output/Next Action（dl）、**Next Choices 按钮**、Alternatives、Source Status、Continuation Routes、**Validation Checklist（交互 checkbox）** |
| `src/main.tsx:426-447` | `.choice-button` onClick | **步进导航唯一驱动**：`setActiveStepId` + `setSelectedNodeId` |
| `src/main.tsx:326-330` | `activateNode` | 节点点击 → 更新 detail-panel；不推进 step |
| `src/styles.css:28-32` | `.app-shell` | `width: min(1180px, calc(100% - 32px))` — 限制铺满 |
| `src/styles.css:334-345` | `@media (max-width:980px)` | 现有响应式：980px 以下 workspace 变单栏、svg min-height 降为 340px |

**SVG 画布固定**：`viewBox="0 0 1080 520"`（main.tsx:353），节点坐标硬编码（如 `intent: x:70,y:118`、`done: x:320,y:340`）。当前 SVG `width:100%`，靠 viewBox 缩放，无平移/缩放交互。

### Upstream Material

N/A（交互式 grill，无 `--from`）。

### 与上一轮 grill 的关系

GRL-20260628-canvas-node-scenario-redesign 的 Branch 1（Scope）曾留为 **open**：「The canvas rewrite boundary MUST be clarified before planning implementation」。本轮正是对此 boundary 的澄清，但用户的「移除其他所有页面布局」字面诉求与上一轮已锁定决策存在张力，需逐一核验：
- 已锁定 #6「保存推荐证据（reasons/sourceRefs），不只命令链或全 UI 快照」——证据必须显示在某处，detail-panel 移除后去向成疑
- 已锁定 #10「逐步展开画布+支持并行分支」——并行分支视觉布局仍 open（tree/swimlane/auto-layout）

---

## Branch 1: Scope & Boundaries

**Status**: ✅ Done
**Questions asked**: 3
**Decisions locked**: 3

### Q1.1: "顶部标题"与"项目简介"保留集消歧

**Question**: 代码里"标题/简介"各有两处——`.hero` 区 `h1`(main.tsx:336)+`hero-copy`(main.tsx:338, 站点级) vs `.diagram-header` 区 `h2`(main.tsx:347)+`scenario-summary`(main.tsx:348)+`status-pill`(main.tsx:350, 场景级)。保留哪一组？

**Answer**: 只留 hero（站点级）——保留 `h1`+`hero-copy`，移除 `diagram-header` 的 `h2`/`scenario-summary`/`status-pill`。

**Evidence**: `src/main.tsx:334-340`（hero）、`src/main.tsx:344-351`（diagram-header）、`src/styles.css:34-37`（.hero）、`src/styles.css:98-103`（.diagram-header）。

**Decision**: locked

**Constraint**: 顶部布局 MUST 只保留 `.hero` 的站点级 `h1`+`hero-copy`；`.diagram-header` 的 `h2`/`scenario-summary`/`status-pill` MUST 移除（场景上下文若需保留须以非布局方式承载，见 Q1.2/Q2.2）。

**Downstream implication (open risk)**: 移除 `scenario.title`/`summary` 后，用户失去"当前在哪个场景"的上下文。场景切换能力（当前 `selectedScenarioId` 硬编码 main.tsx:307，仅一个场景）与场景标签去向留待 Branch 2/4。

### Q1.2: 步进导航与"只有大画布"的矛盾（核心）

**Question**: `.detail-panel`(main.tsx:404,390px) 内 `.choice-button`(main.tsx:426-447) 的 onClick 是 `setActiveStepId`+`setSelectedNodeId`——步进推进的唯一驱动；`activateNode`(main.tsx:326) 只选中、不推进 step。字面删除整个 detail-panel 会让步进导航消失。如何处理？

**Answer**: 选项上画布——删除整个 `.detail-panel`，把 Next Choices 按钮变成从活动节点发出的分支选项（画布上的可点击边/小卡），导航在画布内完成；`activateNode` 保留为节点选中。

**Evidence**: `src/main.tsx:404-506`（detail-panel 全部内容）、`src/main.tsx:426-447`（choice-button onClick 步进驱动）、`src/main.tsx:326-330`（activateNode 仅选中）、`src/styles.css:78-83`（.workspace 双栏 grid）、`src/styles.css:186-190`（.detail-panel）。

**Decision**: locked

**Constraint**: `.detail-panel` 整体 MUST 移除；步进导航 MUST 迁移到画布上，表现为从活动节点发出的可点击分支选项；节点点击选中能力（`activateNode` 语义）MUST 保留。

**Downstream implications (open, deferred to Branch 2)**:
- detail-panel 其余内容去向：Recommended Command 卡、Purpose/Input/Output/Next Action（dl）、Alternatives、Source Status、Continuation Routes、Validation Checklist（交互 checkbox）。其中 Source Status/推荐理由受上一轮 grill 锁定决策 #6 约束（MUST 保存推荐证据），不可静默丢弃——Branch 2 Q2.2 处理。
- Continuation Routes（stop/quality/knowledge，terminal 节点的路线选择）本质也是导航，是否同样上画布待 Branch 2 确认。

### Q1.3: "铺满屏幕"的边界与画布交互模型

**Question**: `.app-shell` `width: min(1180px, calc(100% - 32px))` + `padding: 56px 0`(styles.css:28-32) 把画布框在 1180px 内；SVG 固定 `viewBox="0 0 1080 520"`(main.tsx:353, 比例≈2.08:1) 靠 width:100% 缩放。三者都与"铺满"冲突。"铺满"到什么程度？

**Answer**: 真铺满 + 可平移缩放（选项1与选项3合并）——画布渲染区精确填满 hero 以下整个视口（移除 1180px 上限和 56px padding），同时画布是可平移/缩放的虚拟大面，节点可超出屏幕，靠平移缩放浏览。

**Evidence**: `src/styles.css:28-32`（.app-shell 上限+padding）、`src/styles.css:121-126`（svg width:100% min-height:420px）、`src/main.tsx:353`（固定 viewBox 1080×520）、`src/styles.css:334-345`（现有 980px 媒体查询仅改列数/min-height，无平移缩放）。

**Decision**: locked

**Constraint**: 
- `.app-shell` 的 `max-width:1180px` 与 `padding:56px 0` MUST 移除（或重构为画布专属容器），画布容器 MUST 横向占满视口宽度、纵向占满 hero 下边缘到视口底部。
- 画布 MUST 是可平移(pan)/缩放(zoom)的虚拟大面，节点坐标不再被视口尺寸约束；固定 `viewBox="0 0 1080 520"` MUST 替换为可动态调整的坐标系（含平移/缩放变换矩阵）。
- 现有 980px 媒体查询(styles.css:334)的双栏→单栏规则失效（双栏已删），MUST 重写为画布在小屏的平移/缩放/触控适配。

**Downstream implications (open, deferred to Branch 3/5)**:
- 平移/缩放的交互方式（鼠标拖拽+滚轮？触控双指？键盘？）与边界（能否缩放到空白？最小/最大缩放？）待 Branch 3/5。
- 节点坐标体系：当前硬编码 `x/y`(main.tsx:84-154) 在无限画布下是否改用相对/自动布局，待 Branch 5（与上轮 grill open question「tree/swimlane/auto-layout」合并）。

---

## Branch 2: Data Model & State

**Status**: ✅ Done
**Questions asked**: 3
**Decisions locked**: 3

被删的 `.detail-panel`(main.tsx:404-506) 原承载 8 类内容；Next Choices 已由 Q1.2 决定上画布。剩余 7 类需逐一定去向，其中推荐证据簇受上一轮 grill 锁定决策 #6（MUST 保存推荐证据=reasons+sourceRefs，不只命令链或全 UI 快照）硬约束，不可静默丢弃。

### Q2.1: 推荐证据簇的去向（受上轮决策 #6 硬约束）

**Question**: 被删 detail-panel 的推荐证据簇（Recommended Command 卡 main.tsx:409-413、Purpose/Input/Output/Next Action 的 dl main.tsx:415-424、Alternatives main.tsx:449-459、Source Status/citations main.tsx:461-470）受上轮决策 #6 约束 MUST 保存。在"只有大画布"模型里怎么承载？

**Answer**: 节点 popover 按需调出——节点承载完整证据，点击/悬停节点弹轻量 popover 或侧拉抽屉显示该节点 command+condition+Purpose/Input/Output/Next Action+Alternatives+Source Status；主画布常驻只有节点框+导航分支。

**Evidence**: `src/main.tsx:404-470`（证据簇原位置）、`src/main.tsx:326-330`（activateNode 选中语义可复用为 popover 触发）、上轮 grill 决策 #6（MUST 保存 reasons+sourceRefs）、`src/main.tsx:461-470`（Source Status 已是 per-step citations，天然可挂到节点）。

**Decision**: locked

**Constraint**: 推荐证据簇 MUST 由对应节点承载，通过节点交互（点击/悬停）弹出 popover/抽屉显示完整证据；主画布常驻视图 MUST 只含节点框与导航分支，不得常驻任何证据文字。证据数据本身（command/condition/purpose/input/output/nextAction/alternatives/citations）MUST 保留在数据模型中供 popover 渲染，满足决策 #6。

**Downstream implication**: popover 的触发交互（click vs hover）、位置（节点旁/侧拉/居中）、与节点选中(activateNode)的关系，待 Branch 3/4 细化；Selected Node 标题+purpose(main.tsx:405-407) 并入 popover 头部。

### Q2.2: Continuation Routes 的去向

**Question**: `.detail-panel` 的 Continuation Routes(main.tsx:472-485) 在 terminal 节点显示 stop/quality/knowledge 三条路线选择，本质是导航（与 Next Choices 同质，发生在闭合点）。Q1.2 已把 Next Choices 上画布，Continuation Routes 怎么处理？

**Answer**: 上画布为分支选项——terminal 节点发出 stop/quality/knowledge 三条分支选项作为可点击边/小卡，与 Next Choices 导航模型统一，无特例。

**Evidence**: `src/main.tsx:472-485`（Continuation Routes 原位置）、`src/main.tsx:234-250`（terminal-routes step 的 choices 已是 routeId 形式，可直接复用为画布分支）、`src/main.tsx:261-265`（continuationRoutes 数据定义）、Q1.2 决策（导航上画布统一原则）。

**Decision**: locked

**Constraint**: Continuation Routes MUST 作为 terminal 节点的画布分支选项呈现，与 Next Choices 共用同一套"活动节点发出可点击分支"的导航机制；MUST NOT 作为独立面板或 popover 内按钮存在。`terminalRoutes` 数据(main.tsx:63) MUST 保留以驱动分支渲染。

**Downstream implication**: quality/knowledge 分支选中后是"结束本轮"还是"展开下游 pipeline 节点"？上轮 grill 决策 #10（逐步展开+并行分支）与本项目 Out of Scope（不改 Maestro CLI 语义）提示 MVP 阶段 branch 选中即标记路线、不展开 pipeline 内部——待 Branch 4 与上轮决策对齐确认。

### Q2.3: Validation Checklist 的去向

**Question**: `.detail-panel` 的 Validation Checklist(main.tsx:487-505) 是 3 个交互 checkbox（"我能说出当前推荐 command 及其原因"等），state 存在 `checkedItems`(main.tsx:310)。纯自检、非导航、非证据。detail-panel 删后怎么处理？

**Answer**: 并入节点 popover——作为活动节点 popover 内证据下方的自检区，`checkedItems` state 按 step 保留。

**Evidence**: `src/main.tsx:487-505`（checklist 原位置）、`src/main.tsx:310`（checkedItems state）、`src/main.tsx:266-270`（checklist 数据定义）、Q2.1 决策（popover 承载节点附属信息）。

**Decision**: locked

**Constraint**: Validation Checklist MUST 并入活动节点 popover，置于证据簇下方；`checkedItems` state MUST 保留并按 step 维度记录自检结果；MUST NOT 作为独立常驻控件留在主画布。

**Branch 2 状态模型小结（综合 Q2.1-Q2.3 + Q1.2）**: detail-panel 删除后，画布状态 = `{ activeStepId, selectedNodeId, checkedItems(按step), pan/zoom transform, 持久化 route history/favorites(决策#5) }`；节点数据模型 `ScenarioNode`/`ScenarioStep` 保留全部字段，渲染分流为「画布常驻(节点框+导航分支)」与「popover 按需(证据+自检)」两路。

---

## Branch 3: Edge Cases & Failure Modes

**Status**: ✅ Done
**Questions asked**: 3
**Decisions locked**: 3

可平移缩放画布引入一组经典 UX 边缘冲突：拖拽平移 vs 节点点击 vs popover 触发的手势歧义；空态/初始态；popover 在视口边缘溢出；小屏 hero 与画布争抢空间。

### Q3.1: 手势冲突消歧 + popover 触发方式（解 B2 遗留）

**Question**: 可平移缩放画布上，拖拽平移 vs 节点点击 vs popover 触发三者争手势。popover 用 hover 则拖拽经过节点误弹；用 click 则 click 与拖拽起始点难辨。如何消歧？（此题同时锁定 popover 触发方式）

**Answer**: 右键弹出 popover——节点 `onContextMenu` 触发 popover 显示完整证据+自检；左键 click 保留为节点选中(activateNode 语义)；平移用左键拖拽（与节点 click 用位移阈值区分）；缩放用滚轮/双指。

**Evidence**: `src/main.tsx:388`（当前 onClick）、`src/main.tsx:389-394`（onKeyDown Enter/Space）、`src/main.tsx:326-330`（activateNode 选中语义）、Q2.1 决策（popover 承载证据+自检）。

**Decision**: locked

**Constraint**: 
- popover MUST 由节点 `onContextMenu`（右键/长按）触发，MUST NOT 用 hover（避免拖拽误触）或左键 click（让出给选中）。
- 左键 click MUST 保留节点选中语义（activateNode）；左键拖拽 MUST 触发平移；二者 MUST 用位移阈值区分（< N px 视为 click，≥ N px 视为 pan）。
- 缩放 MUST 用滚轮（桌面）/ 双指捏合（触控）。
- 右键菜单 MUST `preventDefault` 浏览器默认菜单；popover 内的 Next Choices / Continuation Routes 导航分支仍走 Q1.2/Q2.2 的画布分支机制（不在 popover 内做导航）。

**Downstream implication (open)**: 位移阈值 N 的具体值、触屏长按时长阈值、缩放范围(min/max)、平移边界（能否拖到完全空白）留实现细节，不阻塞 grill。

### Q3.2: hero 与画布争抢视口空间 + 全屏切换

**Question**: Q1.1 锁定保留 hero(h1+hero-copy)，Q1.3 锁定画布铺满 hero 以下到视口底。但小屏上 hero 会占去可观高度，压缩画布。hero 怎么处理？

**Answer**: hero 常驻顶部、画布占满 hero 以下；额外加一个右上角悬浮、透明样式的全屏按钮，点击进入画布全屏模式（hero 隐藏），再点退出。

**Evidence**: Q1.1（保留 hero）、Q1.3（画布铺满 hero 以下）、`src/styles.css:34-37`（.hero 现样式）、`src/main.tsx:334-340`（hero 区）。全屏能力映射浏览器 Fullscreen API 或内部状态切换。

**Decision**: locked

**Constraint**: 
- hero MUST 常驻顶部，画布容器 MUST 占满 hero 下边缘到视口底部。
- MUST 提供一个右上角悬浮、透明样式的全屏按钮，点击切换"画布全屏"模式（hero 隐藏，画布占满整个视口）；再点退出回常驻模式。
- 全屏按钮 MUST 悬浮于画布之上（z-index 高于画布），透明样式不破坏"只有大画布"的视觉纯净。
- 全屏模式状态 MUST 纳入画布状态模型（与 pan/zoom transform 同级）。

**Downstream implication (open)**: 全屏按钮的具体图标/无障碍标签、全屏模式下场景上下文(已随 diagram-header 移除)是否需在全屏内补回轻量提示，留实现。

### Q3.3: 画布空态/初始态

**Question**: 当前 main.tsx:307-309 初始状态是加载即有节点（activeStepId=steps[0].id）。上轮 grill 决策#1锁定"重写为规则驱动画布"且场景选择需重构（中心初始节点让用户选场景类型）。新满屏画布的初始态是什么？

**Answer**: 空画布 + 中心初始场景选择节点 + 引导文案——画布初始为空，中央放置一个场景选择起始节点，配引导文案（如"选择场景开始"），用户选中场景后才逐步展开后续节点。

**Evidence**: `src/main.tsx:307-309`（当前初始态）、上轮 grill 决策#1（规则驱动画布+场景重构）、上轮 grill Discovery（中心初始节点选场景类型）、Q1.2（导航上画布）、Q1.3（可平移缩放大画布）。

**Decision**: locked

**Constraint**: 
- 画布初始态 MUST 为空（无预渲染场景节点），中央放置唯一场景选择起始节点 + 引导文案。
- 场景选择节点选中后 MUST 按上轮决策#10（逐步展开）从该节点发出后续分支节点，MUST NOT 一次性渲染全场景。
- 引导文案 MUST 在用户完成首次场景选择后消失（或淡出）。

**Downstream implication (open)**: 场景类型枚举（上轮提到的"新项目初始化/新需求实现/源码探索QA/加测试"）由上轮决策#2(maestro-help catalog)驱动，具体枚举留 Branch 4/实现。

---

## Branch 4: Integration & Dependencies

**Status**: ✅ Done
**Questions asked**: 3
**Decisions locked**: 3

本轮布局诉求与上一轮 grill（GRL-20260628-canvas-node-scenario-redesign）的 12 条锁定决策必须对齐，尤其决策#1（规则驱动画布重写）、#5（持久化 route history/favorites）、#6（保存推荐证据）、#10（逐步展开+并行分支）。同时核验与项目 M1 已完成代码、M2 plan 的依赖关系。

### Q4.1: 本轮重写与 M1/M2 的关系

**Question**: M1(src/main.tsx 520行)已审计通过。上轮 grill 决策#1锁定"重写为规则驱动画布而非侧栏改皮肤"，M2 plan(PLN-002)已存在。本轮锁定的满屏画布+popover+导航上画布是独立重写还是并入 M2？

**Answer**: 并入 M2 画布重构，替换 M1——本轮锁定的布局/交互重写是 M2 画布重构的一部分，与上轮决策#1 合并为同一 M2 实现；M1 代码(src/main.tsx 全部)被替换，不保留向后兼容。

**Evidence**: `.workflow/state.json`（M2 active, PLN-002 存在）、上轮 grill 决策#1（规则驱动画布重写）、`src/main.tsx:306-510`（M1 App 全部）、`.workflow/project.md:66-69`（Phase 2 决策记录）。

**Decision**: locked

**Constraint**: 
- 本轮所有布局/交互决策 MUST 并入 M2 画布重构（PLN-002 范围内），与上轮决策#1 合并为单一 M2 实现。
- M1 的 `src/main.tsx` App 组件及关联 styles MUST 被替换，MUST NOT 保留向后兼容分支。
- M1 的数据模型 `ScenarioModel`/`ScenarioNode`/`ScenarioStep`(main.tsx:14-76) 字段 MUST 保留（供 popover/导航/证据渲染），仅渲染层重写。

**Downstream implication (open)**: 替换 M1 意味着 M1 的测试(main.test.tsx 49行, E2E)需同步重写——属 M2 执行阶段任务，非 grill 范围。PLN-002 的 task 列表需据此调整。

### Q4.2: 并行分支视觉布局（解上轮决策#10遗留 open question）

**Question**: 上轮 grill 决策#10锁定"逐步展开+支持并行分支"，但视觉布局(tree/swimlane/auto-layout)留为 open。本轮满屏可平移缩放画布正好提供解决空间。Alternatives(main.tsx:449-459)是并行分支的数据源。并行分支怎么画？

**Answer**: 水平主线+上下分支（泳道感）——主路径沿水平轴向右展开，备选/并行分支向上下偏移伸出；选中后高亮主线，未选分支以次级样式呈现。

**Evidence**: `src/main.tsx:449-459`（Alternatives 数据源）、`src/main.tsx:82-154`（当前节点 x/y 硬编码，已是水平走向：intent x70→brainstorm x320→blueprint x570→analyze x820，plan/done 在 y340 下排）、上轮 grill 决策#10（逐步展开+并行分支）、上轮 grill open question（tree/swimlane/auto-layout）、Q1.3（可平移缩放大画布提供纵向空间）。

**Decision**: locked

**Constraint**: 
- 主路径节点 MUST 沿水平轴向右展开，主路径节点 y 坐标对齐。
- 备选/并行分支（源自 `alternatives` 字段 main.tsx:61）MUST 从主路径节点向上下偏移伸出，形成泳道感。
- 选中的主线分支 MUST 高亮，未选分支 MUST 以次级样式（低饱和/细描边）呈现。
- 节点坐标 MUST 由布局算法计算（非硬编码），但 MUST NOT 引入图形布局库（保持项目"无图形库"约束）；可用简单几何规则（主线等距右移、分支按上下交替偏移定量）。
- 此决策同时关闭上轮 grill 的 open question「tree/swimlane/auto-layout」→ 选定 swimlane 变体。

**Downstream implication (open)**: 分支偏移量、主线间距、多级嵌套分支（分支的分支）的视觉处理留 Branch 5/实现。

### Q4.3: 场景上下文标签去向（关闭 B1/B2 deferred 项）

**Question**: Q1.1 锁定移除 diagram-header 的 h2(scenario.title)/scenario-summary/status-pill。但用户需知道"当前在哪个场景"。上轮 grill 决策#1 要求场景选择重构。场景上下文标签放哪里？

**Answer**: 画布左上角轻量悬浮标签——与右上角全屏按钮对称，透明样式，显示当前选中场景类型；场景切换时更新。

**Evidence**: Q1.1（移除 diagram-header）、Q3.2（右上角悬浮全屏按钮，对称设计）、`src/main.tsx:347-350`（原 h2/summary/status-pill 数据源 scenario.title/id/summary）、上轮 grill 决策#1（场景选择重构）。

**Decision**: locked

**Constraint**: 
- 场景上下文 MUST 作为画布左上角轻量悬浮标签呈现，与右上角全屏按钮对称，透明样式不破坏"只有大画布"视觉纯净。
- 标签内容 MUST 至少含当前场景标识（scenario.id 或 title）；status-pill 的 scenario.id(main.tsx:350) 可并入标签。
- 标签 MUST 在场景切换时更新；初始空态（Q3.3）下标签显示"未选择场景"或隐藏。

**此决策关闭 B1/B2 deferred 项「场景上下文标签去向」。**

---

## Branch 5: Scale & Performance

**Status**: ✅ Done
**Questions asked**: 2
**Decisions locked**: 2

满屏可平移缩放画布的扩展性关注点：节点数量增长（上轮决策#10逐步展开+并行分支可累积大量节点）、SVG 渲染性能、popover 渲染开销、持久化 route history/favorites（决策#5）的存储规模。

### Q5.1: 节点数量增长的渲染策略

**Question**: 上轮决策#10（逐步展开+并行分支）可累积大量节点。当前 SVG(main.tsx:353) 全量渲染所有 nodes(main.tsx:374-399)。满屏可平移缩放画布上，节点多了怎么保证性能？

**Answer**: 视口裁剪虚拟化——只渲染当前视口可见区域内的节点，视口外的节点不绘制；平移/缩放时动态加载进入视口的节点。

**Evidence**: `src/main.tsx:353`（当前 SVG 全量渲染）、`src/main.tsx:374-399`（nodes.map 全量）、Q1.3（可平移缩放，有 transform 矩阵可算视口范围）、上轮决策#10（逐步展开+并行分支）、`src/main.tsx:84-154`（节点 x/y 坐标可用于视口裁剪判断）。

**Decision**: locked

**Constraint**: 
- 画布渲染 MUST 实现视口裁剪虚拟化：仅渲染 transform 矩阵映射后落在当前视口内的节点（含少量缓冲边距）。
- 平移/缩放变换时 MUST 动态计算可见节点集，进入视口的节点即时加载，离开的卸载。
- 视口裁剪 MUST 基于节点坐标(x/y)与 transform 矩阵的几何运算，MUST NOT 依赖图形库。
- 此约束同时关闭 B1 deferred 项「节点坐标体系」→ 节点保留绝对 x/y 坐标（供裁剪判断），布局由 Q4.2 的几何规则计算。

**Downstream implication (open)**: 视口缓冲边距、虚拟化的节流策略（平移时的渲染节流）留实现。

### Q5.2: route history/favorites 持久化存储（对齐上轮决策#5）

**Question**: 上轮决策#5锁定"浏览器持久化 route history(有上限)+favorites(无上限)"，决策#6要求每条存推荐证据不存坐标。存储用什么机制？

**Answer**: localStorage + 上限 FIFO——route history 用 localStorage 存，recent routes 上限（如 20 条）FIFO 淘汰，favorites 不上限；每条存推荐证据（reasons+sourceRefs，决策#6）不存画布坐标。

**Evidence**: 上轮 grill 决策#5（持久化 history 上限+favorites 无上限）、上轮 grill 决策#6（存推荐证据不存坐标）、`src/main.tsx:310`（现有 checkedItems state 示范浏览器内存状态）、Q2.1（证据数据模型保留）。

**Decision**: locked

**Constraint**: 
- route history MUST 用 localStorage 持久化；recent routes MUST 有上限（建议 20 条），超限 FIFO 淘汰；favorites 无上限。
- 每条 route MUST 存推荐证据（scenario choice、selected command nodes、primary/secondary recommendations、recommendation reasons、sourceRefs、name、createdAt，对齐决策#6），MUST NOT 存画布绝对坐标。
- 存储读写 MUST 容错（localStorage 配额超限/禁用时降级为会话内存）。

**Branch 5 完成。所有 5 个 branch 已走完。**

---

## Branch Log

| # | Branch | Status | Decisions | Open Questions |
|---|--------|--------|-----------|----------------|
| 1 | Scope & Boundaries | ✅ Done | 3 (Q1.1-Q1.3) | — (节点坐标体系 closed by Q5.1) |
| 2 | Data Model & State | ✅ Done | 3 (Q2.1-Q2.3) | — (quality/knowledge 展开 closed by Q4.1) |
| 3 | Edge Cases & Failure Modes | ✅ Done | 3 (Q3.1-Q3.3) | 实现细节(位移/缩放/平移阈值) |
| 4 | Integration & Dependencies | ✅ Done | 3 (Q4.1-Q4.3) | 分支偏移量/多级嵌套(实现)；M1测试重写(M2执行) |
| 5 | Scale & Performance | ✅ Done | 2 (Q5.1-Q5.2) | 视口缓冲边距/节流(实现) |

**总计**: 14 Q&A，14 decisions locked，0 open（所有跨 branch deferred 项已关闭；剩余均为实现细节，非 grill 范围）。

---

## Synthesis

### Decision Summary

| # | Decision | Status | Branch | RFC 2119 |
|---|----------|--------|--------|----------|
| 1 | 顶部只保留 hero(h1+hero-copy)，移除 diagram-header 的 h2/summary/status-pill | locked | Scope | MUST / MUST NOT |
| 2 | detail-panel 整体移除；Next Choices 迁移为活动节点发出的画布分支选项；activateNode 保留为选中 | locked | Scope | MUST / MUST NOT |
| 3 | 画布真铺满 hero 以下视口 + 可平移缩放虚拟大面；移除 1180px 上限与 56px padding；替换固定 viewBox | locked | Scope | MUST |
| 4 | 推荐证据簇由节点 popover 承载，主画布只含节点框+导航分支 | locked | Data Model | MUST / MUST NOT |
| 5 | Continuation Routes 上画布为 terminal 节点分支选项，与 Next Choices 统一 | locked | Data Model | MUST / MUST NOT |
| 6 | Validation Checklist 并入节点 popover，checkedItems 按 step 保留 | locked | Data Model | MUST / MUST NOT |
| 7 | popover 由节点 onContextMenu(右键)触发；左键 click 选中；左键拖拽平移(位移阈值区分)；滚轮缩放 | locked | Edge Cases | MUST / MUST NOT |
| 8 | hero 常驻顶部 + 右上角悬浮透明全屏按钮切换画布全屏 | locked | Edge Cases | MUST |
| 9 | 画布初始态为空 + 中心场景选择起始节点 + 引导文案；逐步展开 | locked | Edge Cases | MUST / MUST NOT |
| 10 | 本轮重写并入 M2 画布重构，替换 M1，不保留向后兼容；数据模型字段保留 | locked | Integration | MUST / MUST NOT |
| 11 | 并行分支水平主线+上下偏移(泳道感)；选中高亮主线；不引入图形库 | locked | Integration | MUST / MUST NOT |
| 12 | 场景上下文作画布左上角悬浮标签，与全屏按钮对称 | locked | Integration | MUST |
| 13 | 视口裁剪虚拟化渲染；仅渲染可见节点；基于坐标+transform 几何运算 | locked | Scale | MUST / MUST NOT |
| 14 | route history 用 localStorage，recent 上限 FIFO(20条)，favorites 无上限；存证据不存坐标；容错降级 | locked | Scale | MUST / MUST NOT / SHOULD |

### Verified Constraints

14 条 locked 决策均有代码证据（`file:line`）或上轮 grill 锁定决策支撑，无纯推断项。关键交叉验证：
- 决策#4(证据入 popover) 满足上轮决策#6(MUST 保存推荐证据)
- 决策#9(空态+场景选择节点) 对齐上轮决策#1(规则驱动画布重写)
- 决策#11(泳道感) 关闭上轮 open question「tree/swimlane/auto-layout」
- 决策#13(视口裁剪) 关闭本会话 B1 deferred「节点坐标体系」(保留绝对 x/y 供裁剪)
- 决策#14(localStorage) 对齐上轮决策#5(持久化 history/favorites)

### Open Questions

无 grill 范围内的 open question。以下为实现细节，留 M2 执行阶段：
- 手势位移阈值 N、触屏长按时长、缩放 min/max、平移边界
- 视口裁剪缓冲边距、平移渲染节流策略
- 分支偏移量、主线间距、多级嵌套分支视觉
- 全屏按钮图标与无障碍标签
- 场景类型枚举（由上轮决策#2 maestro-help catalog 驱动）
- M1 测试(main.test.tsx + E2E)同步重写

### Risk Register

| # | Risk | Branch | Severity | Mitigation |
|---|------|--------|----------|------------|
| 1 | 右键触发 popover 在触屏设备无右键——需长按替代，触屏体验待验证 | Edge Cases | Medium | 实现时触屏长按 ≥500ms 映射到 onContextMenu；M2 测试覆盖触屏 |
| 2 | 视口裁剪虚拟化在快速平移时可能出现节点闪烁/延迟 | Scale | Medium | 实现时加缓冲边距 + requestAnimationFrame 节流 |
| 3 | 替换 M1 代码导致 M1 测试(main.test.tsx 49行 + E2E)全部失效 | Integration | Medium | M2 执行阶段同步重写测试，PLN-002 task 列表需调整 |
| 4 | localStorage 配额超限(favorites 无上限)可能写入失败 | Scale | Low | 决策#14 已含容错降级到会话内存；后续可加配额预警 |
| 5 | 水平主线+上下分支在深路径(>5级嵌套)时纵向空间不足 | Integration | Low | Q1.3 可平移缩放提供纵向空间；Branch 5 视口裁剪支持大画布 |
| 6 | 场景选择起始节点 + 引导文案的初始态与上轮决策#2(maestro-help catalog)场景枚举耦合，catalog 未就绪时 MVP 需 mock | Edge Cases | Medium | MVP 用模拟场景枚举(对齐上轮决策#8 模拟 state)，catalog 后接 |

### Recommended Next Step

本轮 grill 已锁定 14 条布局/交互决策，且与上轮 grill 12 条决策完全对齐、关闭了上轮 2 个 open question。scope 已清晰，且本轮属于 M2 画布重构的细化（决策#10 已并入 M2）。

**建议路径**: 范围已清晰且并入既有 M2 plan → 直接更新 M2 执行计划。可选：
- `/maestro-plan` 修订 PLN-002，纳入本轮 14 条约束
- `/maestro-execute` 直接进入 M2 执行（plan 已存在，本轮为细化）
- 若需先做多角色方案探讨：`/maestro-brainstorm "满屏画布布局重写" --from grill:GRL-20260628-fullscreen-canvas-layout`
