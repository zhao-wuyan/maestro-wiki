---
title: "Coding Conventions"
readMode: required
priority: high
category: coding
keywords:
  - style
  - naming
  - import
  - pattern
  - convention
  - formatting
---

# Coding Conventions

## Formatting

## Naming

## Imports

## Patterns

## Entries



<spec-entry category="coding" keywords="popover,evidence,recommendation" date="2026-06-28" title="节点popover承载推荐证据" description="证据入popover画布纯净" source="finish-work">

### 节点popover承载推荐证据

推荐证据簇(Recommended Command/Purpose/Input/Output/Next Action/Alternatives/Source Status) MUST 由节点 onContextMenu 弹 popover 显示；主画布常驻 MUST 只含节点框+导航分支；证据数据 MUST 保留在数据模型。对齐上轮决策#6。证据: src/main.tsx:404-470。来源: Q2.1

</spec-entry>

<spec-entry category="coding" keywords="continuation-routes,terminal,navigation" date="2026-06-28" title="Continuation Routes上画布分支" description="闭合路线导航统一" source="finish-work">

### Continuation Routes上画布分支

terminal 节点 stop/quality/knowledge 路线 MUST 作为画布分支选项与 Next Choices 统一；MUST NOT 作独立面板或 popover 内按钮；terminalRoutes 数据 MUST 保留。证据: src/main.tsx:472-485, src/main.tsx:261-265。来源: Q2.2

</spec-entry>

<spec-entry category="coding" keywords="checklist,popover,state" date="2026-06-28" title="Validation Checklist入popover" description="自检入popover按step保留" source="finish-work">

### Validation Checklist入popover

Validation Checklist MUST 并入活动节点 popover 证据簇下方；checkedItems state MUST 按 step 保留；MUST NOT 作独立常驻控件。证据: src/main.tsx:487-505, src/main.tsx:310。来源: Q2.3

</spec-entry>

<spec-entry category="coding" keywords="gesture,popover,right-click,pan" date="2026-06-28" title="右键popover手势消歧" description="pan/click/hover手势消歧" source="finish-work">

### 右键popover手势消歧

popover MUST 由节点 onContextMenu(右键/长按)触发 MUST NOT 用 hover 或左键 click；左键 click 选中、左键拖拽平移(位移阈值区分)、滚轮缩放；右键菜单 MUST preventDefault。证据: src/main.tsx:388-394。来源: Q3.1

</spec-entry>

<spec-entry category="coding" keywords="viewport,virtualization,performance" date="2026-06-28" title="画布视口裁剪虚拟化" description="视口裁剪虚拟化渲染" source="finish-work">

### 画布视口裁剪虚拟化

画布 MUST 视口裁剪虚拟化仅渲染 transform 矩阵映射后落在视口内的节点(含缓冲边距)；平移缩放时动态计算可见集加载/卸载；MUST 基于坐标+transform 几何运算 MUST NOT 依赖图形库；节点保留绝对 x/y 供裁剪。关闭 B1 deferred 节点坐标体系。证据: src/main.tsx:353, src/main.tsx:374-399, src/main.tsx:84-154。来源: Q5.1

</spec-entry>

<spec-entry category="coding" keywords="localstorage,route-history,persistence" date="2026-06-28" title="route history localStorage持久化" description="localStorage+上限FIFO对齐决策#5/#6" source="finish-work">

### route history localStorage持久化

route history MUST 用 localStorage；recent routes 上限(20条)FIFO 淘汰 favorites 无上限；每条 MUST 存推荐证据(scenario choice/commands/reasons/sourceRefs/name/createdAt)MUST NOT 存画布坐标；读写 MUST 容错降级会话内存。对齐上轮决策#5/#6。证据: src/main.tsx:310。来源: Q5.2

</spec-entry>