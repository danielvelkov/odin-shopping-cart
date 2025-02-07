import { describe, it, expect } from 'vitest';
import App from 'src/App';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });

  it('false to be false', () => {
    expect(false).toBe(false);
  });
});

describe('App', () => {
  it('counter is 1 after button click', async () => {
    const user = userEvent.setup();

    render(<App />);
    const button = screen.getByRole('button', { name: /count is/i });

    expect(screen.getByRole('button').textContent).toMatch(/0/);
    await user.click(button);

    expect(screen.getByRole('button').textContent).toMatch(/1/);
  });
});
