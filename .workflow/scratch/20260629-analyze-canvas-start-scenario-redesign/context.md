# Context: 初始场景改造 — 支持多入口场景

**Date**: 2026-06-29
**Session**: ANL-canvas-start-scenario-redesign-2026-06-29
**Scope**: adhoc (macro mode)
**Areas discussed**: 数据模型选型, MVP场景范围, state重构, 场景选择UI, 规则系统接入

## Decisions

### Decision 1: ScenarioRegistry模型选型
- **Context**: 单场景硬编码(unclearRequirementsScenario)无法支持多入口,需选数据模型
- **Options**:
  1. ScenarioRegistry(预定义场景表,fit=4)
  2. 动态生成(按state实时生成ScenarioModel,fit=2)
  3. 规则路由(recommendCommands直接分流,fit=1)
- **Chosen**: ScenarioRegistry
- **Reason**: 数据契约已验证(nodeLayout/activeBranches/popover均依赖ScenarioModel且通过TASK-002/003测试),改动面最小,与grill Q4.1(数据模型保留)兼容,catalog.paths 1:1映射

### Decision 2: MVP 3场景 A+D+F
- **Context**: catalog.paths有6条入口(A-F),MVP需选子集
- **Options**:
  1. A+D+F(3场景,覆盖新项目/小修复/探索)
  2. A+D(2场景,缺探索)
  3. 仅A(1场景,不验证多场景机制)
  4. A+D+F+E(4场景,E无现成rule)
- **Chosen**: A+D+F
- **Reason**: A复用现有(改动最小),D/F短链(3步/2步),覆盖三大入口,E/B/C延后

### Decision 3: 路径2统一selector节点
- **Context**: 空态场景选择UI设计——每场景自带intent节点 vs 统一selector
- **Options**:
  1. 路径1(每场景自带intent节点,nodes[0]约定)
  2. 路径2(统一selector节点,空态渲染独立选择器)
- **Chosen**: 路径2
- **Reason**: 绕开nodes[0]约定风险(D/F场景nodes[0]不一定是intent),与guidance-overlay兼容,改动更小

### Decision 4: SimulatedProjectState扩展taskType
- **Context**: 当前7字段无法区分D/E/F入口
- **Options**:
  1. 扩展taskType: 'new'|'continue'|'bugfix'|'explore'
  2. 新增独立scenarioSelector字段
- **Chosen**: 扩展taskType
- **Reason**: 直接映射场景选择(new→A,bugfix→D,explore→F),类型扩展最小

## Constraints

### Locked
1. **ScenarioRegistry模型**: 新建`scenarioRegistry: ScenarioModel[]`,App()按`selectedScenarioId`查找(替代src/main.tsx:764硬编码)
2. **MVP 3场景**: A_full_project(复用unclearRequirementsScenario)+D_small_fix(新建3步)+F_explore_only(新建2步)
3. **路径2统一selector**: 空态渲染独立场景选择器(3卡片A/D/F),不依赖ScenarioModel.nodes[0]
4. **SimulatedProjectState扩展taskType**: 字段`taskType: 'new'|'continue'|'bugfix'|'explore'`
5. **场景切换state重置**: setSelectedScenarioId+setActiveStepId(steps[0].id)+setSelectedNodeId(null)+setPopover(null);canvasTransform/isFullscreen保留
6. **数据模型保留**: ScenarioModel/ScenarioNode/ScenarioStep字段不变(grill Q4.1),仅渲染层+state重构
7. **SavedRoute跨场景兼容**: 已含scenarioId字段(src/main.tsx:617-630),无schema改动

### Free
1. **ruleApplies扩展方式**: MVP加case(D/F)还是改声明式匹配 — MVP加case(技术债),长期改声明式
2. **D场景plan前置放宽**: 新增rule-plan-direct(无hasAnalyze)还是改rule-plan条件 — 实现者选择
3. **F场景terminal route**: brainstorm→decision的decision是stop还是新增route类型 — 实现者选择
4. **场景选择卡片视觉**: 3卡片布局/样式 — 实现者选择(参考满屏画布浮动按钮透明风格)

### Deferred
1. **E_spec_only场景**: 仅规格文档(blueprint→阅读),无现成rule需全新构建 — 延后到M3
2. **B_large_feature/C_medium_feature场景**: 与A重叠(都是analyze起),延后到M3
3. **ruleApplies声明式匹配重构**: 硬编码switch扩展性瓶颈,MVP可接受 — 延后技术债
4. **'continue'入口(继续中断任务)**: taskType已预留但MVP不实现 — 延后
5. **catalog→ScenarioModel自动转换工具**: 当前手写ScenarioModel,长期可建转换工具 — 延后

## Code Context

- `src/main.tsx:764` — 核心硬编码点 `const scenario = unclearRequirementsScenario`
- `src/main.tsx:770` — `hasSelectedScenario: boolean` 需重构为 `selectedScenarioId: string|null`
- `src/main.tsx:765` — `activeStepId` 初始值依赖scenario.steps[0].id
- `src/main.tsx:807` — `intentNodeId = scenario.nodes[0].id` (路径2绕开此约定)
- `src/main.tsx:816-822` — nodeLayout依赖scenario.nodes(自动重算,无适配)
- `src/main.tsx:475-532` — authoredRules 7条规则(5个scenarioId,待接入App)
- `src/main.tsx:534-553` — ruleApplies硬编码switch(扩展性瓶颈)
- `src/main.tsx:359-367` — SimulatedProjectState(需加taskType)
- `src/main.tsx:579-581` — recommendCommands(待接入App)
- `src/main.tsx:617-630` — SavedRoute(已含scenarioId,跨场景兼容)
- `src/main.tsx:768-771` — canvasTransform/isFullscreen/viewportSize(场景无关)
- `src/main.tsx:1205-1209` — guidance-overlay(替换为场景选择器)
- `catalog.json:168-175` — workflows.paths 6条入口(A-F)

## scope_verdict

**medium** — 1-2子系统(数据模型层+UI层),改动集中在src/main.tsx单文件,可并行但建议串行(场景数据→state重构→UI→规则接入)。建议 `/maestro-plan --from analyze:ANL-canvas-start-scenario-redesign-2026-06-29`。
