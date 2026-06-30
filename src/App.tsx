const SCENARIOS = [
  { id: 'brainstorm', name: '探索想法', desc: '想法还不明确，需要头脑风暴' },
  { id: 'blueprint', name: '生成规格', desc: '把需求转成正式规格' },
  { id: 'analyze', name: '分析代码', desc: '理解现有代码结构' },
  { id: 'plan', name: '制定计划', desc: '为任务制定执行计划' },
  { id: 'execute', name: '执行实现', desc: '按计划落地代码' },
  { id: 'quality', name: '质量检查', desc: '审查、测试、修复' },
  { id: 'status', name: '查看状态', desc: '看项目当前进度' },
] as const;

const FLAGS = [
  { id: 'y', label: '-y', desc: '自动模式' },
  { id: 'dry-run', label: '--dry-run', desc: '试运行' },
  { id: 'continue', label: '--continue', desc: '恢复会话' },
  { id: 'super', label: '--super', desc: '高级模式' },
] as const;

const NAV_ITEMS = [
  { id: 'home', label: '首页', active: true },
  { id: 'flow', label: '运行流程', active: false },
  { id: 'map', label: '命令地图', active: false },
  { id: 'session', label: 'Session 解剖', active: false },
  { id: 'cases', label: '案例库', active: false },
] as const;

export default function App() {
  return (
    <div className="min-h-screen bg-canvas-bg text-gray-100">
      <header className="border-b border-canvas-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Maestro 工作流百科</h1>
            <p className="text-xs text-canvas-muted mt-0.5">
              理解执行流程，找到合适的命令链
            </p>
          </div>
          <nav className="flex gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <span
                key={item.id}
                className={
                  item.active
                    ? 'text-accent border-b border-accent pb-1'
                    : 'text-canvas-muted cursor-not-allowed'
                }
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">我该用哪个命令？</h2>
          <p className="text-canvas-muted">
            描述你的任务，我帮你选 Maestro 命令链
          </p>
        </div>

        <div className="bg-canvas-panel border border-canvas-border rounded-lg p-4 mb-4">
          <textarea
            className="w-full bg-transparent resize-none outline-none placeholder-gray-600 text-gray-100 text-sm leading-relaxed"
            rows={3}
            placeholder="例如：我想重构一个旧模块，但不确定从哪里开始"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-xs">
          <span className="text-canvas-muted">执行选项：</span>
          {FLAGS.map((f) => (
            <label key={f.id} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="accent-blue-500" />
              <code className="text-accent">{f.label}</code>
              <span className="text-canvas-muted">{f.desc}</span>
            </label>
          ))}
        </div>

        <button
          type="button"
          className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3 rounded-lg transition-colors mb-12"
        >
          分析并推荐命令
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-canvas-border" />
            <span className="text-canvas-muted text-xs">或选择场景</span>
            <div className="h-px flex-1 bg-canvas-border" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="bg-canvas-panel border border-canvas-border hover:border-accent rounded-lg p-4 text-left transition-colors"
              >
                <div className="text-xs text-canvas-muted font-mono mb-2">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="font-medium text-sm mb-1">{s.name}</div>
                <div className="text-xs text-canvas-muted">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-canvas-panel/50 border border-dashed border-canvas-border rounded-lg p-6 opacity-60">
          <div className="text-xs text-canvas-muted mb-4 uppercase tracking-wider">
            推荐结果（等待输入）
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-canvas-muted w-24 shrink-0">推荐命令</span>
              <span className="text-gray-500">—</span>
            </div>
            <div className="flex gap-3">
              <span className="text-canvas-muted w-24 shrink-0">推荐链路</span>
              <span className="text-gray-500">—</span>
            </div>
            <div className="flex gap-3">
              <span className="text-canvas-muted w-24 shrink-0">推荐理由</span>
              <span className="text-gray-500">—</span>
            </div>
            <div className="flex gap-3">
              <span className="text-canvas-muted w-24 shrink-0">置信度</span>
              <span className="text-gray-500">—</span>
            </div>
            <div className="flex gap-3">
              <span className="text-canvas-muted w-24 shrink-0">需要澄清</span>
              <span className="text-gray-500">—</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-canvas-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-canvas-muted">
          Maestro 工作流百科 · 第一版覆盖 Maestro 主流程 + 常用 skill（约 20 个命令）
        </div>
      </footer>
    </div>
  );
}
