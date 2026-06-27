import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type FlowNode = {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  kind: 'input' | 'classify' | 'session' | 'execute' | 'decision';
  explanation: string;
  input: string;
  output: string;
  tip: string;
};

const nodes: FlowNode[] = [
  {
    id: 'intent',
    title: '输入意图',
    subtitle: '用户说想做什么',
    x: 80,
    y: 120,
    kind: 'input',
    explanation: 'Maestro 的起点不是命令，而是一段自然语言目标。系统会先拆出 flags、关键词和任务对象。',
    input: '例如：我想做一个 Maestro 工作流百科网站。',
    output: '得到 intent text、flags 和是否需要继续已有 session。',
    tip: '不要一开始纠结命令名，先把目标说清楚。',
  },
  {
    id: 'classify',
    title: '意图分类',
    subtitle: '选择最合适的链路',
    x: 330,
    y: 120,
    kind: 'classify',
    explanation: 'Maestro 读取 workflow catalog，把需求映射成 brainstorm、blueprint、analyze、plan、execute 等链路。',
    input: 'intent text、项目状态、关键词和 flags。',
    output: 'task_type、chain_name、confidence、classification_rationale。',
    tip: '模糊探索类需求通常先进入 brainstorm，而不是直接 execute。',
  },
  {
    id: 'decompose',
    title: '边界分解',
    subtitle: '明确做到什么程度',
    x: 590,
    y: 120,
    kind: 'session',
    explanation: '对宽泛任务，Maestro 会沉淀 boundary_contract、execution_criteria 和 task_decomposition。',
    input: '分类后的链路和用户补充的范围、约束、完成标准。',
    output: '可执行的子目标，每个子目标都有 done_when 和 evidence。',
    tip: '这一步避免 agent 做偏、做大或遗漏验收标准。',
  },
  {
    id: 'session',
    title: '创建 Session',
    subtitle: '写入 status.json',
    x: 850,
    y: 120,
    kind: 'session',
    explanation: '执行前必须创建 `.workflow/.maestro/{session_id}/status.json`，它是后续状态的唯一真源。',
    input: 'chain steps、decomposition、project state、artifact refs。',
    output: '包含 steps、active_step_index、task_decomposition 的 session 文件。',
    tip: '不要额外维护 markdown 清单，避免状态分裂。',
  },
  {
    id: 'dispatch',
    title: '交给 Ralph 执行',
    subtitle: '统一调度下一步',
    x: 590,
    y: 340,
    kind: 'execute',
    explanation: 'Maestro 不直接执行步骤，而是把 session 交给 `maestro-ralph-execute`。Ralph 负责加载下一步。',
    input: '已创建的 status.json。',
    output: '当前 step 的 skill 被执行，完成后由 CLI 写回 completion_confirmed。',
    tip: '这保证所有链路都走同一套执行和确认机制。',
  },
  {
    id: 'decision',
    title: 'Decision 节点',
    subtitle: '决定继续、修复或扩展链路',
    x: 330,
    y: 340,
    kind: 'decision',
    explanation: 'Decision 节点不对应普通命令，它读取执行证据，决定继续下一步、插入 debug/fix，或要求用户介入。',
    input: 'step evidence、completion_status、scope_verdict。',
    output: '更新后的 steps、下一步 active_step_index 或阻塞原因。',
    tip: '这就是 Maestro 能自适应而不是死跑固定脚本的原因。',
  },
];

const edges = [
  ['intent', 'classify'],
  ['classify', 'decompose'],
  ['decompose', 'session'],
  ['session', 'dispatch'],
  ['dispatch', 'decision'],
  ['decision', 'classify'],
] as const;

function App() {
  const [selectedId, setSelectedId] = useState(nodes[0].id);
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? nodes[0],
    [selectedId],
  );

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Maestro Workflow Wiki</p>
        <h1>把复杂工作流变成可点击、可理解的地图</h1>
        <p className="hero-copy">
          这个百科站独立于 `maestro-flow/docs-site`，专注解释 Maestro 如何从自然语言需求走到 session、Ralph 执行和 decision 回路。
        </p>
      </section>

      <section className="workspace" aria-label="Maestro 交互流程图">
        <div className="diagram-card">
          <div className="diagram-header">
            <div>
              <p className="eyebrow">Interactive Flow</p>
              <h2>点击节点查看输入、输出和使用建议</h2>
            </div>
            <span className="status-pill">MVP 原型</span>
          </div>

          <svg viewBox="0 0 1080 520" role="img" aria-label="Maestro 编排流程">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
              </marker>
            </defs>
            {edges.map(([from, to]) => {
              const source = nodes.find((node) => node.id === from)!;
              const target = nodes.find((node) => node.id === to)!;
              return (
                <line
                  key={`${from}-${to}`}
                  className="edge"
                  x1={source.x + 150}
                  y1={source.y + 44}
                  x2={target.x + 10}
                  y2={target.y + 44}
                />
              );
            })}
            {nodes.map((node) => (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
                <rect
                  className={`node node-${node.kind} ${node.id === selectedId ? 'selected' : ''}`}
                  width="190"
                  height="88"
                  rx="20"
                  tabIndex={0}
                  role="button"
                  aria-label={`查看 ${node.title}`}
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedId(node.id);
                    }
                  }}
                />
                <text className="node-title" x="24" y="35">{node.title}</text>
                <text className="node-subtitle" x="24" y="62">{node.subtitle}</text>
              </g>
            ))}
          </svg>
        </div>

        <aside className="detail-panel" aria-live="polite">
          <p className="eyebrow">Selected Node</p>
          <h2>{selectedNode.title}</h2>
          <p>{selectedNode.explanation}</p>
          <dl>
            <dt>输入</dt>
            <dd>{selectedNode.input}</dd>
            <dt>输出</dt>
            <dd>{selectedNode.output}</dd>
            <dt>使用建议</dt>
            <dd>{selectedNode.tip}</dd>
          </dl>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
