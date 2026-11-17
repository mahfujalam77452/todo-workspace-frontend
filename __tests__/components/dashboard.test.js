import { render, screen } from '@testing-library/react';
import DonutChart from '@/components/admin/DonutChart';
import ProgressRing from '@/components/admin/ProgressRing';
import { sortUsers } from '@/lib/dashboard';

const users = [
  { id: 1, name: 'Bashir', assigned_count: 2, completion_rate: 50 },
  { id: 2, name: 'Ayesha', assigned_count: 8, completion_rate: 25 },
  { id: 3, name: 'Chandra', assigned_count: 8, completion_rate: 90 },
];

describe('dashboard', () => {
  it('sorts users by name by default and by a metric, biggest first', () => {
    expect(sortUsers(users, '').map((user) => user.name)).toEqual(['Ayesha', 'Bashir', 'Chandra']);
    expect(sortUsers(users, 'completion').map((user) => user.name)).toEqual(['Chandra', 'Bashir', 'Ayesha']);
    // Same number of assigned todos: the names decide
    expect(sortUsers(users, 'assigned').map((user) => user.name)).toEqual(['Ayesha', 'Chandra', 'Bashir']);
  });

  it('shows the completion rate in the ring', () => {
    render(<ProgressRing value={28.57} label="Completion rate" />);
    expect(screen.getByRole('img', { name: 'Completion rate: 28.6%' })).toBeInTheDocument();
  });

  it('describes the donut chart with numbers, not only colors', () => {
    render(<DonutChart completed={12} incomplete={30} />);
    expect(screen.getByRole('img', { name: '12 completed and 30 incomplete todos' })).toBeInTheDocument();
    expect(screen.getByText('Completed: 12')).toBeInTheDocument();
    expect(screen.getByText('Incomplete: 30')).toBeInTheDocument();
  });
});