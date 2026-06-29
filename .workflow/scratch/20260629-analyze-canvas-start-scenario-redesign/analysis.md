# Analysis: 初始场景改造 — 支持多入口场景

**Session**: ANL-canvas-start-scenario-redesign-2026-06-29
**Scope**: adhoc (macro mode)
**Recommendation**: GO (Conditional)
**Confidence**: 84% (medium-high)

## Executive Summary

初始场景改造从单场景硬编码(unclearRequirementsScenario)到多入口场景支持，推荐 **ScenarioRegistry 模型**(fit_score=4/5)，MVP 做 3 个场景(A_full_project/D_small_fix/F_explore_only)。规则系统(recommendCommands/authoredRules)已由 TASK-001 建好但 App 内零调用，是"待接线"层，本次改造的核心工作就是接通这层并扩展场景数据。改动面集中在 scenario 变量(21+消费点)、hasSelectedScenario(7守卫点)、activeStepId(生命周期)三处，canvasTransform/isFullscreen/popover/SavedRoute 均场景无关无需改动。SimulatedProjectState 需扩展 taskType 字段以区分入口意图。

## Six-Dimension Scoring

| Dimension | Score | Confidence | Key Evidence |
|-----------|-------|------------|--------------|
| Feasibility | 4/5 | 85% | 规则系统已建好(TASK-001),数据契约已验证(TASK-002/003测试通过),改动面集中在3处state重构;ruleApplies扩展性瓶颈是技术债但MVP可接受 |
| Impact | 5/5 | 90% | 直接解决用户核心诉求(多入口场景),覆盖新项目/小修复/探索三大入口,为后续B/C/E场景扩展铺路,与catalog.paths单一事实源对齐 |
| Risk | 3/5 | 80% | nodes[0]约定需统一(路径2统一selector绕开);ruleApplies硬编码switch扩展性瓶颈;场景切换时activeStepId重置生命周期需处理;D/F场景rule部分匹配需放宽 |
| Complexity | 3/5 | 80% | 3个blocker(hasSelectedScenario重构/scenario变量useMemo化/activeStepId生命周期);21+消费点需适配;但canvasTransform等UI状态场景无关降低复杂度 |
| Dependencies | 4/5 | 85% | 依赖TASK-001规则系统(已就绪)+catalog.json(已就绪)+满屏画布壳TASK-002(已就绪)+popover TASK-003(已就绪);无外部依赖;SimulatedProjectState扩展是内部类型改动 |
| Alternatives | N/A | — | 动态生成(fit=2,ScenarioModel 8字段实时生成成本高);规则路由(fit=1,与grill Q4.1冲突);ScenarioRegistry(fit=4,推荐) |

**Overall Score**: 3.8/5 (加权: Feasibility×Impact×0.3 + Risk×Complexity×0.2 + Dependencies×0.2 + Alternatives×0.3)

## Risk Matrix

| Risk | Probability | Impact | Severity | Mitigation |
|------|-------------|--------|----------|------------|
| nodes[0]约定在D/F场景不成立 | Medium | Medium | Medium | 路径2统一selector节点绕开(空态渲染独立selector不依赖ScenarioModel.nodes[0]) |
| ruleApplies硬编码switch扩展性 | High | Low | Low | MVP加D/F两个case,长期改声明式匹配;技术债可接受 |
| 场景切换时activeStepId生命周期 | Medium | Medium | Medium | 切换时显式重置:setActiveStepId(newScenario.steps[0].id)+setSelectedNodeId(null)+setPopover(null) |
| D场景rule-plan前置hasAnalyze限制 | High | Low | Low | 放宽ruleApplies或新增rule-plan-direct(无analyze前置) |
| F场景缺terminal route | Medium | Low | Low | 补brainstorm→decision terminal route(stop) |

## Confidence Summary

**Overall**: 84% (medium-high)

**Factor decomposition**:
- findings_depth (0.30): 85% — cli-explore-agent 3层探索,file:line锚点详尽
- evidence_strength (0.25): 80% — 代码证据充分,但CLI delegate W001不可用(架构分析基于agent单视角)
- coverage_breadth (0.20): 85% — 架构+实现两维度覆盖,4个intent全addressed
- user_validation (0.15): 90% — MVP范围经用户确认(A+D+F)
- consistency (0.10): 85% — 与grill决策#1/#2/Q4.1对齐,压力测试通过

**Pressure pass**: ScenarioRegistry推荐经4级压力测试(证据需求→假设探测→边界权衡→根因检查),唯一风险nodes[0]约定由路径2统一selector绕开。

**Residual risks**: ruleApplies扩展性技术债(MVP可接受,长期改声明式);CLI delegate W001限制(架构分析单视角,非双验证)

## Go/No-Go Recommendation

**GO (Conditional)**

条件:
1. MVP范围锁定 A+D+F 3场景(已确认)
2. 采用路径2统一selector节点(绕开nodes[0]约定风险)
3. SimulatedProjectState扩展taskType字段
4. ruleApplies MVP阶段加case(D/F),技术债记录

满足以上条件即可进入plan。改动面medium(3处state重构+2个新ScenarioModel+1个selector UI),依赖已就绪(TASK-001/002/003),与grill决策完全对齐。
