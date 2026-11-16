import { render, screen } from '@testing-library/react';
import TodoDetailView from '@/components/todos/TodoDetailView';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn(), replace: jest.fn(), push: jest.fn() }),
}));
jest.mock('@/lib/api-client', () => ({ apiFetch: jest.fn() }));

const team = { id: 1, name: 'Product' };
const assigner = { id: 1, name: 'Ayesha', email: 'ayesha@example.com' };
const assignee = { id: 2, name: 'Rahim', email: 'rahim@example.com' };

function makeTodo(overrides = {}) {
  return {
    id: 10,
    title: 'Review PR',
    description: 'Check the API changes',
    status: 'pending',
    priority: 2,
    due_date: null,
    category: null,
    category_name: null,
    assigner,
    assignee,
    team,
    assignment_status: 'pending',
    assigned_at: null,
    responded_at: null,
    created_at: '2026-11-13T09:00:00+06:00',
    ...overrides,
  };
}

const assignerUser = { ...assigner, role: 'member', team };
const assigneeUser = { ...assignee, role: 'member', team };

function renderView(todo, currentUser, extra = {}) {
  render(<TodoDetailView todo={todo} currentUser={currentUser} members={[assigner, assignee]} {...extra} />);
}

const button = (name) => screen.queryByRole('button', { name });

describe('TodoDetailView permissions', () => {
  it('lets the assignee edit, accept and reject a pending todo', () => {
    renderView(makeTodo(), assigneeUser);
    expect(button('Accept')).toBeInTheDocument();
    expect(button('Reject')).toBeInTheDocument();
    expect(button('Save changes')).toBeInTheDocument();
    expect(button('Delete todo')).not.toBeInTheDocument();
  });

  it('hides accept and reject once the assignment is accepted', () => {
    renderView(makeTodo({ assignment_status: 'accepted' }), assigneeUser);
    expect(button('Accept')).not.toBeInTheDocument();
    expect(button('Reject')).not.toBeInTheDocument();
    expect(button('Save changes')).toBeInTheDocument();
  });

  it('gives the assigner a read-only view with delete', () => {
    renderView(makeTodo(), assignerUser);
    expect(button('Accept')).not.toBeInTheDocument();
    expect(button('Reject')).not.toBeInTheDocument();
    expect(button('Save changes')).not.toBeInTheDocument();
    expect(button('Delete todo')).toBeInTheDocument();
  });

  it('shows no action buttons at all in readOnly mode', () => {
    renderView(makeTodo(), assignerUser, { readOnly: true });
    ['Accept', 'Reject', 'Save changes', 'Delete todo', 'Assign'].forEach((name) => {
      expect(button(name)).not.toBeInTheDocument();
    });
  });
});