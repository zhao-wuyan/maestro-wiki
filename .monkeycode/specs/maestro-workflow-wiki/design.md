# Maestro 工作流百科网站设计草案 v2

> **版本说明**：本文件为 v2，对应 v0.2 技术栈（React 18 + Vite 6 + Tailwind 3 + @xyflow/react 12）。
> v1（design-v1.md）已归档，描述的是 v0.1 的纯 SVG 自研方案，仅作历史参考。
> 本文件与 `requirements.md` 一一对应：requirements 描述行为，design 描述技术决策。

## 推荐方向

在主仓库建设独立的 Vite + React 百科站。`maestro-flow` 子模块只作为内容参考，不复用其 `docs-site`，避免产品定位被原项目文档站约束。

**v0.2 技术栈决策**（详见末尾「决策记录 D-001 ~ D-005」）：

- React 18 + TypeScript 5 + Vite 6
- Tailwind CSS 3（暗色主题 + 自定义 canvas/accent 色板）
- @xyflow/react 12（原 React Flow，负责所有节点图/状态机/无限画布场景）
- Vitest 4 + Testing Library + jsdom（单元测试）

## 信息架构

5 个一级页面，由顶部导航切换。第一版仅落地「首页」，其余灰显带「即将」角标。

### 1. 首页：我该用哪个命令？

- 任务输入框（textarea，多行）
- 4 个附加选项（flags）：`-y` / `--dry-run` / `-c` / `--super`，chip 样式可勾选
- 主操作按钮「分析并推荐命令」
- 7 张场景卡片：探索想法 / 生成规格 / 分析代码 / 制定计划 / 执行实现 / 质量检查 / 查看状态
- 推荐结果区（5 字段）：推荐命令 / 推荐链路 / 推荐理由 / 置信度 / 需要澄清
- **wireframe 已完成**（`src/App.tsx`，待接数据）

### 2. Maestro 运行流程

- 用 @xyflow/react 渲染状态机流程图
- 节点对应 `S_PARSE` / `S_CLASSIFY` / `S_DECOMPOSE` / `S_CREATE` / `S_DISPATCH`
- 末尾接 Ralph 接力节点
- 重点解释：分类、分解、创建 session、交给 Ralph 执行
- 强调 `status.json` 是唯一真源
- 点击节点时在详情面板展示输入、输出、执行责任和常见误区

### 3. 命令地图

- 用 @xyflow/react 渲染按生命周期分组的命令拓扑
- 分组：探索层 / 规格层 / 分析层 / 计划层 / 执行层 / 质量层 / 知识层
- 每个节点展示适用场景、典型输入、输出产物、下一步

### 4. Ralph Session 解剖

- 展示 `status.json` 示例
- 逐字段解释 `steps[]` / `command_path` / `decision` / `completion_confirmed` / `task_decomposition`
- 支持**用户上传/粘贴自己的 status.json**（D-004），前端解析后高亮字段 + 解释下一步
- 提供「从 session 看下一步」的示例

### 5. 案例库

- 从「我要做一个新功能」到推荐 `brainstorm → blueprint → analyze → plan → execute`
- 从「修一个 bug」到推荐 `debug` 或 `quality-debug`
- 从「继续项目」到推荐 `continue/next/go` 的 state-based routing

## 命令推荐 Agent 设计

第一阶段使用**纯前端规则引擎**（D-003），不接后端 LLM。

### 输入

- 用户自然语言需求
- 可选 flags：`-y`、`--dry-run`、`-c`、`--super`
- 可选项目状态：用户粘贴或上传简化后的 `status.json`

### 输出

- `recommended_command`：主命令
- `chain_name`：推荐链路
- `confidence`：high / medium / low
- `classification_rationale`：匹配了哪些 pattern，排除了哪些备选
- `clarifying_questions`：最多 3 个问题

### 规则示例

- 「探索、想法、还不明确」→ `maestro-brainstorm`
- 「正式规格、PRD、blueprint」→ `maestro-blueprint`
- 「继续、下一步、go」→ state-based routing
- 「状态、dashboard」→ `manage-status`
- 「压力测试、拷问、验证假设」→ `maestro-grill`；自动模式下 → `maestro-brainstorm`

### 规则数据来源

所有推荐事实和规则必须可追溯到 `maestro-flow/` 源码（NFR-001 Provenance Integrity）：
- 命令元数据从 `maestro-flow/.claude/agents/` 和 `~/.agents/skills/*/SKILL.md` 提取
- 规则匹配关键词从 SKILL.md 的 trigger 描述中提取
- 每条规则带 `sourceRef`（文件路径 + 行号或锚点）

## 技术栈与组件设计

### 流程图实现（@xyflow/react）

所有节点图/状态机/命令地图/无限画布场景**统一用 @xyflow/react 12**（D-002）。

- 自定义节点组件（CustomNode）承载 Maestro 概念节点
- 内置能力直接满足 R3：pan / zoom / minimap / 节点点击 / 键盘聚焦（`nodesFocusable` + `elementsFocusable`）
- 详情面板联动通过 `onNodeClick` + 本地 state
- 布局用 `dagre`（已通过 `@xyflow/system` 间接可用）或手写坐标

### 数据 Schema 指针

具体字段定义在 Phase 2 execute 阶段产出 `src/data/schema.ts`，本文件只列高层结构：

- `CommandMeta`：单个 Maestro 命令的元数据（id / name / category / triggers / inputs / outputs / nextSteps / sourceRef）
- `RecommenderRule`：单条推荐规则（id / pattern / keywords / chainName / confidence / rationaleTemplate / sourceRef）
- `RecommendationResult`：推荐输出（command / chain / rationale / confidence / clarifyingQuestions）
- `StateMachineNode`：状态机节点元数据（id / label / inputs / outputs / responsibilities / pitfalls）

### 状态管理

- 组件本地 state（useState）：表单输入、选中态
- 必要时引入 Zustand（>2000 节点或跨页面共享才需要）

### 持久化

- localStorage（REQ-005 路由持久化）
- IndexedDB（仅在 status.json 上传/解析体积过大时升级）

## 实施分阶段

### 阶段 1：内容与导航（已部分完成）

- [x] 主仓库独立 Vite + React 应用
- [x] Tailwind + @xyflow/react 接入
- [x] 中文首页 wireframe（场景卡片 + flags + 结果区骨架）
- [ ] 中文百科首页和命令地图
- [ ] Maestro 可交互状态机流程图

### 阶段 2：推荐器 MVP

- [ ] 实现纯前端规则引擎
- [ ] 提供推荐理由和澄清问题
- [ ] 增加 10 个典型用户场景测试样例

### 阶段 3：Session 示例与交互

- [ ] 增加 `status.json` 示例浏览器
- [ ] 支持粘贴/上传 session JSON 后解释下一步
- [ ] 增加流程节点点击展开说明

### 阶段 4：可选 Agent 接入

- 在有明确后端和密钥管理方案后接入 LLM
- LLM 输出必须映射到固定 schema，前端展示置信度和理由

## 技术约束

- Vite dev server 需配置 `server.host: true` + `server.allowedHosts: ['.monkeycode-ai.online']`（前者支持预览代理，后者匹配预览域名）
- Tailwind 自定义色板用 `canvas.*` / `accent.*` 命名空间，避免与 Tailwind modifier 冲突（曾因 `accent.hover` 与 `:hover` modifier 冲突重命名为 `accent.dark`）
- 推荐器第一阶段运行在浏览器端，避免服务端依赖
- 所有规则/命令元数据必须可追溯 `maestro-flow/` 源码（NFR-001）
- 静态 MVP 边界（NFR-002）：第一阶段不接后端、不做用户登录、不持久化到云端
- submodule 内变更需要遵循 submodule 单独分支和提交流程
- 移动端响应式断点：sm 640px / md 768px / lg 1024px

---

## 决策记录

> 本节固化 v0.2 阶段已做出的关键决策，避免后续 plan/execute 基于过时假设返工。

### D-001：技术栈选定 React + Vite + Tailwind + @xyflow/react

- **决策**：放弃 v1 设计的「纯 SVG + React state 自研节点图」方案
- **理由**：节点图需求是项目核心（R3 状态机 + 命令地图 + 后续无限画布）；@xyflow/react 原生支持 pan/zoom/minimap/键盘聚焦/详情联动，自研 SVG 需 3-5 倍工作量
- **影响**：requirements.md R3 的「键盘聚焦」约束改由 React Flow `nodesFocusable` 配置满足

### D-002：流程图统一用 @xyflow/react（不混用 SVG）

- **决策**：所有节点图/状态机/命令地图场景统一用 React Flow，不再为「简单节点图」单独写 SVG
- **理由**：统一组件降低维护成本；React Flow 性能在 <2000 节点时无瓶颈
- **影响**：design-v1.md L67「使用 SVG 节点加 React 状态管理」表述作废

### D-003：推荐 Agent 第一阶段纯前端规则引擎

- **决策**：不接后端 LLM
- **理由**：避免密钥管理、CORS、延迟、成本；规则可追溯 maestro-flow 源码（满足 NFR-001）
- **影响**：design-v1.md 待澄清问题 2 已答

### D-004：网站语言中文优先

- **决策**：UI 文案中文优先，技术术语保留英文（如 `status.json` / `chain` / `decision`）
- **理由**：目标用户主要是中文开发者；i18n 工作量过大，第一阶段不做双语
- **影响**：design-v1.md 待澄清问题 1 已答；不引入 react-i18next

### D-005：第一版覆盖范围 = 主流程 + 常用 skill（约 20 个命令）

- **决策**：不覆盖全部 50+ skill，聚焦核心生命周期命令
- **覆盖范围**：maestro / ralph / ralph-execute 状态机 + brainstorm / blueprint / analyze / plan / execute / quality-review / quality-test / manage-status / learn-* 系列 / manage-* 系列（约 20 个）
- **影响**：design-v1.md 待澄清问题 3 已答

### D-006：支持用户上传/粘贴 status.json

- **决策**：R6 支持用户上传真实 status.json 进行解析
- **理由**：用户已明确表态要支持；纯前端 JSON.parse 即可，无需后端
- **影响**：design-v1.md 待澄清问题 5 已答；UI 需要文件上传组件 + JSON 校验 + 字段高亮

### D-007：流程图暂不支持用户自定义链路 + 分享

- **决策**：第一版流程图为只读展示，不支持用户拖拽组合链路 + URL 分享
- **理由**：自定义链路属于 Phase 3（M3-route-sharing-gallery）范畴
- **影响**：design-v1.md 待澄清问题 4 已答；M2 阶段流程图节点固定为状态机预定义节点
