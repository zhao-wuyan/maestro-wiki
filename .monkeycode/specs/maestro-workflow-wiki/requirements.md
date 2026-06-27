# Maestro 工作流百科网站需求草案

## 背景

`maestro-flow` 已作为上游子模块引入本仓库，但该子模块只作为 Maestro 工作流源码和文档参考来源。百科网站必须作为本仓库的独立产品建设，不复用 `maestro-flow/docs-site`，因为原文档站面向项目文档，而本项目面向“通俗理解、交互探索、命令选择辅助”。

当前需求目标是把 Maestro 的工作流、命令选择、Ralph session 执行机制用通俗方式展示出来，降低新用户理解成本和命令选择成本。

## 目标用户

- 初次接触 Maestro Flow 的开发者。
- 已了解 AI 编程工具，但难以判断该用哪个 Maestro 命令的用户。
- 想理解 `maestro`、`maestro-ralph`、`maestro-ralph-execute` 之间关系的高级用户。
- 希望把模糊需求转换为推荐命令链的用户。

## 核心需求

### R1：工作流百科内容

系统应提供 Maestro 核心概念解释，包括 intent classification、chain selection、session creation、Ralph execution、decision node、quality pipeline 和 knowledge system。

验收标准：用户能够在 5 分钟内理解 Maestro 的执行流程从“输入意图”到“Ralph 执行”的完整路径。

### R2：命令选择指南

系统应提供按任务场景组织的命令选择入口，例如探索、规格设计、分析、计划、执行、测试、复盘和状态查看。

验收标准：用户输入或选择自己的任务场景后，页面能给出 1 到 3 个候选命令，并说明选择原因和适用边界。

### R3：流程图展示

系统应使用可交互流程图展示 `maestro` 的状态机和典型链路，包括 `S_PARSE`、`S_CLASSIFY`、`S_DECOMPOSE`、`S_CREATE`、`S_DISPATCH`，以及 `maestro-ralph-execute` 的执行接力关系。

验收标准：每个流程图节点都可点击、可键盘聚焦，并在详情面板中展示输入、输出、下一步和常见误区。

### R4：通俗化说明

系统应提供“术语解释”和“用户场景解释”两种阅读模式。

验收标准：每个关键术语都有一句话解释、详细解释和一个实际使用示例。

### R5：需求分析与命令推荐 Agent

系统应提供一个可在网站运行的轻量 agent 或规则引擎，用于分析用户自然语言需求并推荐合适的 Maestro 命令、链路和是否需要澄清。

验收标准：用户输入模糊需求时，系统能输出推荐命令、推荐理由、置信度和需要补充的问题。

### R6：Session 可视化

系统应解释 `.workflow/.maestro/{session_id}/status.json` 中关键字段的含义，并展示 session 状态如何驱动下一步执行。

验收标准：用户能够通过示例理解 `steps[]`、`classification_rationale`、`task_decomposition`、`completion_confirmed` 的作用。

## 非目标

- 第一阶段不需要完整重写 `maestro-flow`。
- 第一阶段不复用 `maestro-flow/docs-site` 作为产品站点。
- 第一阶段不需要提供真实云端 LLM 调用。
- 第一阶段不需要支持用户登录、多租户或持久化个人历史。
- 第一阶段不需要修改 Maestro CLI 的执行语义。

## 待澄清问题

- 网站面向中文用户优先，还是中英文双语同步？
- 命令推荐 Agent 使用纯前端规则，还是接入后端 LLM API？
- 独立百科站第一版是否只覆盖 Maestro 主流程，还是同时覆盖所有技能命令？
- 可交互流程图是否需要支持用户自定义链路和保存分享？
- 第一阶段是否需要真实解析用户上传的 `status.json`？
