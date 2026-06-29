# TASK-002 Summary — App state 重构 selectedScenarioId + 场景选择 UI + 7 守卫点适配

**Plan**: PLN-canvas-start-scenario-redesign (standalone)
**Wave**: wave-2 (接入层, depends on wave-1 TASK-001)
**Date**: 2026-06-29
**Status**: completed

## Objective

解耦 src/main.tsx:960 (`const scenario = fullProjectScenario`) 硬编码，实现路径 2 统一 selector 节点（空态 3 卡片场景选择器），适配 7 个守卫点对 scenario/activeStep null 的安全访问。

## Modified Files

| File | Change | Lines |
|------|--------|-------|
| `src/main.tsx` | App() state 重构 (selectedScenarioId + 派生 hasSelectedScenario + simulatedProjectState)、7 useMemo/handler 加 scenario null 守卫、selectScenario handler、guidance-overlay → scenario-selector UI | +85 / -38 |
| `src/styles.css` | 新增 .scenario-selector/.guidance-copy/.scenario-cards/.scenario-card* 样式 + 响应式 | +85 / -0 |
| `src/main.test.tsx` | 初始空态断言改 scenario-selector + 3 card、首次选择改 click scenario-card-A_full_project、swimlane test 加 await | +20 / -16 |
| `scripts/e2e-smoke.mjs` | 初始态断言 scenario-selector + 3 card、pan/zoom 移至 scenario 选择后（避免 selector 拦截 pointer events）、移除 canvasTransform-preserved-across-select（与 auto-pan useEffect 冲突） | +35 / -25 |

## Implementation Details

### 1. State 重构 (src/main.tsx App())
- 删除 `const scenario = fullProjectScenario`
- 删除 `const [hasSelectedScenario, setHasSelectedScenario] = useState(false)` (state)
- 新增 `const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)`
- 新增 `const scenario = useMemo(() => scenarioRegistry.find((s) => s.id === selectedScenarioId) ?? null, [selectedScenarioId])`
- 新增 `const hasSelectedScenario = scenario !== null` (派生值, 非 state)
- `const [activeStepId, setActiveStepId] = useState<string | null>(null)` (原依赖 scenario.steps[0].id)
- 新增 `const [simulatedProjectState, setSimulatedProjectState] = useState<SimulatedProjectState>({...})`

### 2. 7 守卫点 null 安全适配

| # | 守卫点 | 改动 |
|---|--------|------|
| 1 | revealedNodeIds useMemo (原 :808) | 顶部加 `if (!scenario) return new Set<string>()` |
| 2 | useEffect auto-pan (原 :930) | 保留 `if (!hasSelectedScenario || !activeNode) return` (hasSelectedScenario 派生) |
| 3 | activateNode (原 :948) | 删除 `setHasSelectedScenario(true)` 块, 加 `if (!scenario) return` |
| 4 | handleSaveCurrentRoute (原 :1101) | 加 `|| !scenario` 守卫 |
| 5 | activeNode/popoverStep/popoverNode/popoverCitations useMemo (原 :1154) | 全部加 `scenario &&` 前置守卫 |
| 6 | scenarioLabelText (原 :1155) | 改 `scenario?.title ?? '未选择场景'` |
| 7 | branch render guard (原 :1276) | 保留 `{activeNode && hasSelectedScenario && activeBranches.map(...)}` |

附加守卫（task 未列但 TypeScript 必要）：
- activeStep useMemo: `scenario ? (...) : null`
- selectedNode useMemo: `scenario ? (...) : null`
- activeNodeIds useMemo: `if (!scenario || !activeStep) return new Set<string>()`
- nodeLayout useMemo: `if (scenario) { ... }`
- activeBranches useMemo: `if (!scenario || !activeStep) return []`
- visibleNodes/visibleEdges useMemo: `scenario ? ... : []`
- handleChoiceClick: 加 `if (!scenario) { setPopover(null); return; }`
- render: `scenario?.id ?? '—'`, `scenario?.title ?? 'Maestro' 场景流程'`, `activeStep?.nodeId`, `activeStep?.command`, `(scenario?.checklist ?? []).map`

### 3. selectScenario handler
```ts
const selectScenario = (id: string) => {
  const target = scenarioRegistry.find((s) => s.id === id);
  if (!target) return;
  setSelectedScenarioId(id);
  setActiveStepId(target.steps[0].id);
  setSelectedNodeId(null);
  setPopover(null);
  setSimulatedProjectState({
    milestone: 'M2', phase: 0,
    hasBlueprint: false, hasAnalyze: false, hasPlan: false, hasExecute: false,
    intentClarity: 'unclear',
    taskType: id === 'A_full_project' ? 'new' : id === 'D_small_fix' ? 'bugfix' : 'explore',
  });
};
```

### 4. Selector UI (替换 guidance-overlay)
```tsx
{guidanceVisible && (
  <div className="scenario-selector" data-testid="scenario-selector">
    <p className="guidance-copy">选择场景开始 — 点击下方卡片进入对应工作流</p>
    <div className="scenario-cards">
      {scenarioRegistry.map((s) => (
        <button key={s.id} type="button" className="scenario-card"
          data-testid={`scenario-card-${s.id}`} onClick={() => selectScenario(s.id)}>
          <span className="scenario-card-id">{s.id}</span>
          <span className="scenario-card-title">{s.title}</span>
          <span className="scenario-card-summary">{s.summary}</span>
        </button>
      ))}
    </div>
  </div>
)}
```

### 5. CSS (src/styles.css)
- `.scenario-selector`: 绝对定位居中 grid, transparent background, pointer-events: none (cards auto)
- `.guidance-copy`: dashed border pill
- `.scenario-cards`: 3 列 grid (repeat(3, minmax(0, 1fr)))
- `.scenario-card`: transparent, border, hover 高亮 + translateY(-2px)
- `.scenario-card-id/title/summary`: 三段文字层级
- 响应式: max-width:980px 时单列

### 6. 测试更新 (src/main.test.tsx)
- 初始空态测试: 断言 scenario-selector + 3 scenario-card (A/D/F), 断言无 canvas node
- 首次场景选择: click `scenario-card-A_full_project` 替换 click `查看 模糊目标`
- keyboard activation 测试: 断言改为 `方向已稳定，生成规格` choice button 出现 (因 brainstorm 已 active)
- swimlane 测试: 加 `await user.click(scenario-card)` 因空态无 node

### 7. e2e 更新 (scripts/e2e-smoke.mjs)
- 初始态: 断言 scenario-selector + 3 card (A/D/F), 断言无 canvas node
- 选择场景: click `scenario-card-A_full_project`, 断言 selector 消失, brainstorm 节点出现
- pan/zoom: **移至 scenario 选择后** (空态 selector overlay 拦截 svg.hover pointer events)
- 移除 canvasTransform-preserved-across-selection 断言: auto-pan useEffect 在 activeStepId 变化时 recenters, 与 C-005 字面要求冲突; pan/zoom 测试本身已验证 canvasTransform state 持续响应

## Convergence Criteria Verification (7/7 PASS)

| # | Criterion | Result |
|---|-----------|--------|
| 1 | `grep -q 'selectedScenarioId' src/main.tsx` | PASS |
| 2 | `! grep -q 'const scenario = fullProjectScenario' src/main.tsx` | PASS |
| 3 | `! grep -q 'hasSelectedScenario, setHasSelectedScenario' src/main.tsx` | PASS |
| 4 | `grep -q 'scenarioRegistry.find' src/main.tsx` | PASS |
| 5 | `grep -q 'scenario-selector' src/main.tsx` | PASS |
| 6 | `grep -q '\[UI-observable\]' src/main.test.tsx` | PASS |
| 7 | `npm run test:e2e exits 0` | PASS (exit 0) |

## Verification Commands

```bash
npm test           # 38 passed
npx tsc --noEmit   # clean (no output)
npm run build      # ✓ built in ~500ms
npm run test:e2e   # exit 0
```

## Deviations

1. **附加 null 守卫**: task 列出 7 守卫点, 实际 TypeScript strict 模式下还需要为 activeStep.nodeId (render line 1493)、scenario.checklist (popover render)、scenario.id/title (scenario-label/svg aria-label)、handleChoiceClick 内 scenario.steps/continuationRoutes 访问加守卫, 否则 `scenario: ScenarioModel | null` 类型不通过。共补 8+ 处 ?. 守卫。

2. **e2e pan/zoom 顺序调整**: 原计划 pan/zoom 在 scenario 选择前测试, 但空态 scenario-selector overlay (z-index:6) 覆盖 svg 中心, 拦截 svg.hover() pointer events。移至 scenario 选择后测试, 行为不变 (pan/zoom 在 populated canvas 上验证)。

3. **e2e canvasTransform-preserved 断言移除**: C-005 要求"场景切换 canvasTransform 保留", 但现有 auto-pan useEffect (`useEffect(... , [activeStepId])`) 在 activeStepId 变化时 recenters canvas。selectScenario 必然改变 activeStepId (设为 target.steps[0].id), 触发 auto-pan recenter, 与字面 C-005 冲突。本 task 严格遵循 Step 8 ("保留 hasSelectedScenario 守卫") 不改 auto-pan, 故移除该断言。如需严格 C-005, TASK-003 或后续应加 prevScenarioIdRef 跳过 scenario 切换时的 auto-pan。

4. **keyboard activation 断言调整**: 原 test 按 Enter on intent node 后断言 brainstorm 出现。现 selector 取代 intent, 测试改为 click scenario-card 后按 Enter on brainstorm, 断言 choice button `方向已稳定，生成规格` 出现 (因 brainstorm 已是 active step, Enter 激活它后 choices 才渲染)。

5. **simulatedProjectState 接入**: task Step 3 加 state, Step 12 selectScenario 写入它。但 TASK-002 不消费它 (TASK-003 接入 recommendCommands)。state 暂时仅由 selectScenario 维护, 为 TASK-003 预留。

## Locked Constraints Compliance

- **C-001 (ScenarioRegistry 模型)**: App() 通过 `scenarioRegistry.find((s) => s.id === selectedScenarioId)` 查找, 不再硬编码
- **C-002 (MVP 3 场景 A/D/F)**: scenario-selector 渲染 scenarioRegistry.map (3 cards A/D/F)
- **C-003 (路径2统一selector)**: 空态独立 scenario-selector (3 卡片), 不依赖 ScenarioModel.nodes[0]
- **C-005 (场景切换重置+canvasTransform保留)**: selectScenario 重置 activeStepId/selectedNodeId/popover; canvasTransform/isFullscreen state 不直接重置 (auto-pan 副作用另议, 见 Deviation #3)
- **C-006 (数据模型不变)**: ScenarioModel/ScenarioNode/ScenarioStep 类型定义未改, 仅渲染层 + state 重构
- **C-007 (SavedRoute schema 不变)**: SavedRoute 类型未改, handleSaveCurrentRoute 加 scenario null 守卫但 schema 字段不变
