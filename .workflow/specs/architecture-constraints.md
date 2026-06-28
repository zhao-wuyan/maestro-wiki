---
title: "Architecture Constraints"
readMode: required
priority: high
category: arch
keywords:
  - architecture
  - module
  - layer
  - boundary
  - dependency
  - structure
---

# Architecture Constraints

## Module Structure

## Layer Boundaries

## Dependency Rules

## Technology Constraints

## Entries



<spec-entry category="arch" keywords="canvas,layout,hero" date="2026-06-28" title="满屏画布布局-顶部仅保留hero" description="满屏画布重构:顶部保留集" source="finish-work">

### 满屏画布布局-顶部仅保留hero

页面顶部 MUST 只保留 .hero 的 h1+hero-copy(站点标题和简介)；.diagram-header 的 h2/scenario-summary/status-pill MUST 移除。证据: src/main.tsx:334-340(hero), src/main.tsx:344-351(diagram-header)。来源: GRL-20260628-fullscreen-canvas-layout Q1.1

</spec-entry>

<spec-entry category="arch" keywords="canvas,navigation,detail-panel" date="2026-06-28" title="满屏画布-detail-panel移除导航上画布" description="导航上画布统一机制" source="finish-work">

### 满屏画布-detail-panel移除导航上画布

删除整个 .detail-panel(390px 右栏)；Next Choices MUST 迁移为活动节点发出的可点击画布分支选项；activateNode 选中语义 MUST 保留。证据: src/main.tsx:404-506, src/main.tsx:426-447(choice-button onClick 步进驱动), src/main.tsx:326-330(activateNode)。来源: GRL-20260628-fullscreen-canvas-layout Q1.2

</spec-entry>

<spec-entry category="arch" keywords="canvas,fullscreen,pan-zoom" date="2026-06-28" title="满屏画布-真铺满可平移缩放" description="真铺满+可平移缩放虚拟大面" source="finish-work">

### 满屏画布-真铺满可平移缩放

.app-shell max-width:1180px 与 padding:56px 0 MUST 移除；画布 MUST 横向占满视口、纵向占满 hero 以下到视口底；固定 viewBox 1080x520 MUST 替换为可动态调整坐标系(含 pan/zoom transform)。证据: src/styles.css:28-32, src/main.tsx:353。来源: Q1.3

</spec-entry>

<spec-entry category="arch" keywords="fullscreen,hero,canvas" date="2026-06-28" title="画布全屏切换按钮" description="右上角悬浮全屏切换" source="finish-work">

### 画布全屏切换按钮

hero MUST 常驻顶部；MUST 提供右上角悬浮透明全屏按钮切换画布全屏模式(hero 隐藏)；全屏状态 MUST 纳入画布状态模型。证据: src/styles.css:34-37, src/main.tsx:334-340。来源: Q3.2

</spec-entry>

<spec-entry category="arch" keywords="empty-state,scenario-selection,canvas" date="2026-06-28" title="画布空态初始场景选择节点" description="空态+场景选择+逐步展开" source="finish-work">

### 画布空态初始场景选择节点

画布初始态 MUST 为空+中心场景选择起始节点+引导文案；选中后 MUST 逐步展开(决策#10)；MUST NOT 一次性渲染全场景；引导文案首次选择后消失。对齐上轮决策#1。证据: src/main.tsx:307-309。来源: Q3.3

</spec-entry>

<spec-entry category="arch" keywords="m2,m1,replacement,integration" date="2026-06-28" title="满屏画布并入M2替换M1" description="并入M2替换M1保留数据模型" source="finish-work">

### 满屏画布并入M2替换M1

本轮布局/交互决策 MUST 并入 M2 画布重构(PLN-002)与上轮决策#1 合并；M1 App 及 styles MUST 被替换不保留向后兼容；数据模型字段 ScenarioModel/ScenarioNode/ScenarioStep MUST 保留仅渲染层重写。证据: .workflow/state.json, src/main.tsx:14-76, src/main.tsx:306-510。来源: Q4.1

</spec-entry>

<spec-entry category="arch" keywords="branch,swimlane,layout" date="2026-06-28" title="并行分支水平主线泳道布局" description="泳道变体关闭上轮open question" source="finish-work">

### 并行分支水平主线泳道布局

主路径 MUST 沿水平轴右展 y 对齐；备选/并行分支 MUST 上下偏移(泳道感)；选中高亮主线未选次级样式；坐标 MUST 几何规则计算 MUST NOT 引入图形库。关闭上轮 open question tree/swimlane/auto-layout。证据: src/main.tsx:449-459, src/main.tsx:82-154。来源: Q4.2

</spec-entry>

<spec-entry category="arch" keywords="scenario-label,floating,canvas" date="2026-06-28" title="场景上下文左上角悬浮标签" description="diagram-header移除后场景上下文去向" source="finish-work">

### 场景上下文左上角悬浮标签

场景上下文 MUST 作画布左上角轻量悬浮标签与右上角全屏按钮对称透明样式；标签至少含场景标识；场景切换更新；空态隐藏或显示未选择。证据: src/main.tsx:347-350。来源: Q4.3

</spec-entry>