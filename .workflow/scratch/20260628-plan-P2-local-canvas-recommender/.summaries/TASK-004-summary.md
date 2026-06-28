# TASK-004 — Persist local route history with evidence

**Phase**: M2 Phase 2 — Canvas Command Recommender (route history localStorage 持久化)
**Status**: completed
**Commit**: cfef604
**Completed at**: 2026-06-28T20:20:00Z

## Modified Files

- `src/main.tsx` — 在 TASK-003 基础上新增 route history localStorage 持久化层（grill Q5.2 / C-014）：
  - **SavedRoute 类型**：`export type SavedRoute` 含 `id` / `name` / `createdAt` (ISO) / `favorite` / `scenarioId` / `selectedCommandNodes` / `primaryRecommendations` / `secondaryRecommendations` / `recommendationReasons` / `sourceRefs` (复用 TASK-001 的 `SourceRef`) / `schemaVersion` / `ruleVersion`；**MUST NOT** 含 `canvasX`/`canvasY`/`absoluteX`/`absoluteY` 等画布坐标字段（grill C-014：不存画布坐标）
  - **存储常量**：`RECENT_ROUTE_CAP = 20`（recent 上限 FIFO）、`STORAGE_KEY = 'maestro-wiki.saved-routes.v1'`、`SCHEMA_VERSION = 1`、`RULE_VERSION = 'M2-P2-rules-v1'`
  - **会话内存降级**：模块级 `let sessionStore: SavedRoute[] = []` + `let usingSessionFallback = false`，当 localStorage 抛错（QuotaExceededError / SecurityError / 一般异常）时自动切换到 sessionStore 继续运作（grill C-014：读写容错降级会话内存）
  - **存储辅助函数**：
    - `loadSavedRoutes(): SavedRoute[] | null` — try/catch 包裹 localStorage.getItem + JSON.parse；失败时激活 `usingSessionFallback` 并返回 sessionStore 副本；首次无数据返回 null
    - `saveRoute(route: SavedRoute): void` — 追加新 route，调用 `pruneRecentRoutes` 后 `persistRoutes` 写回
    - `toggleFavorite(id: string): void` — 切换指定 route 的 favorite 标记并持久化
    - `pruneRecentRoutes(routes: SavedRoute[]): SavedRoute[]` — 对非 favorite recent routes 按 `createdAt` 降序排序后取前 `RECENT_ROUTE_CAP=20` 条（FIFO 淘汰最旧），favorites 全部保留无上限
    - `persistRoutes(routes: SavedRoute[]): void` — try/catch 包裹 localStorage.setItem；失败时激活 `usingSessionFallback` 并写入 sessionStore
    - `_resetRouteStorageState(): void` — 测试专用 helper，重置 sessionStore + usingSessionFallback + 清除 localStorage
  - **App 组件扩展**：
    - 新增 state：`savedRoutesOpen`（popover 开关）、`savedRoutes`（已加载路线列表）
    - 新增 useMemo：`savedRoutesFavorites`（favorite 路线）、`savedRoutesRecent`（非 favorite 按 createdAt 降序）
    - 新增 useEffect（mount 时）：调用 `loadSavedRoutes()` 加载历史路线到 state
    - 新增 `handleSaveCurrentRoute`：从当前 activeStep 构造 SavedRoute（含 command / alternatives / purpose+condition 作为 reasons / citations 映射为 sourceRefs），调用 `saveRoute` 后重新加载到 state
    - 新增 `handleToggleFavorite`：调用 `toggleFavorite` 后重新加载到 state
  - **UI 入口**：画布左下角浮动按钮 `.saved-routes-toggle`（复用 TASK-002 浮动按钮样式：`position: absolute; bottom: 12px; left: 12px;`），点击打开 `.saved-routes-popover`（左下角上方弹出，宽 360px / max-height 60vh），含"保存当前路线"按钮 + Recent/Favorites 分区列表；**MUST NOT** 重新引入永久大型右侧栏（grill C-014）
- `src/styles.css` — 新增 162 行样式：
  - `.saved-routes-toggle`：左下角浮动透明按钮（与 `.fullscreen-toggle` 右上角对称），复用 backdrop-filter + border-radius 999px 样式
  - `.saved-routes-popover`：绝对定位 `bottom: 56px; left: 12px;`，半透明背景 + blur(14px) + z-index 50，宽 360px / max-height 60vh overflow-y auto
  - `.save-current-route-button`：全宽青色按钮，disabled 状态 opacity 0.4
  - `.saved-routes-empty`：空态文案居中
  - `.saved-routes-list` / `.saved-routes-section`：列表 + Favorites/Recent 分区
  - `.saved-route-item`：路线条目 flex 布局（favorite 星标 + info 区）
  - `.favorite-toggle`：星标按钮（★ 收藏 / ☆ 未收藏）
  - `.saved-route-name` / `.saved-route-meta` / `.saved-route-commands`：路线信息文字样式
- `src/main.test.tsx` — 新增 `describe('Local route history persistence (TASK-004)')` 块含 10 个测试（总 22→32）：
  1. `pruneRecentRoutes` 对 25 条非 favorite 应用 RECENT_ROUTE_CAP=20 FIFO 淘汰（最旧 5 条淘汰，最新 20 条保留）
  2. `pruneRecentRoutes` 对 25 favorite + 25 非 favorite 保留全部 25 favorite + 20 条最新非 favorite（共 45 条）
  3. `saveRoute` + `loadSavedRoutes` 保留证据字段（sourceRefs / recommendationReasons / primaryRecommendations / secondaryRecommendations / schemaVersion / ruleVersion）
  4. localStorage.setItem 抛 QuotaExceededError 时降级到 sessionStore（saveRoute 仍可写入，loadSavedRoutes 从 sessionStore 读取）
  5. localStorage.getItem 抛 SecurityError 时降级到 sessionStore（loadSavedRoutes 不抛错返回空数组）
  6. `toggleFavorite` 切换 favorite 标记并持久化
  7. `[UI-observable]` saved-routes 浮动按钮渲染 + 点击打开 popover + 空态显示"暂无路线"
  8. `[UI-observable]` 选中场景后保存当前路线 → 列表显示 maestro-brainstorm + 空态消失
  9. `[UI-observable]` 点击星标将路线从 Recent 移到 Favorites 分区
  10. `[UI-observable]` 未选场景时"保存当前路线"按钮 disabled
  - 新增 `beforeEach(() => _resetRouteStorageState())` 隔离测试间存储状态
- `scripts/e2e-smoke.mjs` — 新增 6 段 `[UI-observable]` e2e 断言：
  1. saved-routes 浮动入口在画布中渲染且可见
  2. 打开前无 `.detail-panel` 永久右侧栏（count=0）
  3. canvas-shell 打开前填满视口宽度
  4. 点击浮动入口打开 saved-routes-popover
  5. 空态显示"暂无路线"
  6. 点击"保存当前路线"后列表渲染（list count>0）
  7. 保存后仍无 `.detail-panel` + canvas-shell 仍填满视口宽度（无永久右侧栏）

## Convergence Criteria Verification

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | src/main.tsx contains 'type SavedRoute' | PASS | `grep -c "type SavedRoute" src/main.tsx` → 1（`export type SavedRoute = { ... }`） |
| 2 | src/main.tsx contains 'maestro-wiki.saved-routes.v1' | PASS | `grep -c "maestro-wiki.saved-routes.v1" src/main.tsx` → 1（`const STORAGE_KEY = 'maestro-wiki.saved-routes.v1'`） |
| 3 | src/main.tsx contains 'schemaVersion' and 'ruleVersion' | PASS | `grep -c "schemaVersion" src/main.tsx` → 2（类型字段 + route 构造）；`grep -c "ruleVersion" src/main.tsx` → 2 |
| 4 | src/main.tsx contains 'RECENT_ROUTE_CAP' set to 20 or '20' | PASS | `export const RECENT_ROUTE_CAP = 20;` 常量定义 + `.slice(0, RECENT_ROUTE_CAP)` 使用 |
| 5 | src/main.tsx contains fallback to session memory on localStorage failure | PASS | `let sessionStore: SavedRoute[] = []` + `let usingSessionFallback = false`；`loadSavedRoutes` / `persistRoutes` 均 try/catch 包裹 localStorage 访问，catch 块设 `usingSessionFallback = true` 并操作 sessionStore |
| 6 | 'type SavedRoute' definition block contains none of canvasX/canvasY/absoluteX/absoluteY | PASS | `sed -n '/^export type SavedRoute = {/,/^};$/p' src/main.tsx \| grep -c "canvasX\|canvasY\|absoluteX\|absoluteY"` → 0 |
| 7 | src/main.test.tsx contains 'recent' and '20' cap assertion | PASS | `expect(RECENT_ROUTE_CAP).toBe(20);` + 测试名 `pruneRecentRoutes caps non-favorite recent routes at RECENT_ROUTE_CAP=20 (FIFO, oldest evicted)` |
| 8 | src/main.test.tsx contains 'favorites' preserved assertion | PASS | 测试名 `pruneRecentRoutes preserves all favorites beyond RECENT_ROUTE_CAP=20 cap`；`expect(pruned.filter((r) => r.favorite).length).toBe(25)` |
| 9 | npm test exits 0 | PASS | `Test Files 1 passed (1) / Tests 32 passed (32)`，退出码 0 |
| 10 | [UI-observable] npm run test:e2e exits 0 and verifies saved-routes floating entry renders and opens routes list without reintroducing permanent right sidebar | PASS | e2e 退出码 0；验证浮动入口渲染 + 点击打开 popover + 空态 + 保存路线 + 无 `.detail-panel` 永久右侧栏 + canvas-shell 始终填满视口宽度 |

附加验证：`npx tsc --noEmit` 退出码 0；`npm run build` 成功（165.90 kB JS + 9.78 kB CSS）。

## Project Spec Alignment

- **grill Q5.2 / C-014（route history localStorage 持久化）**：route history 使用 localStorage（`STORAGE_KEY = 'maestro-wiki.saved-routes.v1'`），recent 上限 20 条 FIFO（`RECENT_ROUTE_CAP = 20` + `pruneRecentRoutes` 按 createdAt 降序取前 20），favorites 无上限（`pruneRecentRoutes` 保留全部 favorites）；每条存推荐证据（`primaryRecommendations` / `secondaryRecommendations` / `recommendationReasons` / `sourceRefs`），MUST NOT 存画布坐标（SavedRoute 类型无 canvasX/canvasY/absoluteX/absoluteY）；读写容错降级会话内存（`sessionStore` + `usingSessionFallback` + try/catch 捕获 QuotaExceededError/SecurityError/一般异常）。
- **grill C-014（saved routes UI MUST NOT 重新引入永久大型右侧栏）**：saved-routes 入口为画布左下角浮动按钮（`.saved-routes-toggle`），点击打开浮层 popover（`.saved-routes-popover`），非永久右侧栏；e2e 验证 `.detail-panel` count=0 + canvas-shell 始终填满视口宽度。

## Deviations

1. **测试专用 `_resetRouteStorageState` 导出**：模块级 `sessionStore` / `usingSessionFallback` 无法在测试间自动重置。导出 `_resetRouteStorageState`（下划线前缀标记内部）供 `beforeEach` 调用，隔离测试间存储状态。非测试代码不调用此函数。
2. **`handleSaveCurrentRoute` 从 activeStep 构造 SavedRoute**：grill Q5.2 要求"每条存推荐证据"。从 `activeStep.command`（primary）、`activeStep.alternatives`（secondary）、`activeStep.purpose` + `activeStep.condition`（reasons）、`activeStep.citations` 映射到 `scenario.citations` 再转 `SourceRef[]`（sourceRefs）构造完整证据。`selectedCommandNodes` 用 `[activeStep.nodeId]` 表示当前选中命令节点。
3. **saved-routes popover 定位在左下角上方**：浮动按钮在 `bottom: 12px; left: 12px;`，popover 在 `bottom: 56px; left: 12px;`（按钮上方）。避免与右上角 `.fullscreen-toggle` 和左上角 `.scenario-label` 冲突。
4. **`loadSavedRoutes` 返回 `null` vs 空数组**：首次无数据（localStorage 无 key）返回 `null`，App mount 时 `if (loaded) setSavedRoutes(loaded)` 跳过 null 保持 `[]` 初始值。localStorage 抛错时返回 `sessionStore.slice()`（可能为空数组），App 仍正常运作。

## Notes for Downstream Tasks

- **TASK-004 为 M2 Phase 2 最后一个 task**：route history 持久化层完成，M2 Phase 2 全部 4 个 task（TASK-001 规则层 / TASK-002 画布壳 / TASK-003 popover+分支 / TASK-004 持久化）全部完成。
- **`saveRoute` / `toggleFavorite` / `loadSavedRoutes` 均已导出**：后续 Phase 3（route sharing / public gallery）可在这些函数基础上扩展后端同步。
- **`SCHEMA_VERSION` / `RULE_VERSION` 字段**：为后续 schema 迁移预留。若 SavedRoute 结构变更，可通过 `schemaVersion` 检测旧数据并迁移。
- **`usingSessionFallback` 一旦激活不可逆**：当前实现中，一旦 localStorage 抛错切换到 sessionStore，后续操作均在 sessionStore 上进行（不再尝试 localStorage）。如需恢复 localStorage，需页面刷新。这符合 grill C-014"继续运作"要求。
