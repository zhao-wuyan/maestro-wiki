import { useState } from 'react';

type ScenarioId =
  | 'brainstorm'
  | 'blueprint'
  | 'analyze'
  | 'plan'
  | 'execute'
  | 'quality'
  | 'status';

interface Scenario {
  id: ScenarioId;
  name: string;
  desc: string;
  hint: string;
  example: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'brainstorm',
    name: '探索想法',
    desc: '想法还不明确',
    hint: '头脑风暴',
    example: '我想做个 X，但不确定怎么做',
  },
  {
    id: 'blueprint',
    name: '生成规格',
    desc: '需求 → 正式规格',
    hint: 'PRD / 架构',
    example: '把这个需求转成可执行规格',
  },
  {
    id: 'analyze',
    name: '分析代码',
    desc: '理解现有结构',
    hint: '考古 / 多维',
    example: '这段代码是怎么工作的',
  },
  {
    id: 'plan',
    name: '制定计划',
    desc: '任务拆解',
    hint: '阶段 / 步骤',
    example: '为这个功能制定执行计划',
  },
  {
    id: 'execute',
    name: '执行实现',
    desc: '按计划落地',
    hint: '代码 / 验证',
    example: '按计划实现这个任务',
  },
  {
    id: 'quality',
    name: '质量检查',
    desc: '审查 / 测试',
    hint: 'review / 修复',
    example: '检查这段代码的质量',
  },
  {
    id: 'status',
    name: '查看状态',
    desc: '项目进度',
    hint: 'dashboard',
    example: '当前项目进展如何',
  },
];

interface Flag {
  id: string;
  label: string;
  desc: string;
}

const FLAGS: Flag[] = [
  { id: 'y', label: '-y', desc: '自动模式' },
  { id: 'dry-run', label: '--dry-run', desc: '只显示链路' },
  { id: 'continue', label: '-c', desc: '恢复会话' },
  { id: 'super', label: '--super', desc: '严格评分' },
];

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  active?: boolean;
  soon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: '首页', shortLabel: '首页', active: true },
  { id: 'flow', label: '运行流程', shortLabel: '流程', soon: true },
  { id: 'map', label: '命令地图', shortLabel: '地图', soon: true },
  { id: 'session', label: 'Session 解剖', shortLabel: 'Session', soon: true },
  { id: 'cases', label: '案例库', shortLabel: '案例', soon: true },
];

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(
    null,
  );
  const [checkedFlags, setCheckedFlags] = useState<Set<string>>(new Set());

  const toggleFlag = (id: string) => {
    setCheckedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-canvas-bg text-gray-100">
      <header className="border-b border-canvas-border sticky top-0 bg-canvas-bg/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#a78bfa] shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight truncate">
                Maestro 工作流百科
              </h1>
              <p className="text-[11px] text-canvas-muted leading-tight hidden sm:block">
                理解执行流程，找到合适的命令链
              </p>
            </div>
          </div>
          <nav className="flex gap-1 text-sm overflow-x-auto scrollbar-none -mx-1 px-1">
            {NAV_ITEMS.map((item) => (
              <span
                key={item.id}
                className={`shrink-0 px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1.5 ${
                  item.active
                    ? 'bg-accent-subtle text-accent'
                    : 'text-canvas-muted cursor-not-allowed'
                }`}
              >
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
                {item.soon && (
                  <span className="text-[9px] uppercase tracking-wider px-1 py-px rounded bg-canvas-border text-canvas-muted">
                    即将
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-10 sm:pb-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2 tracking-tight">
            我该用哪个命令？
          </h2>
          <p className="text-xs sm:text-sm text-canvas-muted">
            描述任务或选择场景，我帮你选合适的命令链
          </p>
        </div>

        <div className="relative mb-3">
          <textarea
            className="w-full bg-canvas-panel border border-canvas-border focus:border-accent focus:ring-2 focus:ring-accent/30 rounded-lg p-3.5 sm:p-4 md:pr-16 resize-none outline-none transition-all placeholder-gray-600 text-sm leading-relaxed"
            rows={4}
            placeholder="例如：我想重构一个旧模块，但不确定从哪里开始"
          />
          <kbd className="hidden md:block absolute bottom-3 right-3 text-[10px] text-canvas-muted bg-canvas-bg border border-canvas-border px-1.5 py-0.5 rounded font-mono">
            ⌘ ↵
          </kbd>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-1.5 md:gap-x-4 md:gap-y-2 mb-6 text-xs">
          <span className="text-canvas-muted col-span-2 md:col-auto md:self-center">
            附加选项：
          </span>
          {FLAGS.map((f) => {
            const checked = checkedFlags.has(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFlag(f.id)}
                className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors text-left ${
                  checked
                    ? 'bg-accent-subtle text-accent'
                    : 'text-canvas-muted hover:text-gray-300 bg-canvas-panel/50'
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${
                    checked
                      ? 'bg-accent border-accent'
                      : 'border-canvas-border group-hover:border-gray-500'
                  }`}
                >
                  {checked && (
                    <svg
                      viewBox="0 0 8 8"
                      className="w-2 h-2 text-canvas-bg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 4l2 2 4-4" />
                    </svg>
                  )}
                </span>
                <code className="font-mono shrink-0">{f.label}</code>
                <span className="text-canvas-muted/80 truncate">{f.desc}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="w-full bg-accent hover:bg-accent-dark text-canvas-bg font-semibold py-3 rounded-lg transition-all hover:shadow-[0_0_24px_rgba(167,139,250,0.35)] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>分析并推荐命令</span>
          <svg
            viewBox="0 0 16 16"
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>

        <div className="flex items-center gap-3 my-8 sm:my-10">
          <div className="h-px flex-1 bg-canvas-border" />
          <span className="text-canvas-muted text-xs">或选择场景</span>
          <div className="h-px flex-1 bg-canvas-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {SCENARIOS.map((s) => {
            const selected = selectedScenario === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScenario(selected ? null : s.id)}
                className={`group relative bg-canvas-panel border rounded-lg p-3.5 text-left transition-all ${
                  selected
                    ? 'border-accent bg-accent-subtle'
                    : 'border-canvas-border hover:border-accent/50 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                  <div className="font-medium text-sm">{s.name}</div>
                  <span className="text-[10px] font-mono text-canvas-muted group-hover:text-accent transition-colors shrink-0 ml-2">
                    {s.hint}
                  </span>
                </div>
                <div className="text-[11px] text-canvas-muted mb-1.5 sm:mb-2">
                  {s.desc}
                </div>
                <div className="text-[10px] text-canvas-muted/70 italic border-l border-canvas-border pl-2 line-clamp-1">
                  {s.example}
                </div>
                {selected && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#a78bfa]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 bg-canvas-panel/40 border border-dashed border-canvas-border rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-[11px] text-canvas-muted uppercase tracking-wider">
              推荐结果
            </div>
            <div className="text-[10px] text-canvas-muted/60">
              {selectedScenario || checkedFlags.size > 0
                ? '等待分析输入…'
                : '输入任务后显示'}
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <ResultField label="推荐命令" placeholder="匹配意图的主命令" />
            <ResultField label="推荐链路" placeholder="完整执行链路" />
            <ResultField
              label="推荐理由"
              placeholder="基于意图关键词的匹配说明"
            />
            <ResultField label="置信度" placeholder="high / medium / low" />
            <ResultField label="需要澄清" placeholder="最多 3 个边界问题" />
          </div>
        </div>
      </main>

      <footer className="border-t border-canvas-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-0 text-[11px] text-canvas-muted">
          <span>第一版覆盖 Maestro 主流程 + 常用 skill（约 20 个命令）</span>
          <span className="font-mono">v0.2.0</span>
        </div>
      </footer>
    </div>
  );
}

function ResultField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-canvas-muted w-16 sm:w-20 shrink-0 text-xs">
        {label}
      </span>
      <span className="text-canvas-muted/50 italic text-xs flex-1">
        {placeholder}
      </span>
    </div>
  );
}
