import { todos } from './todos';

jest.mock('nanoid', () => {
  let value = 0;
  return {
    nanoid: jest.fn().mockImplementation(() => {
      return String(++value);
    }),
  };
});

beforeEach(() => {
  window.localStorage.clear();
});

it('handles shopping list data', async () => {
  let todo = await todos.create('Buy groceries');
  expect(omit(todo, 'createdAt', 'updatedAt')).toMatchInlineSnapshot(`
    Object {
      "content": "Buy groceries",
      "id": "1",
      "status": "uncompleted",
    }
  `);

  await todos.toggle(todo.id);
  expect(omit(await todos.read(todo.id), 'createdAt', 'updatedAt')).toMatchInlineSnapshot(`
    Object {
      "content": "Buy groceries",
      "id": "1",
      "status": "completed",
    }
  `);

  await todos.delete(todo.id);
  expect(await todos.read(todo.id)).toBeNull();
});

function omit<T extends Record<string, unknown>, Keys extends keyof T>(
  item: T | null,
  ...keys: Array<Keys>
): Omit<T, Keys> | null {
  if (item == null) return null;

  let next = {} as Omit<T, Keys>;
  for (let [key, value] of Object.entries(item) as Array<[keyof T, T[keyof T]]>) {
    // @ts-expect-error Nope
    if (keys.includes(key)) continue;
    // @ts-expect-error Nope
    next[key] = value;
  }

  return next;
}
