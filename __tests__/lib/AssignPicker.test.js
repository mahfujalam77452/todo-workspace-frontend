import { render, screen } from '@testing-library/react';
import AssignPicker from '@/components/todos/AssignPicker';

const currentUser = { id: 1, name: 'Ayesha' };
const team = { id: 1, name: 'Product' };
const members = [
  { id: 1, name: 'Ayesha' },
  { id: 2, name: 'Rahim' },
];

describe('AssignPicker', () => {
  it('offers only Myself and the members of the team', () => {
    render(
      <AssignPicker id="assign" value="" onChange={() => {}} members={members} team={team} currentUser={currentUser} />,
    );
    const options = screen.getAllByRole('option').map((option) => option.textContent);
    expect(options).toEqual(['Not assigned yet', 'Myself', 'Rahim']);
  });

  it('shows a message instead of the picker when the user has no team', () => {
    render(
      <AssignPicker id="assign" value="" onChange={() => {}} members={[]} team={null} currentUser={currentUser} />,
    );
    expect(screen.getByText(/You are not in a team, contact an admin/)).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});