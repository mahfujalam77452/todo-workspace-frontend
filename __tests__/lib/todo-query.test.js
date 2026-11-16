import { buildListHref, buildTodoQuery, getPaging, pickFilters } from '@/lib/todo-query';
import { validateTodo } from '@/lib/validators';

describe('todo query helpers', () => {
  it('keeps only known filters and drops empty values', () => {
    const filters = pickFilters({ status: 'pending', search: '   ', hack: 'x', priority: ['1', '2'] });
    expect(filters).toEqual({ status: 'pending', priority: '1' });
  });

  it('limits the paging values', () => {
    expect(getPaging({})).toEqual({ limit: 10, offset: 0 });
    expect(getPaging({ limit: '500', offset: '-5' })).toEqual({ limit: 100, offset: 0 });
    expect(getPaging({ limit: '20', offset: '40' })).toEqual({ limit: 20, offset: 40 });
  });

  it('builds the backend query and the tab links', () => {
    expect(buildTodoQuery({ status: 'pending' }, { limit: 10, offset: 20 })).toBe(
      'status=pending&limit=10&offset=20',
    );
    expect(buildListHref({ status: 'pending' }, { relation: 'assigned_to_me' })).toBe(
      '/todos?status=pending&relation=assigned_to_me',
    );
    expect(buildListHref({}, {})).toBe('/todos');
  });
});

describe('validateTodo', () => {
  it('requires a title and limits its length', () => {
    expect(validateTodo({ title: '  ', description: '' }).title).toBeDefined();
    expect(validateTodo({ title: 'a'.repeat(256), description: '' }).title).toBeDefined();
    expect(validateTodo({ title: 'Review PR', description: '' })).toEqual({});
  });
});