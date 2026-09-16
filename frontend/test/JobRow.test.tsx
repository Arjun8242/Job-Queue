import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobRow } from '../src/components/JobRow';
import type { Job } from '../src/types';
import { api } from '../src/api';

// Mock the API module
vi.mock('../src/api', () => ({
  api: {
    updateStatus: vi.fn(),
    deleteJob: vi.fn(),
  },
}));

describe('JobRow', () => {
  const mockOnUpdate = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and shows appropriate buttons for a pending job', () => {
    const job: Job = { id: '1', title: 'Test Job', type: 'test', status: 'pending', createdAt: new Date().toISOString(), version: 0 };
    render(<JobRow job={job} onUpdate={mockOnUpdate} onError={mockOnError} />);
    
    // Should show title
    expect(screen.getByText('Test Job')).toBeInTheDocument();
    
    // Pending job should only show the "running" transition button (Start Job) + Delete
    expect(screen.getByTitle('Start Job')).toBeInTheDocument();
    expect(screen.queryByTitle('Complete Job')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Fail Job')).not.toBeInTheDocument();
    expect(screen.getByTitle('Delete Job')).toBeInTheDocument();
  });

  it('handles API errors gracefully and displays error banner via callback', async () => {
    const job: Job = { id: '1', title: 'Test Job', type: 'test', status: 'pending', createdAt: new Date().toISOString(), version: 0 };
    
    // Force the API mock to throw an error (simulating a race condition or 409 conflict)
    (api.updateStatus as any).mockRejectedValueOnce(new Error('Job was modified by another request'));

    render(<JobRow job={job} onUpdate={mockOnUpdate} onError={mockOnError} />);
    
    const startButton = screen.getByTitle('Start Job');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Job was modified by another request');
    });
    
    // Ensure onUpdate was NOT called
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });
});
