# TASK-001 — Define source-backed recommendation rules

**Phase**: M2 Phase 2 — Canvas Command Recommender (满屏画布重写版)
**Status**: completed
**Commit**: b1c1117fcdd1a4bd7be4a04291fb70d173e0e486
**Completed at**: 2026-06-28T18:50:00Z

## Modified Files

- `src/main.tsx` — 在 `App` 函数上方新增 Phase 2 CommandRuleSet 层：6 个类型（`SourceRef`, `CommandFact`, `RecommendationRule`, `RecommendationGroup`, `SimulatedProjectState`，外加已存在的 `ScenarioModel` 系列保留），8 个 authored commandFacts（maestro-brainstorm / maestro-blueprint / maestro-analyze / maestro-plan / maestro-execute / quality-review / quality-test / maestro-ralph-execute），7 条 `authoredRules`，`ruleApplies` / `toRecommendationGroup` 辅助函数，`recommendCommands(state)` 推荐函数，`validateRuleSet(ruleSet)` 校验函数。现有 `ScenarioModel` 数据模型与渲染层未触碰（按 grill Q4.1 保留，渲染重写归 TASK-002/TASK-003）。
- `src/main.test.tsx` — 新增 `Local canvas recommender rules (TASK-001)` describe 块共 5 个测试：sourceRefs 指向 `maestro-flow/`、semi-clear 时 equal-rank 不伪造主命令、quality-gate equal-rank、validateRuleSet 对错误规则返回非空数组、validateRuleSet 对 authoredRules 通过。总测试数 3 → 8。

## Convergence Criteria Verification

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | `src/main.tsx contains 'type CommandFact'` | PASS | `grep -c "type CommandFact" src/main.tsx` → 1（src/main.tsx 新类型定义处） |
| 2 | `src/main.tsx contains 'function recommendCommands'` | PASS | `grep -c "function recommendCommands" src/main.tsx` → 1（已 export） |
| 3 | `src/main.tsx contains 'function validateRuleSet'` | PASS | `grep -c "function validateRuleSet" src/main.tsx` → 1（已 export） |
| 4 | `src/main.tsx contains 'maestro-flow/.codex/skills/maestro-help/catalog.json'` | PASS | `grep -c` → 1（`sourceRefCatalog` 常量 path 字段） |
| 5 | `src/main.tsx contains 'alternatives' field on RecommendationGroup or CommandFact` | PASS | `grep -c "alternatives" src/main.tsx` → 22（RecommendationRule.alternatives + RecommendationGroup.alternatives + 多处使用） |
| 6 | `src/main.test.tsx contains 'equal-rank' or 'equal rank'` | PASS | `grep -c "equal-rank" src/main.test.tsx` → 3（semi-clear / quality-gate 测试名与断言） |
| 7 | `npm test exits 0` | PASS | `npm test` → `Test Files 1 passed (1) / Tests 8 passed (8)`，退出码 0 |

附加验证：`npx tsc --noEmit` 退出码 0（无类型错误）。

## Project Spec Alignment

- **grill Q2.1 / C-004（推荐证据簇保留供 popover 渲染）**：`RecommendationGroup` 携带 `purpose` / `input` / `output` / `nextAction` / `alternatives` / `sourceStatus` 字段，TASK-003 popover 可直接消费，无需从 rule 重新派生。
- **grill 决策#7（equal-rank 不伪造主命令）**：`primary: CommandFact[]` 为数组，`rule-explore-semi-clear` / `rule-execute` / `rule-quality-gate` 三条规则 primary 含 2 个 commandFact；`toRecommendationGroup` 在 equal-rank 时生成 "equal-rank 推荐含 N 个并列命令" 的 purpose，不挑选假主命令。
- **grill 决策#9（sourceRef 指向 maestro-flow/ 子模块源）**：所有 `sourceRef.path` 均以 `maestro-flow/` 开头（`sourceRefCommand` 模板、`sourceRefCatalog`、`sourceRefNext`）；`validateRuleSet` 主动校验此约束。
- **grill Q4.1 / C-010（数据模型保留，仅渲染层重写）**：`ScenarioModel` / `ScenarioNode` / `ScenarioStep` 及 `unclearRequirementsScenario` 数据原样保留，App 渲染层未改动（归 TASK-002/TASK-003）。

## Deviations

无偏差。实现严格按 task action 与 implementation steps 执行：
1. 新类型加在 App 函数上方 ✓
2. 8 个 commandFacts 全部覆盖（超出"至少 8 个"要求）✓
3. sourceRef 同时指向 `catalog.json` 和 `maestro-next.md` ✓
4. `recommendCommands` 支持 equal-rank（3 条 equal-rank 规则）✓
5. `validateRuleSet` 检查 missing command references / missing sourceRefs / sourceRef.path 不以 maestro-flow/ 开头 ✓
6. `RecommendationGroup` 携带全部证据字段 ✓
7. 测试覆盖 sourceRefs、equal-rank 多命令、validateRuleSet 错误返回 ✓

## Notes for Downstream Tasks

- TASK-002（画布渲染）：消费 `recommendCommands(state)` 的返回值渲染画布节点；`SimulatedProjectState` 作为画布状态模型基础。
- TASK-003（popover 证据簇）：直接渲染 `RecommendationGroup` 的 `purpose` / `input` / `output` / `nextAction` / `alternatives` / `sourceStatus` 字段；equal-rank group 的 `primary` 数组多元素需并列展示。
- `authoredRules` 已通过 `validateRuleSet` 自检（0 errors），可作为后续扩展的基线。
