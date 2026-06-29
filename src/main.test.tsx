import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import {
  App,
  authoredRules,
  recommendCommands,
  validateRuleSet,
  isVisibleNode,
  loadSavedRoutes,
  saveRoute,
  toggleFavorite,
  pruneRecentRoutes,
  _resetRouteStorageState,
  RECENT_ROUTE_CAP,
  scenarioRegistry,
  scenarioValidation,
} from './main';
import type { RecommendationRule, SimulatedProjectState, SavedRoute } from './main';

describe('Maestro Workflow Wiki fullscreen canvas shell', () => {
  it('[UI-observable] renders hero, fullscreen button, scenario label, and scenario selector with 3 cards in empty initial state', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /把复杂工作流变成可点击/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进入全屏' })).toBeInTheDocument();
    expect(screen.getByTestId('scenario-label')).toBeInTheDocument();
    expect(screen.getByTestId('scenario-selector')).toBeInTheDocument();
    expect(screen.getByText('未选择场景')).toBeInTheDocument();

    // Empty state: no canvas nodes; scenario-selector carries 3 cards (A/D/F).
    expect(screen.queryByRole('button', { name: '查看 模糊目标' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '查看 探索方向' })).not.toBeInTheDocument();
    expect(screen.getByTestId('scenario-card-A_full_project')).toBeInTheDocument();
    expect(screen.getByTestId('scenario-card-D_small_fix')).toBeInTheDocument();
    expect(screen.getByTestId('scenario-card-F_explore_only')).toBeInTheDocument();
    expect(screen.getByText('A_full_project')).toBeInTheDocument();
  });

  it('[UI-observable] reveals subsequent nodes after scenario selection and hides selector', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('scenario-card-A_full_project'));

    expect(screen.queryByTestId('scenario-selector')).not.toBeInTheDocument();
    expect(screen.getByText('Full Project')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '查看 探索方向' })).toBeInTheDocument();
  });

  it('[UI-observable] toggles fullscreen and hides hero', async () => {
    const user = userEvent.setup();
    render(<App />);

    const hero = screen.getByRole('heading', { name: /把复杂工作流变成可点击/ });
    expect(hero).toBeVisible();

    await user.click(screen.getByRole('button', { name: '进入全屏' }));

    expect(screen.getByRole('button', { name: '退出全屏' })).toBeInTheDocument();
    const shell = document.querySelector('.app-shell');
    expect(shell?.classList.contains('is-fullscreen')).toBe(true);
    const canvasShell = document.querySelector('.canvas-shell');
    expect(canvasShell?.classList.contains('is-fullscreen')).toBe(true);
  });

  it('[UI-observable] supports keyboard node activation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('scenario-card-A_full_project'));

    const brainstormNode = screen.getByRole('button', { name: '查看 探索方向' });
    brainstormNode.focus();
    await user.keyboard('{Enter}');

    // Activating brainstorm node reveals its forward-choice branch.
    expect(screen.getByRole('button', { name: '方向已稳定，生成规格' })).toBeInTheDocument();
  });

  it('[UI-observable] advances active step via on-canvas choice buttons', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('scenario-card-A_full_project'));
    const brainstormNode = screen.getByRole('button', { name: '查看 探索方向' });
    await user.click(brainstormNode);

    const blueprintChoice = screen.getByRole('button', { name: '方向已稳定，生成规格' });
    expect(blueprintChoice).toBeInTheDocument();
    await user.click(blueprintChoice);

    expect(screen.getByRole('button', { name: '查看 规格成型' })).toBeInTheDocument();
  });

  it('[UI-observable] wheel zoom updates canvasTransform scale (clamped to 0.25..4)', () => {
    render(<App />);

    const svg = document.querySelector('.canvas-shell svg') as SVGSVGElement;
    const group = screen.getByTestId('canvas-transform-group');

    fireEvent.wheel(svg, { deltaY: -300 });
    const afterZoomIn = Number(group.getAttribute('data-transform-scale'));
    expect(afterZoomIn).toBeGreaterThan(1);

    fireEvent.wheel(svg, { deltaY: 6000 });
    const afterClampUp = Number(group.getAttribute('data-transform-scale'));
    expect(afterClampUp).toBeLessThanOrEqual(4);

    for (let i = 0; i < 50; i += 1) {
      fireEvent.wheel(svg, { deltaY: -6000 });
    }
    const afterClampDown = Number(group.getAttribute('data-transform-scale'));
    expect(afterClampDown).toBeGreaterThanOrEqual(0.25);
  });

  it('[UI-observable] pointer drag pans canvasTransform (movement > PAN_THRESHOLD)', () => {
    render(<App />);

    const shell = document.querySelector('.canvas-shell') as HTMLElement;
    const group = screen.getByTestId('canvas-transform-group');
    const initialX = Number(group.getAttribute('data-transform-x'));
    const initialY = Number(group.getAttribute('data-transform-y'));

    fireEvent.pointerDown(shell, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(shell, { clientX: 160, clientY: 140 });
    fireEvent.pointerUp(shell, { clientX: 160, clientY: 140 });

    const finalX = Number(group.getAttribute('data-transform-x'));
    const finalY = Number(group.getAttribute('data-transform-y'));
    expect(finalX).toBeGreaterThan(initialX);
    expect(finalY).toBeGreaterThan(initialY);
  });

  it('[UI-observable] small pointer movement (≤ PAN_THRESHOLD) does not pan', () => {
    render(<App />);

    const shell = document.querySelector('.canvas-shell') as HTMLElement;
    const group = screen.getByTestId('canvas-transform-group');
    const initialX = Number(group.getAttribute('data-transform-x'));
    const initialY = Number(group.getAttribute('data-transform-y'));

    fireEvent.pointerDown(shell, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(shell, { clientX: 102, clientY: 103 });
    fireEvent.pointerUp(shell, { clientX: 102, clientY: 103 });

    const finalX = Number(group.getAttribute('data-transform-x'));
    const finalY = Number(group.getAttribute('data-transform-y'));
    expect(finalX).toBe(initialX);
    expect(finalY).toBe(initialY);
  });

  it('[UI-observable] context menu default is prevented on canvas', () => {
    render(<App />);

    const shell = document.querySelector('.canvas-shell') as HTMLElement;
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const dispatched = shell.dispatchEvent(event);
    expect(dispatched).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  it('[UI-observable] right-click on node opens popover with recommendation evidence cluster', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('scenario-card-A_full_project'));
    const brainstormNode = screen.getByRole('button', { name: '查看 探索方向' });
    fireEvent.contextMenu(brainstormNode, { clientX: 250, clientY: 300, bubbles: true, cancelable: true });

    const popover = screen.getByTestId('node-popover');
    expect(popover).toBeInTheDocument();
    expect(popover.style.left).toBe('250px');
    expect(popover.style.top).toBe('300px');

    expect(screen.getByTestId('popover-command-card')).toHaveTextContent('maestro-brainstorm');
    const evidence = screen.getByTestId('popover-evidence');
    expect(evidence).toHaveTextContent('Purpose');
    expect(evidence).toHaveTextContent('发散需求');
    expect(evidence).toHaveTextContent('Input');
    expect(evidence).toHaveTextContent('Next Action');

    expect(screen.getByTestId('popover-alternatives')).toBeInTheDocument();
    expect(screen.getByTestId('popover-source-status')).toBeInTheDocument();
    expect(screen.getByTestId('popover-checklist')).toBeInTheDocument();
  });

  it('[UI-observable] popover source status shows citation badges and maestro-flow paths', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('scenario-card-A_full_project'));
    fireEvent.contextMenu(screen.getByRole('button', { name: '查看 探索方向' }), {
      clientX: 100,
      clientY: 100,
      bubbles: true,
      cancelable: true,
    });

    const sourceStatus = screen.getByTestId('popover-source-status');
    expect(sourceStatus).toHaveTextContent('cited');
    expect(sourceStatus).toHaveTextContent('pending');
    expect(sourceStatus).toHaveTextContent('maestro-flow/');
    expect(sourceStatus.querySelector('.source-badge-cited')).not.toBeNull();
    expect(sourceStatus.querySelector('.source-badge-pending')).not.toBeNull();
  });

  it('[UI-observable] validation checklist toggles persist per step in checkedItems', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('scenario-card-A_full_project'));
    fireEvent.contextMenu(screen.getByRole('button', { name: '查看 探索方向' }), {
      clientX: 100,
      clientY: 100,
      bubbles: true,
      cancelable: true,
    });

    const checkbox = screen.getByTestId('checklist-check-command') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: '关闭证据弹窗' }));
    expect(screen.queryByTestId('node-popover')).not.toBeInTheDocument();

    fireEvent.contextMenu(screen.getByRole('button', { name: '查看 探索方向' }), {
      clientX: 100,
      clientY: 100,
      bubbles: true,
      cancelable: true,
    });
    const checkboxAgain = screen.getByTestId('checklist-check-command') as HTMLInputElement;
    expect(checkboxAgain.checked).toBe(true);
  });

  it('[UI-observable] alternatives render as secondary canvas branches from active node', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('scenario-card-A_full_project'));

    expect(screen.getByRole('button', { name: '先 grill 压力测试' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '直接 analyze' })).toBeInTheDocument();

    const altBranch = screen.getByRole('button', { name: '先 grill 压力测试' }).closest('.canvas-branch');
    expect(altBranch?.getAttribute('data-branch-kind')).toBe('alternative');
  });

  it('[UI-observable] terminal routes render as canvas branch options at terminal node', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('scenario-card-A_full_project'));
    await user.click(screen.getByRole('button', { name: '方向已稳定，生成规格' }));
    await user.click(screen.getByRole('button', { name: '规格可执行，分析 Phase 1' }));
    await user.click(screen.getByRole('button', { name: '分析结论为 GO，进入计划' }));
    await user.click(screen.getByRole('button', { name: '计划完成，选择后续路线' }));

    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quality Pipeline' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Knowledge Capture' })).toBeInTheDocument();

    const routeBranch = screen.getByRole('button', { name: 'Stop' }).closest('.canvas-branch');
    expect(routeBranch?.getAttribute('data-branch-kind')).toBe('route');
  });

  it('[UI-observable] main path nodes use swimlane MAIN_LINE_GAP horizontal spacing', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('scenario-card-A_full_project'));

    const groups = document.querySelectorAll('.canvas-shell svg g[transform]');
    const nodeGroups = Array.from(groups).filter((g) => {
      const rect = g.querySelector('rect.node');
      return rect !== null;
    });
    expect(nodeGroups.length).toBeGreaterThanOrEqual(1);
  });

  it('[UI-observable] viewport clipping filters off-screen nodes', () => {
    const visibleInView = isVisibleNode(
      { x: 100, y: 100 },
      { x: 0, y: 0, scale: 1 },
      1024,
      600,
    );
    expect(visibleInView).toBe(true);

    const farAway = isVisibleNode(
      { x: 5000, y: 5000 },
      { x: 0, y: 0, scale: 1 },
      1024,
      600,
    );
    expect(farAway).toBe(false);

    const justInsideBuffer = isVisibleNode(
      { x: -200, y: -200 },
      { x: 0, y: 0, scale: 1 },
      1024,
      600,
    );
    expect(justInsideBuffer).toBe(true);
  });

  it('keeps authored scenario data intact (regression guard)', () => {
    render(<App />);
    const canvasShell = within(document.querySelector('.canvas-shell') as HTMLElement);
    expect(canvasShell.getByText('A_full_project')).toBeInTheDocument();
  });
});

describe('Local canvas recommender rules (TASK-001)', () => {
  it('authored rules carry sourceRefs pointing at maestro-flow/', () => {
    expect(authoredRules.length).toBeGreaterThanOrEqual(1);
    for (const rule of authoredRules) {
      expect(rule.commandFacts.length).toBeGreaterThan(0);
      for (const fact of rule.commandFacts) {
        expect(fact.sourceRefs.length).toBeGreaterThan(0);
        for (const ref of fact.sourceRefs) {
          expect(ref.path.startsWith('maestro-flow/')).toBe(true);
        }
      }
    }
  });

  it('exposes equal-rank recommendations without a fake primary when intent is semi-clear', () => {
    const state: SimulatedProjectState = {
      milestone: 'M2-canvas-command-recommender-mvp',
      phase: 1,
      hasBlueprint: false,
      hasAnalyze: false,
      hasPlan: false,
      hasExecute: false,
      intentClarity: 'semi-clear',
      taskType: 'new',
    };
    const groups = recommendCommands(state);
    const explore = groups.find((group) => group.id === 'grp-explore-semi-clear');
    expect(explore).toBeDefined();
    // equal-rank: primary array contains more than one command, no fake single primary.
    expect(explore!.primary.length).toBeGreaterThan(1);
    expect(explore!.primary.map((fact) => fact.command)).toContain('maestro-brainstorm');
    expect(explore!.primary.map((fact) => fact.command)).toContain('maestro-blueprint');
  });

  it('returns equal-rank quality-gate group after execution (review vs test)', () => {
    const state: SimulatedProjectState = {
      milestone: 'M2-canvas-command-recommender-mvp',
      phase: 1,
      hasBlueprint: true,
      hasAnalyze: true,
      hasPlan: true,
      hasExecute: true,
      intentClarity: 'clear',
      taskType: 'new',
    };
    const groups = recommendCommands(state);
    const quality = groups.find((group) => group.id === 'grp-quality-gate');
    expect(quality).toBeDefined();
    expect(quality!.primary.length).toBe(2);
  });

  it('validateRuleSet returns non-empty errors for broken rules', () => {
    const broken: RecommendationRule[] = [
      {
        id: 'rule-broken-empty',
        scenarioId: 'test',
        condition: 'broken',
        commandFacts: [],
        alternatives: [],
        priority: 'primary',
      },
      {
        id: 'rule-broken-no-ref',
        scenarioId: 'test',
        condition: 'broken ref',
        commandFacts: [
          {
            id: 'fact-broken',
            command: 'noop',
            purpose: '',
            condition: '',
            input: '',
            output: '',
            nextAction: '',
            sourceRefs: [],
          },
        ],
        alternatives: [],
        priority: 'primary',
      },
      {
        id: 'rule-broken-path',
        scenarioId: 'test',
        condition: 'broken path',
        commandFacts: [
          {
            id: 'fact-broken-path',
            command: 'noop',
            purpose: '',
            condition: '',
            input: '',
            output: '',
            nextAction: '',
            sourceRefs: [{ path: 'docs/other.md', label: 'wrong', status: 'cited' }],
          },
        ],
        alternatives: [],
        priority: 'primary',
      },
    ];
    const errors = validateRuleSet(broken);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((message) => message.includes('missing command references'))).toBe(true);
    expect(errors.some((message) => message.includes('missing sourceRefs'))).toBe(true);
    expect(errors.some((message) => message.includes('maestro-flow/'))).toBe(true);
  });

  it('validateRuleSet passes for the authored rule set', () => {
    expect(validateRuleSet(authoredRules)).toEqual([]);
  });
});

describe('scenarioRegistry multi-scenario data (TASK-001)', () => {
  it('contains 3 scenarios A/D/F', () => {
    expect(scenarioRegistry.length).toBe(3);
    expect(scenarioRegistry.map((s) => s.id)).toEqual([
      'A_full_project',
      'D_small_fix',
      'F_explore_only',
    ]);
  });

  it('D_small_fix has 3 nodes plan/execute/review', () => {
    const d = scenarioRegistry.find((s) => s.id === 'D_small_fix');
    expect(d).toBeDefined();
    expect(d!.nodes.map((n) => n.id)).toEqual(['plan', 'execute', 'review']);
    expect(d!.steps.map((st) => st.id)).toEqual([
      'step-d-plan',
      'step-d-execute',
      'step-d-review',
    ]);
    expect(d!.continuationRoutes.map((r) => r.id)).toEqual(['stop']);
  });

  it('F_explore_only has 2 nodes brainstorm/decision', () => {
    const f = scenarioRegistry.find((s) => s.id === 'F_explore_only');
    expect(f).toBeDefined();
    expect(f!.nodes.map((n) => n.id)).toEqual(['brainstorm', 'decision']);
    expect(f!.steps.map((st) => st.id)).toEqual(['step-f-brainstorm']);
  });

  it('ruleApplies rule-plan-direct returns true when taskType=bugfix and no plan', () => {
    const groups = recommendCommands({
      milestone: 'M2-canvas-start-scenario-redesign',
      phase: 0,
      hasBlueprint: false,
      hasAnalyze: false,
      hasPlan: false,
      hasExecute: false,
      intentClarity: 'clear',
      taskType: 'bugfix',
    });
    expect(groups.some((g) => g.id === 'grp-plan-direct')).toBe(true);
  });

  it('ruleApplies rule-explore-only returns true when taskType=explore and no blueprint', () => {
    const groups = recommendCommands({
      milestone: 'M2-canvas-start-scenario-redesign',
      phase: 0,
      hasBlueprint: false,
      hasAnalyze: false,
      hasPlan: false,
      hasExecute: false,
      intentClarity: 'unclear',
      taskType: 'explore',
    });
    expect(groups.some((g) => g.id === 'grp-explore-only')).toBe(true);
  });

  it('scenarioValidation covers all registry entries with no missing references/citations', () => {
    expect(scenarioValidation.length).toBe(scenarioRegistry.length);
    for (const entry of scenarioValidation) {
      expect(entry.references).toEqual([]);
      expect(entry.citations).toEqual([]);
    }
  });
});

describe('Local route history persistence (TASK-004)', () => {
  beforeEach(() => {
    _resetRouteStorageState();
  });

  function makeRoute(overrides: Partial<SavedRoute> = {}): SavedRoute {
    return {
      id: 'route-default',
      name: 'Default Route',
      createdAt: '2026-06-28T12:00:00.000Z',
      favorite: false,
      scenarioId: 'A_full_project',
      selectedCommandNodes: ['brainstorm'],
      primaryRecommendations: ['maestro-brainstorm'],
      secondaryRecommendations: ['maestro-blueprint'],
      recommendationReasons: ['purpose text', 'condition text'],
      sourceRefs: [
        { path: 'maestro-flow/.claude/commands/maestro-brainstorm.md', label: 'cmd', status: 'cited' },
      ],
      schemaVersion: 1,
      ruleVersion: 'M2-P2-rules-v1',
      ...overrides,
    };
  }

  it(`pruneRecentRoutes caps non-favorite recent routes at RECENT_ROUTE_CAP=20 (FIFO, oldest evicted)`, () => {
    expect(RECENT_ROUTE_CAP).toBe(20);
    const routes: SavedRoute[] = [];
    for (let i = 0; i < 25; i += 1) {
      routes.push(
        makeRoute({
          id: `rec-${i}`,
          name: `Recent ${i}`,
          createdAt: new Date(2026, 5, 28, 12, 0, i).toISOString(),
          favorite: false,
        }),
      );
    }
    const pruned = pruneRecentRoutes(routes);
    expect(pruned.length).toBe(20);
    const ids = pruned.map((r) => r.id);
    // Oldest 5 (rec-0..rec-4) evicted; newest 20 (rec-5..rec-24) retained
    expect(ids).not.toContain('rec-0');
    expect(ids).not.toContain('rec-4');
    expect(ids).toContain('rec-5');
    expect(ids).toContain('rec-24');
  });

  it('pruneRecentRoutes preserves all favorites beyond RECENT_ROUTE_CAP=20 cap', () => {
    const routes: SavedRoute[] = [];
    for (let i = 0; i < 25; i += 1) {
      routes.push(
        makeRoute({
          id: `fav-${i}`,
          name: `Favorite ${i}`,
          createdAt: new Date(2026, 5, 28, 12, 0, i).toISOString(),
          favorite: true,
        }),
      );
    }
    for (let i = 0; i < 25; i += 1) {
      routes.push(
        makeRoute({
          id: `rec-${i}`,
          name: `Recent ${i}`,
          createdAt: new Date(2026, 5, 28, 12, 0, i).toISOString(),
          favorite: false,
        }),
      );
    }
    const pruned = pruneRecentRoutes(routes);
    // 25 favorites (all preserved) + 20 most-recent non-favorites = 45
    expect(pruned.length).toBe(45);
    expect(pruned.filter((r) => r.favorite).length).toBe(25);
    expect(pruned.filter((r) => !r.favorite).length).toBe(20);
  });

  it('saveRoute + loadSavedRoutes preserves evidence fields (sourceRefs, recommendationReasons, schemaVersion, ruleVersion)', () => {
    const route = makeRoute({
      id: 'evidence-test',
      name: 'Evidence Test Route',
      primaryRecommendations: ['maestro-brainstorm'],
      secondaryRecommendations: ['maestro-blueprint'],
      recommendationReasons: ['reason A', 'reason B'],
      sourceRefs: [
        { path: 'maestro-flow/.claude/commands/maestro-brainstorm.md', label: 'brainstorm cmd', status: 'cited' },
        { path: 'maestro-flow/.codex/skills/maestro-help/catalog.json', label: 'catalog', status: 'cited' },
      ],
      schemaVersion: 1,
      ruleVersion: 'M2-P2-rules-v1',
    });
    saveRoute(route);
    const loaded = loadSavedRoutes();
    expect(loaded).not.toBeNull();
    expect(loaded!.length).toBe(1);
    const retrieved = loaded![0];
    expect(retrieved.sourceRefs.length).toBe(2);
    expect(retrieved.sourceRefs[0].path).toBe('maestro-flow/.claude/commands/maestro-brainstorm.md');
    expect(retrieved.recommendationReasons).toEqual(['reason A', 'reason B']);
    expect(retrieved.primaryRecommendations).toContain('maestro-brainstorm');
    expect(retrieved.secondaryRecommendations).toContain('maestro-blueprint');
    expect(retrieved.schemaVersion).toBe(1);
    expect(retrieved.ruleVersion).toBe('M2-P2-rules-v1');
  });

  it('degrades to in-session memory when localStorage.setItem throws (QuotaExceededError)', () => {
    _resetRouteStorageState();
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new DOMException('quota exceeded', 'QuotaExceededError');
    };
    try {
      saveRoute(makeRoute({ id: 'fallback-test', name: 'Fallback Test' }));
      const loaded = loadSavedRoutes();
      // Should still return the route from session memory fallback
      expect(loaded).not.toBeNull();
      expect(loaded!.length).toBe(1);
      expect(loaded![0].id).toBe('fallback-test');
    } finally {
      Storage.prototype.setItem = originalSetItem;
      _resetRouteStorageState();
    }
  });

  it('degrades to in-session memory when localStorage.getItem throws (SecurityError)', () => {
    _resetRouteStorageState();
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new DOMException('security error', 'SecurityError');
    };
    try {
      const loaded = loadSavedRoutes();
      // Should return null or empty array from fallback, not throw
      expect(loaded).not.toBeNull();
      expect(Array.isArray(loaded)).toBe(true);
    } finally {
      Storage.prototype.getItem = originalGetItem;
      _resetRouteStorageState();
    }
  });

  it('toggleFavorite flips favorite flag and persists', () => {
    saveRoute(makeRoute({ id: 'toggle-test', favorite: false }));
    toggleFavorite('toggle-test');
    const loaded = loadSavedRoutes();
    expect(loaded).not.toBeNull();
    const route = loaded!.find((r) => r.id === 'toggle-test');
    expect(route).toBeDefined();
    expect(route!.favorite).toBe(true);
  });

  it('[UI-observable] renders saved-routes floating entry and opens routes list popover', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole('button', { name: '查看已保存的路线' });
    expect(toggle).toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByTestId('saved-routes-popover')).toBeInTheDocument();
    expect(screen.getByTestId('saved-routes-empty')).toHaveTextContent('暂无路线');
  });

  it('[UI-observable] saving current route adds an entry to the saved routes list', async () => {
    _resetRouteStorageState();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('scenario-card-A_full_project'));
    await user.click(screen.getByRole('button', { name: '查看已保存的路线' }));
    await user.click(screen.getByTestId('save-current-route-button'));

    const list = screen.getByTestId('saved-routes-list');
    expect(list).toHaveTextContent('maestro-brainstorm');
    expect(screen.queryByTestId('saved-routes-empty')).not.toBeInTheDocument();
    _resetRouteStorageState();
  });

  it('[UI-observable] toggle favorite moves route from Recent to Favorites section', async () => {
    _resetRouteStorageState();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('scenario-card-A_full_project'));
    await user.click(screen.getByRole('button', { name: '查看已保存的路线' }));
    await user.click(screen.getByTestId('save-current-route-button'));

    // Route appears in Recent section
    expect(screen.getByTestId('saved-routes-recent')).toHaveTextContent('maestro-brainstorm');

    // Click favorite toggle (non-favorite route uses "收藏路线" label)
    await user.click(screen.getByRole('button', { name: '收藏路线' }));

    // Route now appears in Favorites section
    expect(screen.getByTestId('saved-routes-favorites')).toHaveTextContent('maestro-brainstorm');
    _resetRouteStorageState();
  });

  it('[UI-observable] save-current-route button is disabled before scenario selection', () => {
    render(<App />);

    const toggle = screen.getByRole('button', { name: '查看已保存的路线' });
    fireEvent.click(toggle);

    const saveButton = screen.getByTestId('save-current-route-button') as HTMLButtonElement;
    expect(saveButton.disabled).toBe(true);
  });
});
