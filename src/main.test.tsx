import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './main';

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
