# Terminology

候选术语来自用户诉求（"大画布 / 顶部标题 / 项目简介 / 页面布局 / 铺满屏幕 / 节点 / 交互逻辑"）与代码现状。冲突项将在 Branch 1 质询中逐一消解。

| Term | Definition (proposed) | Code Reference | Conflict? | Resolution |
|------|----------------------|----------------|-----------|------------|
| 大画布 (canvas) | 占据视口主体、可平移缩放、承载节点图的虚拟大面（非固定 viewBox SVG） | `<svg viewBox="0 0 1080 520">` @ `src/main.tsx:353`（将被替换）；`.app-shell` @ `styles.css:28`（max-width 将移除） | locked Q1.3: 可平移缩放虚拟大面，填满 hero 以下视口 |
| 顶部标题 (top title) | 页面顶部的标题文字 | `h1` @ `.hero` `src/main.tsx:336`；另有 `h2` @ `.diagram-header` `src/main.tsx:347` | 是 — 代码有两处"标题" | locked Q1.1: 保留 hero h1，移除 diagram-header h2 |
| 项目简介 (project intro) | 站点/产品的一句话说明 | `hero-copy` @ `src/main.tsx:338`；另有 `scenario-summary` @ `src/main.tsx:348` | 是 — hero-copy 是站点简介，scenario-summary 是场景描述，语义不同 | locked Q1.1: 保留 hero-copy，移除 scenario-summary |
| 页面布局 (page layout) | 标题/简介之外的容器与分区（本轮全部移除） | `.app-shell` `styles.css:28`；`.workspace` `styles.css:78`；`.detail-panel` `main.tsx:404` | locked Q1.1/Q1.2/Q4.1: 仅保留 hero+画布，detail-panel/diagram-header/workspace 全删，仅左上场景标签+右上全屏按钮悬浮 |
| 铺满屏幕 (fill screen) | 画布横向占满视口宽度、纵向占满 hero 以下到视口底，可全屏切换 | `.app-shell` `max-width:1180px` `styles.css:29`（将移除）；`padding:56px 0`（将移除） | locked Q1.3+Q3.2: 真铺满+可平移缩放，右上角悬浮按钮切换全屏 |
| 节点 (node) | 画布上的可点击方块，代表一个命令/步骤 | `ScenarioNode` type @ `src/main.tsx:14`；`.node` class `styles.css:140` | 否 — 语义一致 | aligned |
| 交互逻辑 (interaction logic) | 节点右键弹 popover、左键选中、左键拖拽平移、滚轮缩放、画布分支推进 step | `activateNode` @ `main.tsx:326`（保留为选中）；`.choice-button onClick` @ `main.tsx:433`（迁移到画布分支 Q1.2） | locked Q3.1+Q1.2+Q2.2: 右键 popover/左键选中+平移/滚轮缩放/导航上画布 |
| 推荐证据 (recommendation evidence) | 为何推荐某命令的理由+来源，由节点 popover 承载 | 上一轮 grill 决策 #6；原散落在 detail-panel `main.tsx:415-470`（迁移到 popover Q2.1） | locked Q2.1: 节点 onContextMenu 弹 popover 显示，主画布不常驻 |
| 步进导航 (stepwise navigation) | 沿场景路径逐步推进 step 的能力，通过活动节点发出的画布分支选项驱动 | `.choice-button` `main.tsx:426-447`（原唯一驱动，迁移到画布分支） | locked Q1.2+Q2.2: Next Choices/Continuation Routes 统一上画布为分支选项 |

**候选术语数**：9（≥5 要求满足）。冲突项将在 Branch Walking 中随答案更新 status 为 locked。
