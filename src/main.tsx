import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type CitationStatus = 'cited' | 'pending' | 'platform-check';

type ScenarioCitation = {
  id: string;
  label: string;
  source: string;
  status: CitationStatus;
};

type ScenarioNode = {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  kind: 'input' | 'explore' | 'spec' | 'plan' | 'terminal';
  purpose: string;
  input: string;
  output: string;
  nextAction: string;
};

type ScenarioEdge = {
  from: string;
  to: string;
};

type ScenarioChoice = {
  id: string;
  label: string;
  condition: string;
  targetStepId?: string;
  routeId?: string;
};

type ContinuationRoute = {
  id: string;
  label: 'Stop' | 'Quality Pipeline' | 'Knowledge Capture';
  description: string;
};

type ValidationChecklistItem = {
  id: string;
  label: string;
};

type ScenarioStep = {
  id: string;
  nodeId: string;
  command: string;
  condition: string;
  purpose: string;
  input: string;
  output: string;
  nextAction: string;
  choices: ScenarioChoice[];
  alternatives: ScenarioChoice[];
  citations: string[];
  terminalRoutes?: string[];
};

type ScenarioModel = {
  id: string;
  title: string;
  summary: string;
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
  steps: ScenarioStep[];
  citations: ScenarioCitation[];
  continuationRoutes: ContinuationRoute[];
  checklist: ValidationChecklistItem[];
};

const fullProjectScenario: ScenarioModel = {
  id: 'A_full_project',
  title: 'Full Project',
  summary: '当需求还不清楚时，先探索，再规格化，最后进入 Phase 1 plan。',
  nodes: [
    {
      id: 'intent',
      title: '模糊目标',
      subtitle: '只有大方向',
      x: 70,
      y: 118,
      kind: 'input',
      purpose: '收集用户最初的自然语言目标。',
      input: '例如：我想做一个 Maestro 工作流百科网站。',
      output: '得到 intent text、主要约束和可讨论的问题。',
      nextAction: '如果边界不清，进入 brainstorm。',
    },
    {
      id: 'brainstorm',
      title: '探索方向',
      subtitle: 'maestro-brainstorm',
      x: 320,
      y: 118,
      kind: 'explore',
      purpose: '把模糊目标拆成可讨论的产品方向、用户路径和风险。',
      input: 'intent、现有项目状态、用户偏好。',
      output: '候选需求、关键决策和后续规格化输入。',
      nextAction: '如果方向稳定，进入 blueprint。',
    },
    {
      id: 'blueprint',
      title: '规格成型',
      subtitle: 'maestro-blueprint',
      x: 570,
      y: 118,
      kind: 'spec',
      purpose: '把探索结果固化为 requirements、ADR 和 epics。',
      input: 'brainstorm/grill 产物和用户确认的范围。',
      output: '可追踪的 blueprint package。',
      nextAction: '如果规格可执行，进入 phase analyze。',
    },
    {
      id: 'analyze',
      title: 'Phase 分析',
      subtitle: 'maestro-analyze 1',
      x: 820,
      y: 118,
      kind: 'spec',
      purpose: '验证 Phase 1 是否可 GO，并锁定实现边界。',
      input: 'roadmap、blueprint、代码现状。',
      output: 'ANL-001 context package 和 GO/NO-GO 结论。',
      nextAction: 'GO 后进入 plan。',
    },
    {
      id: 'plan',
      title: '执行计划',
      subtitle: 'maestro-plan 1',
      x: 570,
      y: 340,
      kind: 'plan',
      purpose: '把 Phase 1 拆成可执行任务和验证标准。',
      input: 'ANL-001 context-package、roadmap、项目 specs。',
      output: 'plan.json 和 TASK 文件。',
      nextAction: '确认后进入 execute。',
    },
    {
      id: 'done',
      title: '选择收尾路线',
      subtitle: 'stop / quality / knowledge',
      x: 320,
      y: 340,
      kind: 'terminal',
      purpose: '在闭合节点选择停止、质量管线或知识沉淀。',
      input: '执行证据、测试结果和是否仍有疑问。',
      output: '用户选择下一条路线。',
      nextAction: '只展示路线，不展开下游 pipeline 内部。',
    },
  ],
  edges: [
    { from: 'intent', to: 'brainstorm' },
    { from: 'brainstorm', to: 'blueprint' },
    { from: 'blueprint', to: 'analyze' },
    { from: 'analyze', to: 'plan' },
    { from: 'plan', to: 'done' },
  ],
  steps: [
    {
      id: 'start-brainstorm',
      nodeId: 'brainstorm',
      command: 'maestro-brainstorm',
      condition: '目标方向不清，用户还在探索“做什么”和“为什么”。',
      purpose: '发散需求并形成可讨论的候选范围。',
      input: '自然语言目标、初始限制、用户偏好。',
      output: '探索记录、关键问题、初步方案。',
      nextAction: '当核心路径明确时，推进到 maestro-blueprint。',
      choices: [
        { id: 'to-blueprint', label: '方向已稳定，生成规格', condition: '核心体验和约束已经明确。', targetStepId: 'write-blueprint' },
      ],
      alternatives: [
        { id: 'alt-grill', label: '先 grill 压力测试', condition: '方案听起来合理但还没被质疑。' },
        { id: 'alt-analyze', label: '直接 analyze', condition: '已有 roadmap/phase，只缺实现判断。' },
      ],
      citations: ['cmd-brainstorm', 'guide-flow'],
    },
    {
      id: 'write-blueprint',
      nodeId: 'blueprint',
      command: 'maestro-blueprint',
      condition: '探索结果足够稳定，需要正式 PRD/ADR/Epic。',
      purpose: '把讨论结果转成可追踪的规格包。',
      input: 'brainstorm/grill 结果、用户确认的范围。',
      output: 'blueprint context-package、requirements、architecture decisions。',
      nextAction: '用 roadmap/analyze 判断第一阶段是否能执行。',
      choices: [
        { id: 'to-analyze', label: '规格可执行，分析 Phase 1', condition: '已有 Phase 1 目标和成功标准。', targetStepId: 'analyze-phase' },
      ],
      alternatives: [
        { id: 'alt-roadmap', label: '先 roadmap', condition: '目标跨多个版本或里程碑。' },
      ],
      citations: ['cmd-blueprint', 'guide-flow'],
    },
    {
      id: 'analyze-phase',
      nodeId: 'analyze',
      command: 'maestro-analyze 1',
      condition: '已有 Phase 1，但仍需确认实现边界和风险。',
      purpose: '评估 GO/NO-GO，锁定实现范围、限制和验证方式。',
      input: 'roadmap、blueprint、代码现状。',
      output: 'ANL-001 context package。',
      nextAction: 'GO 后生成执行计划。',
      choices: [
        { id: 'to-plan', label: '分析结论为 GO，进入计划', condition: 'recommendation=GO 且 confidence 足够。', targetStepId: 'plan-phase' },
      ],
      alternatives: [
        { id: 'alt-more-analysis', label: '补充分析', condition: '引用来源、验证门槛或范围仍不明确。' },
      ],
      citations: ['cmd-analyze', 'guide-flow'],
    },
    {
      id: 'plan-phase',
      nodeId: 'plan',
      command: 'maestro-plan 1',
      condition: '分析产物已完成，下一步需要可执行任务。',
      purpose: '生成 plan.json 和 TASK 文件。',
      input: 'ANL-001 context-package、roadmap、specs。',
      output: 'Phase 1 execution plan。',
      nextAction: '确认计划后执行，或在闭合节点选择路线。',
      choices: [
        { id: 'to-terminal', label: '计划完成，选择后续路线', condition: 'plan 已确认或需要停止。', targetStepId: 'terminal-routes' },
      ],
      alternatives: [
        { id: 'alt-execute', label: '继续 maestro-execute 1', condition: '用户已确认计划并允许执行。' },
      ],
      citations: ['cmd-plan', 'guide-flow'],
    },
    {
      id: 'terminal-routes',
      nodeId: 'done',
      command: 'route-choice',
      condition: '当前 step 已到闭合点，需要决定是否继续。',
      purpose: '让用户选择停止、质量管线或知识沉淀。',
      input: '当前计划/执行证据。',
      output: '下一条路线选择。',
      nextAction: '选择 route，但不展开 pipeline 内部。',
      choices: [
        { id: 'route-stop', label: '停止', condition: '目标已经满足。', routeId: 'stop' },
        { id: 'route-quality', label: '进入质量管线', condition: '需要 review/test/verify。', routeId: 'quality' },
        { id: 'route-knowledge', label: '进入知识沉淀', condition: '需要固化经验或规则。', routeId: 'knowledge' },
      ],
      alternatives: [],
      citations: ['cmd-ralph', 'codex-skill'],
      terminalRoutes: ['stop', 'quality', 'knowledge'],
    },
  ],
  citations: [
    { id: 'cmd-brainstorm', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-brainstorm.md', status: 'cited' },
    { id: 'cmd-blueprint', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-blueprint.md', status: 'cited' },
    { id: 'cmd-analyze', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-analyze.md', status: 'cited' },
    { id: 'cmd-plan', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-plan.md', status: 'cited' },
    { id: 'cmd-ralph', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-ralph.md', status: 'pending' },
    { id: 'guide-flow', label: 'Guide sequence', source: 'maestro-flow/guide/*.md', status: 'pending' },
    { id: 'codex-skill', label: 'Codex skill mirror', source: 'maestro-flow/.codex/skills/*/SKILL.md', status: 'platform-check' },
  ],
  continuationRoutes: [
    { id: 'stop', label: 'Stop', description: '当前目标已完成，停止本轮链路。' },
    { id: 'quality', label: 'Quality Pipeline', description: '继续进入 review、test 和 frontend verification。' },
    { id: 'knowledge', label: 'Knowledge Capture', description: '把本轮经验沉淀为 specs、knowhow 或 wiki。' },
  ],
  checklist: [
    { id: 'check-command', label: '我能说出当前推荐 command 及其原因。' },
    { id: 'check-next', label: '我能根据输出条件选择下一步。' },
    { id: 'check-route', label: '我能在闭合节点选择 Stop、Quality Pipeline 或 Knowledge Capture。' },
  ],
};

const smallFixScenario: ScenarioModel = {
  id: 'D_small_fix',
  title: 'Small Fix',
  summary: '小修复场景: plan→execute→review,无 analyze 前置',
  nodes: [
    {
      id: 'plan',
      title: '规划',
      subtitle: 'maestro-plan',
      x: 70,
      y: 118,
      kind: 'plan',
      purpose: '把小修复任务拆成可执行步骤和验证标准。',
      input: 'bug 描述、复现路径、项目 specs。',
      output: 'plan.json 和 TASK 文件。',
      nextAction: '确认后进入 execute。',
    },
    {
      id: 'execute',
      title: '执行',
      subtitle: 'maestro-execute',
      x: 320,
      y: 118,
      kind: 'plan',
      purpose: '按 plan.json 执行 TASK 并自动提交。',
      input: 'plan.json、TASK 文件、项目 specs。',
      output: '代码改动、提交记录、验证证据。',
      nextAction: '执行结束后进入 review。',
    },
    {
      id: 'review',
      title: '评审',
      subtitle: 'quality-review',
      x: 570,
      y: 118,
      kind: 'terminal',
      purpose: '多维度代码质量审查并选择收尾路线。',
      input: '执行证据、git diff、项目 specs。',
      output: '审查报告与改进建议。',
      nextAction: '审查通过后选择 Stop 收尾。',
    },
  ],
  edges: [
    { from: 'plan', to: 'execute' },
    { from: 'execute', to: 'review' },
  ],
  steps: [
    {
      id: 'step-d-plan',
      nodeId: 'plan',
      command: 'maestro-plan',
      condition: '已有明确 bug 描述，需要快速拆解任务（无 analyze 前置）。',
      purpose: '生成 plan.json 和 TASK 文件。',
      input: 'bug 描述、复现路径、specs。',
      output: 'Phase 执行计划。',
      nextAction: '确认计划后进入 execute。',
      choices: [],
      alternatives: [],
      citations: ['cmd-plan', 'guide-flow'],
    },
    {
      id: 'step-d-execute',
      nodeId: 'execute',
      command: 'maestro-execute',
      condition: '计划已确认，进入实现阶段。',
      purpose: '按 plan.json wave 并行执行 TASK 并自动提交。',
      input: 'plan.json、TASK 文件、项目 specs。',
      output: '代码改动、提交记录、验证证据。',
      nextAction: '执行结束后进入 review。',
      choices: [],
      alternatives: [],
      citations: ['cmd-execute', 'guide-flow'],
    },
    {
      id: 'step-d-review',
      nodeId: 'review',
      command: 'quality-review',
      condition: '执行已完成，需要审查代码质量。',
      purpose: '多维度代码质量审查（正确性、安全、性能、架构）。',
      input: '执行证据、git diff、项目 specs。',
      output: '审查报告与改进建议。',
      nextAction: '审查通过后选择 Stop 收尾。',
      choices: [],
      alternatives: [],
      citations: ['cmd-review', 'codex-skill'],
      terminalRoutes: ['stop'],
    },
  ],
  citations: [
    { id: 'cmd-plan', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-plan.md', status: 'cited' },
    { id: 'cmd-execute', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-execute.md', status: 'cited' },
    { id: 'cmd-review', label: 'Command definition', source: 'maestro-flow/.claude/commands/quality-review.md', status: 'cited' },
    { id: 'guide-flow', label: 'Guide sequence', source: 'maestro-flow/guide/*.md', status: 'pending' },
    { id: 'codex-skill', label: 'Codex skill mirror', source: 'maestro-flow/.codex/skills/*/SKILL.md', status: 'platform-check' },
  ],
  continuationRoutes: [
    { id: 'stop', label: 'Stop', description: '小修复完成' },
  ],
  checklist: [
    { id: 'check-command', label: '我能说出当前推荐 command 及其原因。' },
    { id: 'check-next', label: '我能根据输出条件选择下一步。' },
    { id: 'check-route', label: '我能在闭合节点选择 Stop。' },
  ],
};

const exploreOnlyScenario: ScenarioModel = {
  id: 'F_explore_only',
  title: 'Explore Only',
  summary: '探索场景: brainstorm→人工决策,无后续执行',
  nodes: [
    {
      id: 'brainstorm',
      title: '探索方向',
      subtitle: 'maestro-brainstorm',
      x: 70,
      y: 118,
      kind: 'explore',
      purpose: '发散需求并形成可讨论的候选范围。',
      input: '自然语言目标、初始限制、用户偏好。',
      output: '探索记录、关键问题、初步方案。',
      nextAction: '探索结束后进入人工决策。',
    },
    {
      id: 'decision',
      title: '人工决策',
      subtitle: 'terminal',
      x: 320,
      y: 118,
      kind: 'terminal',
      purpose: '由人工决定下一步路线。',
      input: '探索产物、候选方案。',
      output: '人工决策结果。',
      nextAction: '选择 Stop 结束探索。',
    },
  ],
  edges: [
    { from: 'brainstorm', to: 'decision' },
  ],
  steps: [
    {
      id: 'step-f-brainstorm',
      nodeId: 'brainstorm',
      command: 'maestro-brainstorm',
      condition: '目标方向不清，用户还在探索“做什么”和“为什么”。',
      purpose: '发散需求并形成可讨论的候选范围。',
      input: '自然语言目标、初始限制、用户偏好。',
      output: '探索记录、关键问题、初步方案。',
      nextAction: '探索结束后进入人工决策。',
      choices: [],
      alternatives: [],
      citations: ['cmd-brainstorm', 'guide-flow'],
      terminalRoutes: ['stop'],
    },
  ],
  citations: [
    { id: 'cmd-brainstorm', label: 'Command definition', source: 'maestro-flow/.claude/commands/maestro-brainstorm.md', status: 'cited' },
    { id: 'guide-flow', label: 'Guide sequence', source: 'maestro-flow/guide/*.md', status: 'pending' },
  ],
  continuationRoutes: [
    { id: 'stop', label: 'Stop', description: '探索结束,待人工决策' },
  ],
  checklist: [
    { id: 'check-command', label: '我能说出当前推荐 command 及其原因。' },
    { id: 'check-next', label: '我能根据输出条件选择下一步。' },
    { id: 'check-route', label: '我能在闭合节点选择 Stop。' },
  ],
};

export const scenarioRegistry: ScenarioModel[] = [
  fullProjectScenario,
  smallFixScenario,
  exploreOnlyScenario,
];

function validateScenarioReferences(scenario: ScenarioModel) {
  const stepIds = new Set(scenario.steps.map((step) => step.id));
  const nodeIds = new Set(scenario.nodes.map((node) => node.id));
  const routeIds = new Set(scenario.continuationRoutes.map((route) => route.id));

  return scenario.steps.flatMap((step) => {
    const messages: string[] = [];
    if (!nodeIds.has(step.nodeId)) messages.push(`${step.id} points to missing node ${step.nodeId}`);
    step.choices.forEach((choice) => {
      if (choice.targetStepId && !stepIds.has(choice.targetStepId)) messages.push(`${choice.id} points to missing step ${choice.targetStepId}`);
      if (choice.routeId && !routeIds.has(choice.routeId)) messages.push(`${choice.id} points to missing route ${choice.routeId}`);
    });
    step.terminalRoutes?.forEach((routeId) => {
      if (!routeIds.has(routeId)) messages.push(`${step.id} points to missing route ${routeId}`);
    });
    return messages;
  });
}

function validateCitationCoverage(scenario: ScenarioModel) {
  const citationIds = new Set(scenario.citations.map((citation) => citation.id));
  return scenario.steps.flatMap((step) =>
    step.citations
      .filter((citationId) => !citationIds.has(citationId))
      .map((citationId) => `${step.id} references missing citation ${citationId}`),
  );
}

export const scenarioValidation = scenarioRegistry.map((s) => ({
  id: s.id,
  references: validateScenarioReferences(s),
  citations: validateCitationCoverage(s),
}));

// ============================================================
// Phase 2 — Local Canvas Recommender (CommandRuleSet layer)
//
// Types, authored command facts, RecommendationRule[], recommendCommands()
// and validateRuleSet() live here. The ScenarioModel above is retained per
// grill Q4.1 (data model preserved, rendering rewritten in TASK-002/TASK-003).
//
// Evidence fields (purpose/input/output/nextAction/alternatives/sourceStatus)
// are carried by RecommendationGroup so the TASK-003 popover can render them
// without re-deriving from rules. sourceRef.path MUST start with `maestro-flow/`
// per decision #9 (submodule sources only).
// ============================================================

type SourceRef = {
  path: string;
  label: string;
  status: 'cited' | 'pending' | 'platform-check';
};

type CommandFact = {
  id: string;
  command: string;
  purpose: string;
  condition: string;
  input: string;
  output: string;
  nextAction: string;
  sourceRefs: SourceRef[];
};

export type RecommendationRule = {
  id: string;
  scenarioId: string;
  condition: string;
  commandFacts: CommandFact[];
  alternatives: CommandFact[];
  priority: 'primary' | 'secondary';
};

type RecommendationGroup = {
  id: string;
  scenarioId: string;
  condition: string;
  primary: CommandFact[];
  secondary: CommandFact[];
  purpose: string;
  input: string;
  output: string;
  nextAction: string;
  alternatives: CommandFact[];
  sourceStatus: SourceRef[];
};

export type SimulatedProjectState = {
  milestone: string;
  phase: number;
  hasBlueprint: boolean;
  hasAnalyze: boolean;
  hasPlan: boolean;
  hasExecute: boolean;
  intentClarity: 'unclear' | 'semi-clear' | 'clear';
  taskType: 'new' | 'continue' | 'bugfix' | 'explore';
};

const sourceRefCatalog: SourceRef = {
  path: 'maestro-flow/.codex/skills/maestro-help/catalog.json',
  label: 'Maestro command catalog (single source of truth)',
  status: 'cited',
};

const sourceRefNext: SourceRef = {
  path: 'maestro-flow/.claude/commands/maestro-next.md',
  label: 'maestro-next routing table and lifecycle position scoring',
  status: 'cited',
};

const sourceRefCommand = (name: string): SourceRef => ({
  path: `maestro-flow/.claude/commands/${name}.md`,
  label: `${name} command definition`,
  status: 'cited',
});

const factBrainstorm: CommandFact = {
  id: 'fact-brainstorm',
  command: 'maestro-brainstorm',
  purpose: '发散需求并形成可讨论的候选范围。',
  condition: '目标方向不清，用户还在探索"做什么"和"为什么"。',
  input: '自然语言目标、初始限制、用户偏好。',
  output: '探索记录、关键问题、初步方案。',
  nextAction: '当核心路径明确时，推进到 maestro-blueprint。',
  sourceRefs: [sourceRefCommand('maestro-brainstorm'), sourceRefCatalog, sourceRefNext],
};

const factBlueprint: CommandFact = {
  id: 'fact-blueprint',
  command: 'maestro-blueprint',
  purpose: '把讨论结果转成可追踪的规格包。',
  condition: '探索结果足够稳定，需要正式 PRD/ADR/Epic。',
  input: 'brainstorm/grill 结果、用户确认的范围。',
  output: 'blueprint context-package、requirements、architecture decisions。',
  nextAction: '用 roadmap/analyze 判断第一阶段是否能执行。',
  sourceRefs: [sourceRefCommand('maestro-blueprint'), sourceRefCatalog, sourceRefNext],
};

const factAnalyze: CommandFact = {
  id: 'fact-analyze',
  command: 'maestro-analyze',
  purpose: '评估 GO/NO-GO，锁定实现范围、限制和验证方式。',
  condition: '已有 Phase 目标，但仍需确认实现边界和风险。',
  input: 'roadmap、blueprint、代码现状。',
  output: 'ANL-xxx context package 和 GO/NO-GO 结论。',
  nextAction: 'GO 后生成执行计划。',
  sourceRefs: [sourceRefCommand('maestro-analyze'), sourceRefCatalog, sourceRefNext],
};

const factPlan: CommandFact = {
  id: 'fact-plan',
  command: 'maestro-plan',
  purpose: '把 Phase 拆成可执行任务和验证标准。',
  condition: '分析产物已完成，下一步需要可执行任务。',
  input: 'ANL-xxx context-package、roadmap、specs。',
  output: 'plan.json 和 TASK 文件。',
  nextAction: '确认计划后执行，或在闭合节点选择路线。',
  sourceRefs: [sourceRefCommand('maestro-plan'), sourceRefCatalog, sourceRefNext],
};

const factExecute: CommandFact = {
  id: 'fact-execute',
  command: 'maestro-execute',
  purpose: '按 plan.json wave 并行执行 TASK 并自动提交。',
  condition: '计划已确认，进入实现阶段。',
  input: 'plan.json、TASK 文件、项目 specs。',
  output: '代码改动、提交记录、验证证据。',
  nextAction: '执行结束后进入质量门（review/test）。',
  sourceRefs: [sourceRefCommand('maestro-execute'), sourceRefCatalog, sourceRefNext],
};

const factReview: CommandFact = {
  id: 'fact-review',
  command: 'quality-review',
  purpose: '多维度代码质量审查（正确性、安全、性能、架构）。',
  condition: '执行已完成，需要审查代码质量。',
  input: '执行证据、git diff、项目 specs。',
  output: '审查报告与改进建议。',
  nextAction: '审查 PASS 后进入测试或里程碑审计。',
  sourceRefs: [sourceRefCommand('quality-review'), sourceRefCatalog, sourceRefNext],
};

const factTest: CommandFact = {
  id: 'fact-test',
  command: 'quality-test',
  purpose: '会话式 UAT 验证，闭合需求与实现差距。',
  condition: '执行已完成，需要业务验收测试。',
  input: '需求文档、实现产物、用户场景。',
  output: 'UAT 结果与 gap 清单。',
  nextAction: 'gap 闭合后进入里程碑审计或知识沉淀。',
  sourceRefs: [sourceRefCommand('quality-test'), sourceRefCatalog, sourceRefNext],
};

const factRalphExecute: CommandFact = {
  id: 'fact-ralph-execute',
  command: 'maestro-ralph-execute',
  purpose: '运行自适应决策链，按 state 推进下一个 pending step。',
  condition: '已有 plan/session，希望由 ralph 引擎自动推进。',
  input: 'ralph session、plan.json、项目状态。',
  output: '下一个 step 执行结果与状态更新。',
  nextAction: 'session 完成后进入质量门或里程碑审计。',
  sourceRefs: [sourceRefCommand('maestro-ralph-execute'), sourceRefCatalog, sourceRefNext],
};

export const authoredRules: RecommendationRule[] = [
  {
    id: 'rule-explore-unclear',
    scenarioId: 'A_full_project',
    condition: 'intentClarity=unclear, no blueprint',
    commandFacts: [factBrainstorm],
    alternatives: [factBlueprint],
    priority: 'primary',
  },
  {
    id: 'rule-explore-semi-clear',
    scenarioId: 'A_full_project',
    condition: 'intentClarity=semi-clear, no blueprint (equal-rank: brainstorm vs blueprint)',
    commandFacts: [factBrainstorm, factBlueprint],
    alternatives: [factAnalyze],
    priority: 'primary',
  },
  {
    id: 'rule-explore-clear',
    scenarioId: 'A_full_project',
    condition: 'intentClarity=clear, no blueprint',
    commandFacts: [factBlueprint],
    alternatives: [factBrainstorm],
    priority: 'primary',
  },
  {
    id: 'rule-analyze',
    scenarioId: 'phase-analysis',
    condition: 'hasBlueprint, no analyze',
    commandFacts: [factAnalyze],
    alternatives: [factPlan],
    priority: 'primary',
  },
  {
    id: 'rule-plan',
    scenarioId: 'phase-planning',
    condition: 'hasAnalyze, no plan',
    commandFacts: [factPlan],
    alternatives: [factExecute, factRalphExecute],
    priority: 'primary',
  },
  {
    id: 'rule-execute',
    scenarioId: 'phase-execution',
    condition: 'hasPlan, no execute (equal-rank when intent unclear: execute vs ralph-execute)',
    commandFacts: [factExecute, factRalphExecute],
    alternatives: [],
    priority: 'primary',
  },
  {
    id: 'rule-quality-gate',
    scenarioId: 'phase-quality',
    condition: 'hasExecute (equal-rank: review vs test)',
    commandFacts: [factReview, factTest],
    alternatives: [],
    priority: 'primary',
  },
  {
    id: 'rule-plan-direct',
    scenarioId: 'D_small_fix',
    condition: 'taskType=bugfix, no plan (无 analyze 前置)',
    commandFacts: [factPlan],
    alternatives: [factExecute],
    priority: 'primary',
  },
  {
    id: 'rule-explore-only',
    scenarioId: 'F_explore_only',
    condition: 'taskType=explore, no blueprint',
    commandFacts: [factBrainstorm],
    alternatives: [],
    priority: 'primary',
  },
];

function ruleApplies(rule: RecommendationRule, state: SimulatedProjectState): boolean {
  switch (rule.id) {
    case 'rule-explore-unclear':
      return !state.hasBlueprint && state.intentClarity === 'unclear';
    case 'rule-explore-semi-clear':
      return !state.hasBlueprint && state.intentClarity === 'semi-clear';
    case 'rule-explore-clear':
      return !state.hasBlueprint && state.intentClarity === 'clear';
    case 'rule-analyze':
      return state.hasBlueprint && !state.hasAnalyze;
    case 'rule-plan':
      return state.hasAnalyze && !state.hasPlan;
    case 'rule-execute':
      return state.hasPlan && !state.hasExecute;
    case 'rule-plan-direct':
      return state.taskType === 'bugfix' && !state.hasPlan;
    case 'rule-explore-only':
      return state.taskType === 'explore' && !state.hasBlueprint;
    case 'rule-quality-gate':
      return state.hasExecute;
    default:
      return false;
  }
}

function toRecommendationGroup(rule: RecommendationRule): RecommendationGroup {
  const allFacts = [...rule.commandFacts, ...rule.alternatives];
  const sourceStatus: SourceRef[] = Array.from(
    new Map(allFacts.flatMap((fact) => fact.sourceRefs).map((ref) => [ref.path, ref])).values(),
  );
  const head = rule.commandFacts[0];
  const isEqualRank = rule.commandFacts.length > 1;
  return {
    id: rule.id.replace('rule-', 'grp-'),
    scenarioId: rule.scenarioId,
    condition: rule.condition,
    primary: rule.commandFacts,
    secondary: [],
    purpose: isEqualRank
      ? `equal-rank 推荐含 ${rule.commandFacts.length} 个并列命令：${rule.commandFacts.map((fact) => fact.command).join(' / ')}。`
      : head.purpose,
    input: head.input,
    output: head.output,
    nextAction: head.nextAction,
    alternatives: rule.alternatives,
    sourceStatus,
  };
}

export function recommendCommands(state: SimulatedProjectState): RecommendationGroup[] {
  return authoredRules.filter((rule) => ruleApplies(rule, state)).map(toRecommendationGroup);
}

export function validateRuleSet(ruleSet: RecommendationRule[]): string[] {
  const errors: string[] = [];
  for (const rule of ruleSet) {
    if (rule.commandFacts.length === 0) {
      errors.push(`${rule.id}: missing command references (commandFacts empty)`);
    }
    const checkFact = (fact: CommandFact, slot: string) => {
      if (fact.sourceRefs.length === 0) {
        errors.push(`${rule.id}/${slot}-${fact.id}: missing sourceRefs`);
      }
      for (const ref of fact.sourceRefs) {
        if (!ref.path.startsWith('maestro-flow/')) {
          errors.push(`${rule.id}/${slot}-${fact.id}: sourceRef.path "${ref.path}" does not start with maestro-flow/`);
        }
      }
    };
    rule.commandFacts.forEach((fact) => checkFact(fact, 'primary'));
    rule.alternatives.forEach((fact) => checkFact(fact, 'alt'));
  }
  return errors;
}

// ============================================================
// Phase 2 / TASK-004 — Local route history persistence (grill Q5.2 / C-014)
//
// localStorage-backed route history with FIFO eviction. Recent (non-favorite)
// routes are capped at RECENT_ROUTE_CAP=20; favorites have no cap. Each
// SavedRoute stores recommendation evidence (selected command nodes, primary
// and secondary recommendations, reasons, sourceRefs) and MUST NOT store
// canvas coordinates (grill C-014). All localStorage access is wrapped in
// try/catch and degrades to a module-level session memory store on failure
// (QuotaExceededError / SecurityError / general exceptions).
// ============================================================

export type SavedRoute = {
  id: string;
  name: string;
  createdAt: string;
  favorite: boolean;
  scenarioId: string;
  selectedCommandNodes: string[];
  primaryRecommendations: string[];
  secondaryRecommendations: string[];
  recommendationReasons: string[];
  sourceRefs: SourceRef[];
  schemaVersion: number;
  ruleVersion: string;
};

export const RECENT_ROUTE_CAP = 20;
const STORAGE_KEY = 'maestro-wiki.saved-routes.v1';
const SCHEMA_VERSION = 1;
const RULE_VERSION = 'M2-P2-rules-v1';

// Module-level session memory fallback (grill C-014: degrade to in-session
// memory when localStorage is unavailable or throws).
let sessionStore: SavedRoute[] = [];
let usingSessionFallback = false;

export function _resetRouteStorageState(): void {
  // Test-only helper: resets module-level storage state so unit tests can
  // isolate scenarios without leakage from prior test cases.
  sessionStore = [];
  usingSessionFallback = false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore — localStorage may be mocked to throw in tests
  }
}

export function loadSavedRoutes(): SavedRoute[] | null {
  try {
    if (usingSessionFallback) {
      return sessionStore.slice();
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as SavedRoute[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (error) {
    // QuotaExceededError, SecurityError, or general parse/access failure:
    // activate session fallback so subsequent reads/writes keep working.
    usingSessionFallback = true;
    return sessionStore.slice();
  }
}

export function pruneRecentRoutes(routes: SavedRoute[]): SavedRoute[] {
  const favorites = routes.filter((route) => route.favorite);
  const recent = routes
    .filter((route) => !route.favorite)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_ROUTE_CAP);
  return [...favorites, ...recent];
}

function persistRoutes(routes: SavedRoute[]): void {
  try {
    if (usingSessionFallback) {
      sessionStore = routes.slice();
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  } catch (error) {
    // QuotaExceededError or SecurityError — flip into session fallback
    // and keep operating on in-session memory (grill C-014).
    usingSessionFallback = true;
    sessionStore = routes.slice();
  }
}

export function saveRoute(route: SavedRoute): void {
  const current = loadSavedRoutes() ?? [];
  const next = pruneRecentRoutes([...current, route]);
  persistRoutes(next);
}

export function toggleFavorite(id: string): void {
  const current = loadSavedRoutes() ?? [];
  const next = current.map((route) =>
    route.id === id ? { ...route, favorite: !route.favorite } : route,
  );
  persistRoutes(next);
}

// ============================================================
// Phase 2 / TASK-002 — Fullscreen pan/zoom canvas shell
//
// Constants and helpers below power the new rendering layer per
// grill Q1.1/Q1.2/Q1.3/Q3.1/Q3.2/Q3.3/Q4.1/Q4.3/Q5.1. The data
// model (ScenarioModel + RecommendationRule) is preserved; only the
// rendering layer is rewritten.
// ============================================================

const PAN_THRESHOLD = 4;
const VIEWPORT_BUFFER = 120;
const NODE_WIDTH = 190;
const NODE_HEIGHT = 88;
const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const DEFAULT_VIEWPORT = { width: 1024, height: 600 };

// Swimlane branch layout constants (grill Q4.2 / C-011):
// main path extends rightward along horizontal axis with shared y;
// alternative/parallel branches offset up/down with alternating sign.
// Pure arithmetic — no graphics library.
const MAIN_LINE_GAP = 220;
const BRANCH_OFFSET = 90;
const MAIN_LINE_Y = 200;
const BASE_X = 40;
const LONG_PRESS_MS = 500;

type CanvasTransform = { x: number; y: number; scale: number };
type ViewportSize = { width: number; height: number };

export function isVisibleNode(
  node: Pick<ScenarioNode, 'x' | 'y'>,
  transform: CanvasTransform,
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  const mappedX = node.x * transform.scale + transform.x;
  const mappedY = node.y * transform.scale + transform.y;
  const mappedW = NODE_WIDTH * transform.scale;
  const mappedH = NODE_HEIGHT * transform.scale;
  return (
    mappedX + mappedW >= -VIEWPORT_BUFFER &&
    mappedX <= viewportWidth + VIEWPORT_BUFFER &&
    mappedY + mappedH >= -VIEWPORT_BUFFER &&
    mappedY <= viewportHeight + VIEWPORT_BUFFER
  );
}

function clampScale(scale: number): number {
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
}

export function App() {
  const scenario = fullProjectScenario;
  const [activeStepId, setActiveStepId] = useState(scenario.steps[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>({ x: 0, y: 0, scale: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasSelectedScenario, setHasSelectedScenario] = useState(false);
  const [viewportSize, setViewportSize] = useState<ViewportSize>(DEFAULT_VIEWPORT);
  const [isPanning, setIsPanning] = useState(false);
  const [popover, setPopover] = useState<{ nodeId: string; x: number; y: number } | null>(null);
  const [savedRoutesOpen, setSavedRoutesOpen] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);

  const canvasShellRef = useRef<HTMLDivElement | null>(null);
  const pointerStateRef = useRef<{
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    isPanning: boolean;
  } | null>(null);
  const lastGestureWasPanRef = useRef(false);
  const longPressTimerRef = useRef<number | null>(null);

  const activeStep = useMemo(
    () => scenario.steps.find((step) => step.id === activeStepId) ?? scenario.steps[0],
    [activeStepId, scenario.steps],
  );
  const selectedNode = useMemo(
    () => scenario.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId, scenario.nodes],
  );
  const activeNodeIds = useMemo(
    () =>
      new Set(
        scenario.steps
          .slice(0, scenario.steps.findIndex((step) => step.id === activeStep.id) + 1)
          .map((step) => step.nodeId),
      ),
    [activeStep.id, scenario.steps],
  );

  const revealedNodeIds = useMemo(() => {
    const intentNodeId = scenario.nodes[0].id;
    if (!hasSelectedScenario) {
      return new Set<string>([intentNodeId]);
    }
    return new Set<string>([intentNodeId, ...Array.from(activeNodeIds)]);
  }, [hasSelectedScenario, activeNodeIds, scenario.nodes]);

  // Swimlane layout (grill Q4.2): main path nodes extend rightward along
  // horizontal axis with shared y; positions computed via geometry rules.
  const nodeLayout = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    scenario.nodes.forEach((node, index) => {
      map.set(node.id, { x: BASE_X + index * MAIN_LINE_GAP, y: MAIN_LINE_Y });
    });
    return map;
  }, [scenario.nodes]);

  const getNodePos = (nodeId: string): { x: number; y: number } =>
    nodeLayout.get(nodeId) ?? { x: 0, y: 0 };

  // Unified canvas branch list for the active node (grill Q1.2/Q2.2):
  // - Next Choices (step.choices with targetStepId) advance the active step
  // - Continuation Routes (step.terminalRoutes) render as terminal canvas
  //   branches reusing continuationRoutes data — MUST NOT be a standalone
  //   panel or popover-internal buttons (grill C-005)
  // - Alternatives (step.alternatives) render as secondary swimlane branches
  type CanvasBranch = {
    id: string;
    label: string;
    condition: string;
    targetStepId?: string;
    routeId?: string;
    kind: 'choice' | 'route' | 'alternative';
  };

  const activeBranches = useMemo<CanvasBranch[]>(() => {
    if (!activeStep) return [];
    const branches: CanvasBranch[] = [];
    if (activeStep.terminalRoutes && activeStep.terminalRoutes.length > 0) {
      activeStep.terminalRoutes.forEach((routeId) => {
        const route = scenario.continuationRoutes.find((item) => item.id === routeId);
        if (route) {
          branches.push({
            id: `route-${routeId}`,
            label: route.label,
            condition: route.description,
            routeId,
            kind: 'route',
          });
        }
      });
    } else {
      activeStep.choices.forEach((choice) => {
        branches.push({
          id: choice.id,
          label: choice.label,
          condition: choice.condition,
          targetStepId: choice.targetStepId,
          routeId: choice.routeId,
          kind: 'choice',
        });
      });
    }
    activeStep.alternatives.forEach((alt) => {
      branches.push({
        id: alt.id,
        label: alt.label,
        condition: alt.condition,
        kind: 'alternative',
      });
    });
    return branches;
  }, [activeStep, scenario.continuationRoutes]);

  const visibleNodes = useMemo(
    () =>
      scenario.nodes.filter(
        (node) =>
          revealedNodeIds.has(node.id) &&
          isVisibleNode(getNodePos(node.id), canvasTransform, viewportSize.width, viewportSize.height),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario.nodes, revealedNodeIds, canvasTransform, viewportSize, nodeLayout],
  );

  const visibleEdges = useMemo(
    () =>
      scenario.edges.filter(({ from, to }) => revealedNodeIds.has(from) && revealedNodeIds.has(to)),
    [scenario.edges, revealedNodeIds],
  );

  const savedRoutesFavorites = useMemo(
    () => savedRoutes.filter((route) => route.favorite),
    [savedRoutes],
  );
  const savedRoutesRecent = useMemo(
    () =>
      savedRoutes
        .filter((route) => !route.favorite)
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [savedRoutes],
  );

  useEffect(() => {
    const shell = canvasShellRef.current;
    if (!shell) return;
    const measure = () => {
      const rect = shell.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  // Auto-pan to keep active node visible when step advances (grill Q1.2/Q4.2):
  // recenters the active node at 1/3 from left so outgoing branches stay
  // visible. Only fires when activeStepId actually changes.
  useEffect(() => {
    if (!hasSelectedScenario || !activeNode) return;
    const pos = getNodePos(activeNode.id);
    setCanvasTransform((current) => ({
      x: viewportSize.width / 3 - pos.x * current.scale,
      y: viewportSize.height / 2 - (pos.y + NODE_HEIGHT / 2) * current.scale,
      scale: current.scale,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStepId]);

  // Load saved routes from localStorage on mount (grill Q5.2 / C-014).
  useEffect(() => {
    const loaded = loadSavedRoutes();
    if (loaded) setSavedRoutes(loaded);
  }, []);

  const activateNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    if (!hasSelectedScenario) {
      setHasSelectedScenario(true);
    }
    const nodeStep = scenario.steps.find((step) => step.nodeId === nodeId);
    if (nodeStep) setActiveStepId(nodeStep.id);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      isPanning: false,
    };
    lastGestureWasPanRef.current = false;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    if (!state) return;
    const totalDx = event.clientX - state.startX;
    const totalDy = event.clientY - state.startY;
    if (!state.isPanning && Math.hypot(totalDx, totalDy) > PAN_THRESHOLD) {
      state.isPanning = true;
      setIsPanning(true);
    }
    if (state.isPanning) {
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      setCanvasTransform((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = pointerStateRef.current;
    pointerStateRef.current = null;
    if (state) {
      lastGestureWasPanRef.current = state.isPanning;
    }
    setIsPanning(false);
    void event;
  };

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const shell = canvasShellRef.current;
    const rect = shell?.getBoundingClientRect();
    const cursorX = rect ? event.clientX - rect.left : viewportSize.width / 2;
    const cursorY = rect ? event.clientY - rect.top : viewportSize.height / 2;
    const delta = -event.deltaY * 0.0015;
    setCanvasTransform((current) => {
      const newScale = clampScale(current.scale * (1 + delta));
      const scaleRatio = newScale / current.scale;
      const newX = cursorX - (cursorX - current.x) * scaleRatio;
      const newY = cursorY - (cursorY - current.y) * scaleRatio;
      return { x: newX, y: newY, scale: newScale };
    });
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Right-click on empty canvas closes any open popover; node right-click
    // is handled by handleNodeContextMenu which stops propagation.
    setPopover(null);
  };

  const handleNodeContextMenu = (event: React.MouseEvent<SVGGElement>, nodeId: string) => {
    event.preventDefault();
    event.stopPropagation();
    const shell = canvasShellRef.current;
    const rect = shell?.getBoundingClientRect();
    const x = rect ? event.clientX - rect.left : event.clientX;
    const y = rect ? event.clientY - rect.top : event.clientY;
    setPopover({ nodeId, x, y });
  };

  const handleNodeTouchStart = (event: React.TouchEvent<SVGGElement>, nodeId: string) => {
    const touch = event.touches[0];
    if (!touch) return;
    const shell = canvasShellRef.current;
    const rect = shell?.getBoundingClientRect();
    const x = rect ? touch.clientX - rect.left : touch.clientX;
    const y = rect ? touch.clientY - rect.top : touch.clientY;
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = window.setTimeout(() => {
      setPopover({ nodeId, x, y });
    }, LONG_PRESS_MS);
  };

  const handleNodeTouchEnd = () => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleNodeTouchMove = () => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const closePopover = () => setPopover(null);

  const checklistKey = (stepId: string, checkId: string) => `${stepId}::${checkId}`;

  const toggleCheck = (stepId: string, checkId: string) => {
    const key = checklistKey(stepId, checkId);
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNodeClick = (nodeId: string) => {
    if (lastGestureWasPanRef.current) {
      lastGestureWasPanRef.current = false;
      return;
    }
    activateNode(nodeId);
    setPopover(null);
  };

  const handleNodeKeyDown = (event: React.KeyboardEvent<SVGRectElement>, nodeId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateNode(nodeId);
      setPopover(null);
    }
  };

  const handleChoiceClick = (targetStepId: string | undefined, routeId: string | undefined) => {
    if (lastGestureWasPanRef.current) {
      lastGestureWasPanRef.current = false;
      return;
    }
    if (targetStepId) {
      const target = scenario.steps.find((step) => step.id === targetStepId);
      if (target) {
        setActiveStepId(target.id);
        setSelectedNodeId(target.nodeId);
      }
    } else if (routeId) {
      const route = scenario.continuationRoutes.find((item) => item.id === routeId);
      void route;
    }
    setPopover(null);
  };

  const handleSaveCurrentRoute = () => {
    if (!hasSelectedScenario || !activeStep) return;
    const citations = activeStep.citations
      .map((citationId) => scenario.citations.find((c) => c.id === citationId))
      .filter((c): c is ScenarioCitation => c !== undefined);
    const sourceRefs: SourceRef[] = citations.map((c) => ({
      path: c.source,
      label: c.label,
      status: c.status,
    }));
    const route: SavedRoute = {
      id: `route-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: `${scenario.title} \u2014 ${activeStep.command}`,
      createdAt: new Date().toISOString(),
      favorite: false,
      scenarioId: scenario.id,
      selectedCommandNodes: [activeStep.nodeId],
      primaryRecommendations: [activeStep.command],
      secondaryRecommendations: activeStep.alternatives.map((alt) => alt.label),
      recommendationReasons: [activeStep.purpose, activeStep.condition],
      sourceRefs,
      schemaVersion: SCHEMA_VERSION,
      ruleVersion: RULE_VERSION,
    };
    saveRoute(route);
    const reloaded = loadSavedRoutes();
    setSavedRoutes(reloaded ?? []);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    const reloaded = loadSavedRoutes();
    setSavedRoutes(reloaded ?? []);
  };

  const activeNode = useMemo(
    () => scenario.nodes.find((node) => node.id === activeStep.nodeId) ?? null,
    [scenario.nodes, activeStep.nodeId],
  );

  const activeNodePos = activeNode ? getNodePos(activeNode.id) : { x: 0, y: 0 };

  const popoverStep = popover
    ? scenario.steps.find((step) => step.nodeId === popover.nodeId) ?? null
    : null;
  const popoverNode = popover
    ? scenario.nodes.find((node) => node.id === popover.nodeId) ?? null
    : null;
  const popoverCitations = popoverStep
    ? popoverStep.citations
        .map((citationId) => scenario.citations.find((citation) => citation.id === citationId))
        .filter((citation): citation is ScenarioCitation => citation !== undefined)
    : [];

  const guidanceVisible = !hasSelectedScenario;
  const scenarioLabelText = hasSelectedScenario
    ? scenario.title
    : '未选择场景';

  return (
    <main className={`app-shell ${isFullscreen ? 'is-fullscreen' : ''}`}>
      <section className="hero">
        <p className="eyebrow">Maestro Workflow Wiki</p>
        <h1>把复杂工作流变成可点击、可理解的地图</h1>
        <p className="hero-copy">
          这个百科站独立于 `maestro-flow/docs-site`，专注解释 Maestro 如何从自然语言需求走到 stepwise command choice。
        </p>
      </section>

      <div
        ref={canvasShellRef}
        className={`canvas-shell ${isFullscreen ? 'is-fullscreen' : ''} ${isPanning ? 'is-panning' : ''}`}
        role="application"
        aria-label="Maestro 场景流程画布"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={handleContextMenu}
      >
        <div className="scenario-label" data-testid="scenario-label">
          <span className="scenario-label-id">{scenario.id}</span>
          <span>{scenarioLabelText}</span>
        </div>

        <button
          type="button"
          className="fullscreen-toggle"
          onClick={() => setIsFullscreen((current) => !current)}
          aria-label={isFullscreen ? '退出全屏' : '进入全屏'}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? '退出全屏' : '全屏'}
        </button>

        <button
          type="button"
          className="saved-routes-toggle"
          onClick={() => setSavedRoutesOpen(true)}
          aria-label="查看已保存的路线"
          data-testid="saved-routes-toggle"
        >
          历史路线
        </button>

        {guidanceVisible && (
          <div className="guidance-overlay" data-testid="guidance-overlay">
            选择场景开始 — 点击中央节点展开后续步骤
          </div>
        )}

        <svg
          width="100%"
          height="100%"
          role="img"
          aria-label="Full Project 场景流程"
          onWheel={handleWheel}
        >
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
            </marker>
          </defs>
          <g
            transform={`translate(${canvasTransform.x} ${canvasTransform.y}) scale(${canvasTransform.scale})`}
            data-testid="canvas-transform-group"
            data-transform-x={canvasTransform.x}
            data-transform-y={canvasTransform.y}
            data-transform-scale={canvasTransform.scale}
          >
            {visibleEdges.map(({ from, to }) => {
              const sourcePos = getNodePos(from);
              const targetPos = getNodePos(to);
              const isActive = activeNodeIds.has(from) && activeNodeIds.has(to);
              return (
                <line
                  key={`${from}-${to}`}
                  className={`edge ${isActive ? 'edge-active' : ''}`}
                  x1={sourcePos.x + NODE_WIDTH}
                  y1={sourcePos.y + NODE_HEIGHT / 2}
                  x2={targetPos.x}
                  y2={targetPos.y + NODE_HEIGHT / 2}
                />
              );
            })}
            {visibleNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isActive = node.id === activeStep.nodeId;
              const isOnPath = activeNodeIds.has(node.id);
              const pos = getNodePos(node.id);
              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x} ${pos.y})`}
                  onContextMenu={(event) => handleNodeContextMenu(event, node.id)}
                  onTouchStart={(event) => handleNodeTouchStart(event, node.id)}
                  onTouchEnd={handleNodeTouchEnd}
                  onTouchMove={handleNodeTouchMove}
                >
                  <rect
                    className={`node node-${node.kind} ${isSelected ? 'selected' : ''} ${isActive ? 'node-active' : ''} ${isOnPath ? 'node-on-path' : ''}`}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx="20"
                    tabIndex={0}
                    role="button"
                    aria-label={`查看 ${node.title}`}
                    onClick={() => handleNodeClick(node.id)}
                    onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
                  />
                  <text className="node-title" x="24" y="35">{node.title}</text>
                  <text className="node-subtitle" x="24" y="62">{node.subtitle}</text>
                </g>
              );
            })}
            {activeNode &&
              hasSelectedScenario &&
              activeBranches.map((branch, index) => {
                const sign = index % 2 === 0 ? -1 : 1;
                const magnitude = Math.ceil((index + 1) / 2);
                const branchX = activeNodePos.x + NODE_WIDTH + 24;
                const branchY = activeNodePos.y + sign * magnitude * BRANCH_OFFSET;
                const isSecondary = branch.kind === 'alternative';
                return (
                  <g
                    key={branch.id}
                    className={`canvas-branch ${isSecondary ? 'canvas-branch-secondary' : ''}`}
                    transform={`translate(${branchX} ${branchY})`}
                    role="button"
                    tabIndex={0}
                    aria-label={branch.label}
                    data-branch-kind={branch.kind}
                    onClick={() => handleChoiceClick(branch.targetStepId, branch.routeId)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleChoiceClick(branch.targetStepId, branch.routeId);
                      }
                    }}
                  >
                    <rect
                      className={`canvas-branch-rect ${isSecondary ? 'canvas-branch-rect-secondary' : ''}`}
                      width="220"
                      height="44"
                      rx="14"
                      tabIndex={-1}
                    />
                    <text className="canvas-branch-label" x="14" y="20">{branch.label}</text>
                    <text className="canvas-branch-condition" x="14" y="34">
                      {branch.condition.length > 28 ? `${branch.condition.slice(0, 26)}…` : branch.condition}
                    </text>
                  </g>
                );
              })}
          </g>
        </svg>

        {popover && popoverStep && popoverNode && (
          <div
            className="node-popover"
            data-testid="node-popover"
            style={{ left: popover.x, top: popover.y }}
            role="dialog"
            aria-label={`节点证据 ${popoverNode.title}`}
          >
            <button
              type="button"
              className="popover-close"
              onClick={closePopover}
              aria-label="关闭证据弹窗"
            >
              ×
            </button>

            <div className="popover-command-card" data-testid="popover-command-card">
              <span className="popover-rank">Recommended</span>
              <span className="popover-command">{popoverStep.command}</span>
            </div>

            <dl className="popover-evidence" data-testid="popover-evidence">
              <div className="popover-evidence-row">
                <dt>Purpose</dt>
                <dd>{popoverStep.purpose}</dd>
              </div>
              <div className="popover-evidence-row">
                <dt>Input</dt>
                <dd>{popoverStep.input}</dd>
              </div>
              <div className="popover-evidence-row">
                <dt>Output</dt>
                <dd>{popoverStep.output}</dd>
              </div>
              <div className="popover-evidence-row">
                <dt>Next Action</dt>
                <dd>{popoverStep.nextAction}</dd>
              </div>
            </dl>

            {popoverStep.alternatives.length > 0 && (
              <div className="popover-alternatives" data-testid="popover-alternatives">
                <h4>Alternatives</h4>
                <ul>
                  {popoverStep.alternatives.map((alt) => (
                    <li key={alt.id}>
                      <span className="popover-alt-label">{alt.label}</span>
                      <span className="popover-alt-condition">{alt.condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="popover-source-status" data-testid="popover-source-status">
              <h4>Source Status</h4>
              <ul>
                {popoverCitations.map((citation) => (
                  <li key={citation.id} className={`source-status source-${citation.status}`}>
                    <span className="source-label">{citation.label}</span>
                    <span className="source-path">{citation.source}</span>
                    <span className={`source-badge source-badge-${citation.status}`}>{citation.status}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="popover-checklist" data-testid="popover-checklist">
              <h4>Validation Checklist</h4>
              <ul>
                {scenario.checklist.map((check) => {
                  const key = checklistKey(popoverStep.id, check.id);
                  const checked = checkedItems[key] === true;
                  return (
                    <li key={check.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCheck(popoverStep.id, check.id)}
                          data-testid={`checklist-${check.id}`}
                        />
                        <span>{check.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {savedRoutesOpen && (
          <div
            className="saved-routes-popover"
            data-testid="saved-routes-popover"
            role="dialog"
            aria-label="已保存的路线列表"
          >
            <button
              type="button"
              className="popover-close"
              onClick={() => setSavedRoutesOpen(false)}
              aria-label="关闭路线列表"
            >
              {'\u00d7'}
            </button>

            <h3>已保存路线</h3>

            <button
              type="button"
              className="save-current-route-button"
              onClick={handleSaveCurrentRoute}
              disabled={!hasSelectedScenario}
              data-testid="save-current-route-button"
            >
              保存当前路线
            </button>

            {savedRoutes.length === 0 ? (
              <p className="saved-routes-empty" data-testid="saved-routes-empty">
                暂无路线
              </p>
            ) : (
              <div className="saved-routes-list" data-testid="saved-routes-list">
                {savedRoutesFavorites.length > 0 && (
                  <div className="saved-routes-section" data-testid="saved-routes-favorites">
                    <h4>Favorites</h4>
                    {savedRoutesFavorites.map((route) => (
                      <div key={route.id} className="saved-route-item">
                        <button
                          type="button"
                          className="favorite-toggle"
                          onClick={() => handleToggleFavorite(route.id)}
                          aria-label="取消收藏"
                        >
                          {'\u2605'}
                        </button>
                        <div className="saved-route-info">
                          <span className="saved-route-name">{route.name}</span>
                          <span className="saved-route-meta">
                            {route.scenarioId} {'\u00b7'} {new Date(route.createdAt).toLocaleDateString()}
                          </span>
                          <span className="saved-route-commands">
                            {route.primaryRecommendations.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {savedRoutesRecent.length > 0 && (
                  <div className="saved-routes-section" data-testid="saved-routes-recent">
                    <h4>Recent</h4>
                    {savedRoutesRecent.map((route) => (
                      <div key={route.id} className="saved-route-item">
                        <button
                          type="button"
                          className="favorite-toggle"
                          onClick={() => handleToggleFavorite(route.id)}
                          aria-label="收藏路线"
                        >
                          {'\u2606'}
                        </button>
                        <div className="saved-route-info">
                          <span className="saved-route-name">{route.name}</span>
                          <span className="saved-route-meta">
                            {route.scenarioId} {'\u00b7'} {new Date(route.createdAt).toLocaleDateString()}
                          </span>
                          <span className="saved-route-commands">
                            {route.primaryRecommendations.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div aria-hidden="true" style={{ display: 'none' }} data-testid="checked-items-count">
        {selectedNode?.title}
        {activeStep.command}
        {Object.keys(checkedItems).length}
      </div>
    </main>
  );
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
