# Analysis: 初始场景改造 — 支持多入口场景

**Session**: ANL-canvas-start-scenario-redesign-2026-06-29
**Scope**: adhoc (macro mode)
**Date**: 2026-06-29
**Milestone**: M2-canvas-command-recommender-mvp
**Upstream**: GRL-20260628-canvas-node-scenario-redesign (决策#1规则驱动画布, #2 maestro-help catalog 驱动场景枚举), GRL-20260628-fullscreen-canvas-layout (Q3.3 空态初始场景选择节点)

## User Intent

原始诉求：当前画布初始场景只有"模糊需求探索"(unclearRequirementsScenario)一个，但用户可能从任何地方开始——继续中断的任务、bug修复、跑测试、完善文档、学习探索项目等。这个开始场景需要改造，支持多入口。

**Intent 拆解**:
1. 当前单场景硬编码如何解耦 → 多场景数据模型选型
2. 用户可能的入口场景有哪些 → 场景枚举（由上轮 grill 决策#2 maestro-help catalog 驱动）
3. 每种入口如何映射到 Maestro 命令流 → 规则路由
4. MVP 范围与优先级 → 决策评估（留 plan 阶段）

## 分析方向

- **架构设计**：多场景数据模型选型（ScenarioRegistry vs 动态生成 vs 规则路由），SimulatedProjectState 与场景选择的关系
- **实现可行性**：当前代码解耦难点、与满屏画布壳(TASK-002)/popover(TASK-003)的集成点、改动面评估

## 分析深度

标准：完整 cli-explore-agent 探索 + CLI 分析 + 2-3 轮交互讨论 + 6维度评分 + 压力测试

## Dimensions

| Dimension | Selected | Focus |
|-----------|----------|-------|
| architecture | ✓ | System Design, Component Interactions, Design Patterns |
| implementation | ✓ | Code Structure, Patterns, Integration Points |
| performance | — | (本议题不涉及性能瓶颈) |
| security | — | (无认证/数据保护议题) |
| concept | — | (概念梳理由上轮 grill catalog 决策#2 承载) |
| comparison | — | (不涉及方案对比选型，架构方向已由 grill 定) |

## Current Understanding

代码探索揭示三个关键事实：(1) 规则系统(recommendCommands/authoredRules/SimulatedProjectState)已由TASK-001建好但App内零调用，是"待接线"层，已为多场景路由预留scenarioId字段(5个不同值)；(2) unclearRequirementsScenario硬编码在App() line 764，被21+处消费，hasSelectedScenario是布尔值不携带场景ID；(3) canvasTransform/isFullscreen/viewportSize/popover/SavedRoute均为场景无关或已含scenarioId——解耦面集中在scenario变量+hasSelectedScenario+activeStepId三处。catalog.workflows.paths有6条入口(A-F)可直接映射为场景枚举。推荐ScenarioRegistry模型(fit_score=4)，MVP做3个场景(A_full_project/D_small_fix/F_explore_only)。

## Table of Contents

- [Round 1: CLI Exploration](#round-1-cli-exploration)

## Discussion Timeline

### Round 1: CLI Exploration

**Sources**: cli-explore-agent (代码3层探索), maestro delegate CLI (W001不可用, opencode not found)

**Key Findings (with code anchors)**:

1. **规则系统已建好未接入** — `recommendCommands`(:579)/`authoredRules`(:475)/`SimulatedProjectState`(:359) 在App()内零调用，仅被main.test.tsx消费。已为多场景路由预留`scenarioId`字段(5个不同值: unclear-requirements/phase-analysis/phase-planning/phase-execution/phase-quality)。证据: grep确认App内无recommendCommands调用。

2. **核心硬编码点** — `const scenario = unclearRequirementsScenario;`(:764) 无selector，被21+处`scenario.`消费。`hasSelectedScenario: boolean`(:770) 不携带场景ID，7处守卫点(:808/:930/:948/:1101/:1154/:1155/:1276)依赖此bool。

3. **场景无关组件(无需改动)** — canvasTransform/isFullscreen/viewportSize(:768-771)纯UI状态; popover状态只存{nodeId,x,y}(:773)不存scenarioId; SavedRoute已含scenarioId字段(:617-630); nodeLayout(:816)/activeBranches(:842)/popover渲染(:1317)均依赖ScenarioModel数据契约,任何符合契约的场景可复用。

4. **catalog直接映射源** — `catalog.json:168-175` workflows.paths有6条入口(A_full_project/B_large_feature/C_medium_feature/D_small_fix/E_spec_only/F_explore_only)，每条按`→`split即可生成nodes，commands[].source已maestro-flow/前缀(符合grill C-009)。

5. **三种模型选型评估**:
   - ScenarioRegistry fit=4: 数据契约已验证,改动面最小,与grill Q4.1兼容,catalog 1:1映射
   - 动态生成 fit=2: ScenarioModel 8字段实时生成成本高,与手写模式不兼容
   - 规则路由 fit=1: 与grill Q4.1(数据模型保留)冲突,改动面巨大(21+处全改)

6. **解耦难度medium** — 3个blocker: hasSelectedScenario→selectedScenarioId重构(7守卫点)、scenario变量→useMemo(21+消费点)、activeStepId初始值生命周期(scenario为null时处理)。

7. **SimulatedProjectState不充分** — 当前7字段(milestone/phase/hasBlueprint/hasAnalyze/hasPlan/hasExecute/intentClarity)无法区分D/E/F入口(小修复/仅规格/探索),需补taskType字段。

**Open Questions**:
- Q1: MVP做哪几个场景?(推荐A/D/F 3个,需用户确认)
- Q2: SimulatedProjectState扩展taskType字段的具体枚举值?
- Q3: 场景选择UI设计——每场景自带intent节点 vs 统一selector节点?

**Technical Solutions**:

> **Solution**: ScenarioRegistry模型 — 新建`scenarioRegistry: ScenarioModel[]`,App()按`selectedScenarioId`查找
> - **Status**: Proposed
> - **Problem**: 单场景硬编码无法支持多入口
> - **Rationale**: fit_score=4(最高),数据契约已验证,改动面最小,与grill Q4.1兼容
> - **Alternatives**: 动态生成(fit=2,生成成本高)、规则路由(fit=1,与Q4.1冲突)
> - **Evidence**: src/main.tsx:78-271(模式可复制), :816(nodeLayout依赖scenario.nodes), catalog.json:168(6条paths映射)
> - **Next Action**: 用户确认MVP场景范围后进入plan

### Intent Coverage Check (Round 1)

| # | Original Intent | Status | Notes |
|---|----------------|--------|-------|
| 1 | 当前单场景硬编码如何解耦 → 多场景数据模型选型 | ✅ addressed | Round 1: ScenarioRegistry推荐(fit=4),3个blocker识别 |
| 2 | 用户可能的入口场景有哪些 → 场景枚举 | ✅ addressed | Round 1: catalog.paths 6条(A-F)映射,MVP推荐3个(A/D/F) |
| 3 | 每种入口如何映射到Maestro命令流 → 规则路由 | 🔄 in-progress | Round 1: 规则系统已建好未接入,接入点识别但taskType字段缺失 |
| 4 | MVP范围与优先级 → 决策评估 | 🔄 in-progress | Round 1: 推荐3场景但需用户确认 |

### Baseline Confidence Scoring

| Dimension | findings_depth(.30) | evidence_strength(.25) | coverage_breadth(.20) | user_validation(.15) | consistency(.10) | **Overall** |
|-----------|---------------------|------------------------|------------------------|----------------------|------------------|-------------|
| architecture | 85% | 90% (cli-explore-agent代码锚点) | 80% | 50% (待用户确认) | 85% | **76%** |
| implementation | 80% | 85% (file:line证据) | 75% | 50% | 80% | **72%** |

**Overall baseline**: 74% — 需用户确认收敛(60-80%区间)
**Weakest**: implementation (72%) — user_validation 待Round 2补充

### Round 2: MVP场景范围确认 + 实现难点深入

**起点**: 基于Round 1的ScenarioRegistry推荐(fit=4)和3个未解决问题，本轮确认MVP场景范围并深入实现难点。

**Key Findings**:

1. **MVP场景确认: A+D+F 3场景**
   - A_full_project: 复用unclearRequirementsScenario(8步完整链,rule全覆盖,改动最小)
   - D_small_fix: 新建3步短链(plan→execute→review),需放宽ruleApplies的plan前置hasAnalyze限制
   - F_explore_only: 新建2步极短(brainstorm→decision),需补terminal route
   - E_spec_only/C_medium_feature/B_large_feature延后(无现成rule或与A重叠)

2. **ruleApplies扩展性瓶颈解法** — 当前`ruleApplies`(:534)硬编码switch on rule.id，新增D/F场景需改此函数。解法：按`rule.scenarioId`+`rule.condition`字段声明式匹配，替代switch。但MVP阶段可先加case(D/F各自一个case)，技术债留后续。

3. **SimulatedProjectState扩展taskType** — 当前7字段无法区分D/E/F入口。扩展为:
   ```
   taskType: 'new' | 'continue' | 'bugfix' | 'explore'
   ```
   - 'new' → A_full_project
   - 'bugfix' → D_small_fix
   - 'explore' → F_explore_only
   - 'continue' → 未来扩展(继续中断任务)

4. **场景选择UI设计决策** — 两种路径:
   - 路径1(每场景自带intent节点): 每个ScenarioModel的nodes[0]是该场景入口,空态时渲染3个场景选择卡片(非ScenarioModel节点)
   - 路径2(统一selector节点): 空态时渲染1个中央selector节点,点击展开3个场景选项,选中后切换到对应ScenarioModel
   - 推荐路径2: 与现有guidance-overlay(:1205)和hasSelectedScenario机制兼容,改动更小

5. **接入点详细设计** — recommendCommands接入App():
   - 新增`useState<SimulatedProjectState>`(初始模拟值)
   - 场景选择后初始化state(taskType对应场景)
   - 场景切换时:`setSelectedScenarioId(newId); setActiveStepId(newScenario.steps[0].id); setSelectedNodeId(null); setPopover(null);`
   - canvasTransform/isFullscreen保留(用户视角)

**Technical Solutions**:

> **Solution**: MVP 3场景(A+D+F) + ScenarioRegistry + 统一selector节点
> - **Status**: Validated (用户确认)
> - **Problem**: 单场景硬编码无法支持多入口
> - **Rationale**: A复用现有(改动最小),D/F新建但短链(3步/2步),覆盖新项目/小修复/探索三大入口
> - **Alternatives**: A+D(缺探索入口), 仅A(不验证多场景机制), A+D+F+E(E无现成rule)
> - **Evidence**: catalog.json:168-175(paths A/D/F), src/main.tsx:475-532(authoredRules匹配), 用户确认
> - **Next Action**: 进入6维度评分

> **Solution**: SimulatedProjectState扩展taskType字段
> - **Status**: Proposed
> - **Problem**: 当前7字段无法区分D/E/F入口
> - **Rationale**: taskType 4值(new/continue/bugfix/explore)直接映射场景选择
> - **Evidence**: src/main.tsx:359-367(当前类型), catalog.json:168-175(场景区分需求)
> - **Next Action**: plan阶段细化枚举

#### 压力测试

**被测发现**: ScenarioRegistry模型fit=4是最高分推荐
**压力梯**:
1. **证据需求**: fit=4基于什么证据? → 数据契约已验证(nodeLayout:816/activeBranches:842/popover:1317均依赖ScenarioModel且通过TASK-002/003测试)、改动面最小(仅扩展selectedScenarioId state+scenarioRegistry数组)、与grill Q4.1兼容(数据模型保留)、catalog 1:1映射(6条paths)
2. **假设探测**: 假设"数据契约已验证"——是否真的所有ScenarioModel字段都验证过? → revealedNodeIds(:807)硬编码nodes[0]为intent节点,D/F场景的nodes[0]不一定是intent(可能是plan/brainstorm),需统一约定或路径2统一selector绕开
3. **边界/权衡**: ScenarioRegistry的扩展性瓶颈? → 每新增场景需手写ScenarioModel(工作量大),但MVP 3场景可接受;长期可考虑catalog→ScenarioModel自动转换工具
4. **根因检查**: 为什么规则路由fit=1? → 与grill Q4.1(数据模型字段MUST保留)直接冲突,且改动面巨大(21+处scenario.消费点全改),非技术偏好而是约束驱动

**压力测试结论**: ScenarioRegistry推荐经得起压力测试。唯一风险点是nodes[0]约定——路径2(统一selector节点)可绕开此问题,因为空态时渲染独立selector不依赖ScenarioModel.nodes[0]。

### Intent Coverage Check (Round 2)

| # | Original Intent | Status | Where Addressed | Notes |
|---|----------------|--------|-----------------|-------|
| 1 | 当前单场景硬编码如何解耦 → 多场景数据模型选型 | ✅ Addressed | Round 1+2 | ScenarioRegistry(fit=4),3个blocker识别,压力测试通过 |
| 2 | 用户可能的入口场景有哪些 → 场景枚举 | ✅ Addressed | Round 1+2 | catalog.paths 6条(A-F),MVP确认A+D+F 3个 |
| 3 | 每种入口如何映射到Maestro命令流 → 规则路由 | ✅ Addressed | Round 2 | A复用现有rule,D/F需放宽ruleApplies+补terminal route,接入点设计完成 |
| 4 | MVP范围与优先级 → 决策评估 | ✅ Addressed | Round 2 | A+D+F确认,E/B/C延后 |

### Re-scored Confidence (Round 2)

| Dimension | Round 1 | Round 2 | Delta |
|-----------|---------|---------|-------|
| architecture | 76% | 85% | +9% (模型选型经压力测试验证) |
| implementation | 72% | 82% | +10% (接入点设计完成,taskType枚举确认) |

**Overall**: 74% → 84% (+10%) — 建议收敛(>80%)
**Weakest**: implementation (82%) — 仍有ruleApplies扩展性技术债,但MVP可接受
