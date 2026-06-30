---
session_id: BLP-canvas-maestro-command-recommender-2026-06-28
adr_id: ADR-006
status: accepted
created_at: 2026-06-30T09:50:00Z
supersedes:
  - ADR-002 (full, both data and rendering layers)
  - ADR-005 (rendering approach superseded; data layer migration record preserved)
---

# ADR-006: 表单驱动形态取代 Canvas 中心

## Decision

放弃「canvas 中心 + 节点本地推荐」的产品形态，回归并固化**表单驱动形态**：

- 任务输入框（textarea）+ flags 选项
- 场景卡片快捷入口
- 主操作按钮触发推荐
- 推荐结果面板展示（命令 / 链路 / 理由 / 置信度 / 澄清问题）
- **不做 canvas**，不做节点图主交互，不做多分支生长

当前 `src/App.tsx` wireframe 已是该形态的完整骨架，execute 阶段在其基础上接通数据与逻辑即可。

## Evidence

### 触发事件

用户决策（2026-06-30）：

> 我选 A，wireframe 可以的，原来的（canvas）就是一坨

### 选型理由

1. **Canvas 中心形态的认知负荷过高**：目标用户是「不知道用哪个命令」的新手，让他们在 canvas 上看节点分支 = 把他们扔进更复杂的图里。表单 + 结果面板是更直接的「问 → 答」闭环
2. **wireframe 已验证可用**：当前 `src/App.tsx` 是完整的表单驱动骨架，execute 可直接接数据
3. **Canvas 形态实施成本高**：React Flow 多分支生长 + 节点本地推荐 + 视觉复杂度控制（ADR-002 已作废约束），需要 3-5 倍工作量
4. **Canvas 与核心需求 R2 不匹配**：R2 要求「输入或选择场景后页面给出 1-3 个候选命令」，表单天然适合，canvas 反而绕
5. **@xyflow/react 12 保留为依赖**：但仍可用于后续「Maestro 运行流程」「命令地图」等只读可视化页面，**不作为推荐主交互**

## Consequences

### 与 ADR-002 的关系（完全取代）

ADR-002 的「branch-aware canvas state」（nodes / edges / recommendationGroups / activeBranchId）**整体作废**：

- ❌ 作废：nodes / edges 模型（无 canvas）
- ❌ 作废：recommendationGroups 多分支生长
- ❌ 作废：activeBranchId 激活分支追踪

**替代方案**：

- 推荐结果直接展示在结果面板，不进入节点
- 多 rank 推荐（high/medium/low confidence）通过结果面板分组展示，不需要 canvas 分支
- 「分支」概念映射为「结果卡片可点击展开子推荐」，但这是 v2+ 才考虑

### 与 ADR-005 的关系（渲染层重新取代）

ADR-005 把渲染层从 SVG 迁移到 React Flow；本 ADR 进一步**取消推荐交互的 canvas 渲染**：

- ✅ 保留：ADR-005 的 React 18 + Vite 6 + Tailwind 3 + @xyflow/react 12 技术栈
- ❌ 作废：ADR-005 中「Canvas UI 用 React Flow 渲染」用于推荐交互的部分
- ✅ 保留：@xyflow/react 仍可用于「运行流程」「命令地图」等只读可视化页面（design.md 信息架构 2/3 节）

### 与 REQ-003 / REQ-004 的关系（重写）

这两个 REQ 描述的是 canvas 形态，**整体重写**为表单形态需求（见同步修订的 REQ-003-v2 / REQ-004-v2）。

### 与 EPIC-002 的关系（重写）

EPIC-002 的 canvas interaction stories **整体重写**为 form interaction stories。

### 数据 Schema 简化

| 旧 canvas schema（作废） | 新表单 schema |
|----------------------|--------------|
| `nodes[]` | 无 |
| `edges[]` | 无 |
| `recommendationGroups[]` | `recommendationResult: { command, chain, rationale, confidence, clarifyingQuestions }` |
| `activeBranchId` | 无（结果面板单一展示） |
| `selectedNodeId` | `selectedScenarioId: ScenarioId \| null` |

### EPIC-002「Remove sidebar」天然满足

新 wireframe 没有 sidebar，该 story 直接 done。

## References

- `.monkeycode/specs/maestro-workflow-wiki/design.md` v2 信息架构 1（首页表单驱动）
- 当前代码 `src/App.tsx`（wireframe 已是该形态）
- 用户决策记录：2026-06-30 对话
