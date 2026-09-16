import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusCounts } from '../src/components/StatusCounts';
import type { Job } from '../src/types';

describe('StatusCounts', () => {
  it('correctly aggregates job statuses including edge cases', () => {
    const mockJobs: Job[] = [
      { id: '1', title: 'Task 1', type: 'A', status: 'pending', createdAt: '2023-01-01', version: 1 },
      { id: '2', title: 'Task 2', type: 'B', status: 'pending', createdAt: '2023-01-01', version: 1 },
      { id: '3', title: 'Task 3', type: 'A', status: 'failed', createdAt: '2023-01-01', version: 1 },
      // Edge case: no 'running' or 'completed' jobs provided
    ];

    render(<StatusCounts jobs={mockJobs} />);

    // Total should be 3
    expect(screen.getByText('Total').nextElementSibling?.textContent).toBe('3');

    // Pending should be 2
    expect(screen.getByText('Pending').nextElementSibling?.textContent).toBe('2');

    // Failed should be 1
    expect(screen.getByText('Failed').nextElementSibling?.textContent).toBe('1');

    // Running and Completed should default to 0
    expect(screen.getByText('Running').nextElementSibling?.textContent).toBe('0');
    expect(screen.getByText('Completed').nextElementSibling?.textContent).toBe('0');
  });

  it('renders gracefully with an empty array', () => {
    render(<StatusCounts jobs={[]} />);
    expect(screen.getByText('Total').nextElementSibling?.textContent).toBe('0');
    expect(screen.getByText('Pending').nextElementSibling?.textContent).toBe('0');
  });
});
