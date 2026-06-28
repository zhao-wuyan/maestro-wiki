import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App, authoredRules, recommendCommands, validateRuleSet, isVisibleNode } from './main';
import type { RecommendationRule, SimulatedProjectState } from './main';

describe('Maestro Workflow Wiki fullscreen canvas shell', () => {
  it('[UI-observable] renders hero, fullscreen button, scenario label, and empty initial canvas with guidance copy', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /把复杂工作流变成可点击/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '进入全屏' })).toBeInTheDocument();
    expect(screen.getByTestId('scenario-label')).toBeInTheDocument();
    expect(screen.getByTestId('guidance-overlay')).toBeInTheDocument();
    expect(screen.getByText('未选择场景')).toBeInTheDocument();
    expect(screen.getByText('unclear-requirements')).toBeInTheDocument();

    const intentNode = screen.getByRole('button', { name: '查看 模糊目标' });
    expect(intentNode).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '查看 探索方向' })).not.toBeInTheDocument();
  });

  it('[UI-observable] reveals subsequent nodes after first scenario selection and hides guidance copy', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '查看 模糊目标' }));

    expect(screen.queryByTestId('guidance-overlay')).not.toBeInTheDocument();
    expect(screen.getByText('Unclear Requirements')).toBeInTheDocument();
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

    const intentNode = screen.getByRole('button', { name: '查看 模糊目标' });
    intentNode.focus();
    await user.keyboard('{Enter}');

    expect(screen.queryByTestId('guidance-overlay')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '查看 探索方向' })).toBeInTheDocument();
  });

  it('[UI-observable] advances active step via on-canvas choice buttons', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '查看 模糊目标' }));
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
    expect(canvasShell.getByText('unclear-requirements')).toBeInTheDocument();
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
