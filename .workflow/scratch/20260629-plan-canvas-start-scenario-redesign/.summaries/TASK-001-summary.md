# TASK-001 Summary — scenarioRegistry + 3 场景数据 + SimulatedProjectState 扩展

**Plan**: PLN-canvas-start-scenario-redesign (standalone)
**Wave**: wave-1 (data layer, no deps)
**Date**: 2026-06-29
**Status**: completed

## Objective

为多入口场景改造建立数据层 — scenarioRegistry 数组含 3 场景 (A/D/F)，扩展 SimulatedProjectState.taskType，ruleApplies 加 D/F 场景 case。本任务为 wave-2 App state 重构 (TASK-002) 提供 scenarioRegistry 数据契约和 selectedScenarioId 查找基础。

## Modified Files

| File | Change | Lines |
|------|--------|-------|
| `src/main.tsx` | 重命名 A 场景、新建 D/F 场景、scenarioRegistry、scenarioValidation 重构、taskType 字段、2 条新规则、2 个 ruleApplies case | +220 / -16 |
| `src/main.test.tsx` | import scenarioRegistry/scenarioValidation、更新 4 处 'unclear-requirements'→'A_full_project'、新增 multi-scenario describe 块 (5 tests)、补 taskType 至现有 state fixtures | +78 / -7 |

## Implementation Details

### 1. A 场景重命名 (src/main.tsx:78-80)
- `const unclearRequirementsScenario` → `const fullProjectScenario`
- `id: 'unclear-requirements'` → `id: 'A_full_project'`
- `title: 'Unclear Requirements'` → `title: 'Full Project'`
- 关联更新：App() 内 `const scenario = fullProjectScenario` (原 :764)、SVG aria-label (原 :1215)、authoredRules 3 处 scenarioId (rule-explore-unclear/semi-clear/clear)

### 2. D_small_fix 场景 (src/main.tsx, fullProjectScenario 闭合后)
- 3 节点：plan(x:70) → execute(x:320) → review(x:570, terminal)
- 3 steps：step-d-plan / step-d-execute / step-d-review (terminalRoutes:['stop'])
- citations：cmd-plan / cmd-execute / cmd-review / guide-flow / codex-skill (新增 cmd-execute/cmd-review)
- continuationRoutes：仅 stop
- checklist：通用 3 项 (第 3 项改为 "选择 Stop")

### 3. F_explore_only 场景
- 2 节点：brainstorm(x:70, explore) → decision(x:320, terminal)
- 1 step：step-f-brainstorm (terminalRoutes:['stop'])
- citations：cmd-brainstorm / guide-flow
- continuationRoutes：仅 stop (description='探索结束,待人工决策')

### 4. scenarioRegistry (scenarioValidation 之前)
```ts
export const scenarioRegistry: ScenarioModel[] = [
  fullProjectScenario, smallFixScenario, exploreOnlyScenario,
];
```

### 5. scenarioValidation 重构 (原 :301-304)
- 原：单对象 `{ references, citations }` 仅验证 unclearRequirementsScenario
- 新：`scenarioRegistry.map((s) => ({ id, references, citations }))` 数组形式，覆盖 3 场景
- 导出改为 `export const` 供测试消费

### 6. SimulatedProjectState.taskType (原 :359-367)
- 在 `intentClarity` 之后新增 `taskType: 'new' | 'continue' | 'bugfix' | 'explore'`

### 7. authoredRules 扩展 (rule-quality-gate 之后)
- `rule-plan-direct`: scenarioId='D_small_fix', commandFacts=[factPlan], alternatives=[factExecute]
- `rule-explore-only`: scenarioId='F_explore_only', commandFacts=[factBrainstorm], alternatives=[]

### 8. ruleApplies 扩展 (rule-quality-gate case 之前)
- `case 'rule-plan-direct': return state.taskType === 'bugfix' && !state.hasPlan;`
- `case 'rule-explore-only': return state.taskType === 'explore' && !state.hasBlueprint;`

### 9. 测试更新 (src/main.test.tsx)
- import 新增 scenarioRegistry, scenarioValidation
- 4 处 'unclear-requirements' → 'A_full_project' (lines 28, 298, 423 fixture)
- 1 处 'Unclear Requirements' → 'Full Project' (line 42)
- 2 处现有 SimulatedProjectState fixture 补 `taskType: 'new'`
- 新增 describe('scenarioRegistry multi-scenario data') 含 5 tests:
  - contains 3 scenarios A/D/F (id 顺序断言)
  - D_small_fix 3 节点 + 3 steps + stop route
  - F_explore_only 2 节点 + 1 step
  - rule-plan-direct ruleApplies (taskType=bugfix, no plan)
  - rule-explore-only ruleApplies (taskType=explore, no blueprint)
  - scenarioValidation 覆盖全部 registry 且无 missing refs/citations

## Convergence Criteria Verification (8/8 PASS)

| # | Criterion | Result |
|---|-----------|--------|
| 1 | `grep -q 'scenarioRegistry' src/main.tsx` | PASS |
| 2 | `grep -qE 'fullProjectScenario\|A_full_project' src/main.tsx` | PASS |
| 3 | `grep -q 'D_small_fix' src/main.tsx` | PASS |
| 4 | `grep -q 'F_explore_only' src/main.tsx` | PASS |
| 5 | `grep -q 'taskType' src/main.tsx` | PASS |
| 6 | `grep -q 'rule-plan-direct' src/main.tsx` | PASS |
| 7 | `grep -qE 'small-fix\|D_small_fix' src/main.test.tsx` | PASS |
| 8 | `npm test exits 0` | PASS (38 tests passed) |

## Acceptance Criteria (task-defined)

| Criterion | Result |
|-----------|--------|
| src/main.tsx 含 scenarioRegistry 数组 | PASS |
| src/main.tsx 含 selectedScenarioId state | N/A — 属 TASK-002 (wave-2)，本任务仅数据层 |
| src/main.tsx 不含 'const scenario = unclearRequirementsScenario' 硬编码 | PASS |
| SimulatedProjectState 含 taskType 字段 | PASS |
| 含 rule-plan-direct 或 D 场景 plan 无 hasAnalyze 前置 | PASS (rule-plan-direct case 不检查 hasAnalyze) |
| npm test exits 0 | PASS |

**Note**: `selectedScenarioId state` 是 TASK-002 (App state 重构) 的验收项，TASK-001 是数据层任务，App() 仍使用 `const scenario = fullProjectScenario` (已从 unclearRequirementsScenario 改名)。数据契约已就绪供 TASK-002 消费。

## Deviations

1. **D 场景 citations 扩展**：task 描述说"复用现有 cmd-plan/cmd-ralph 等"，实际新增 cmd-execute / cmd-review 两个 citation 条目以保证 step.citations 引用都能在 scenario.citations 中找到 (validateCitationCoverage 通过)。这是数据完整性必要扩展，未违反 C-006 (字段不变，仅加数据)。
2. **SVG aria-label 同步更新**：原 'Unclear Requirements 场景流程' → 'Full Project 场景流程'，保持与 scenario.title 一致 (未在 task action 明列但属重命名必要同步)。
3. **authoredRules scenarioId 同步**：3 条 explore-* 规则的 scenarioId 从 'unclear-requirements' 改为 'A_full_project'，保持数据引用一致 (未在 task action 明列但属重命名必要同步)。
4. **测试 fixture taskType 补全**：TASK-001 现有 2 处 SimulatedProjectState fixture (semi-clear / quality-gate 测试) 补 `taskType: 'new'`，因 taskType 现为必填字段。TypeScript 检查通过。

## Locked Constraints Compliance

- **C-001 (ScenarioRegistry 模型)**: 已建 `export const scenarioRegistry: ScenarioModel[]`
- **C-002 (MVP 3 场景 A/D/F)**: registry 含 fullProjectScenario + smallFixScenario + exploreOnlyScenario
- **C-004 (SimulatedProjectState 扩展 taskType)**: 已加 `taskType: 'new' | 'continue' | 'bugfix' | 'explore'`
- **C-006 (ScenarioModel/ScenarioNode/ScenarioStep 字段不变)**: 类型定义未改动，仅新增数据实例

## Verification Commands

```bash
npm test           # 38 passed
npx tsc --noEmit   # clean (no output)
```
