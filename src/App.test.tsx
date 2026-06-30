import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('渲染主标题', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /Maestro 工作流百科/ }),
    ).toBeInTheDocument();
  });
});
