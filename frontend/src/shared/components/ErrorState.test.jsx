import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './ErrorState.jsx';
import { ApiError } from '../api/httpClient.js';

describe('ErrorState', () => {
  it('renders the network message and a Retry button', () => {
    render(<ErrorState error={new ApiError('', 'network', 0)} onRetry={() => {}} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Could not reach the server. Check your connection.',
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when the button is clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState error={new ApiError('', 'server', 500)} onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
