import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App, authoredRules, recommendCommands, validateRuleSet } from './main';
import type { RecommendationRule, SimulatedProjectState } from './main';

describe('Maestro Workflow Wiki scenario map', () => {
  it('shows the initial scenario and recommended command', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Unclear Requirements' })).toBeInTheDocument();
    expect(screen.getAllByText('maestro-brainstorm').length).toBeGreaterThan(0);
    expect(screen.getByText('Local scenario validation: 0 errors.')).toBeInTheDocument();
  });

  it('advances command choices and exposes terminal routes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /方向已稳定/ }));
    expect(screen.getAllByText('maestro-blueprint').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /规格可执行/ }));
    expect(screen.getAllByText('maestro-analyze 1').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /分析结论为 GO/ }));
    expect(screen.getAllByText('maestro-plan 1').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /计划完成/ }));
    expect(screen.getByText('Stop')).toBeInTheDocument();
    expect(screen.getByText('Quality Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Capture')).toBeInTheDocument();
  });

  it('supports keyboard node activation and checklist toggles', async () => {
    const user = userEvent.setup();
    render(<App />);

    const analyzeNode = screen.getByRole('button', { name: '查看 Phase 分析' });
    analyzeNode.focus();
    await user.keyboard('{Enter}');
    expect(screen.getAllByText('maestro-analyze 1').length).toBeGreaterThan(0);

    const checklist = screen.getByRole('region', { name: '本地验证清单' });
    const firstCheck = within(checklist).getByRole('checkbox', { name: /当前推荐 command/ });
    await user.click(firstCheck);
    expect(firstCheck).toBeChecked();
    expect(within(checklist).getByText('1/3')).toBeInTheDocument();
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
