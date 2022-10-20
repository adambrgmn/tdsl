import { shoppingLists } from './shopping-lists';

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
  let list = await shoppingLists.create('Shopping list');
  expect(omit(list, 'createdAt', 'updatedAt')).toMatchInlineSnapshot(`
    Object {
      "id": "1",
      "items": Array [],
      "title": "Shopping list",
    }
  `);

  expect(await shoppingLists.read(list.id)).toEqual(list);

  await shoppingLists.appendItem(list.id, 'Bananas');
  expect(omit(await shoppingLists.read(list.id), 'createdAt', 'updatedAt')).toMatchInlineSnapshot(`
    Object {
      "id": "1",
      "items": Array [
        Object {
          "content": "Bananas",
          "id": "2",
          "status": "unpicked",
        },
      ],
      "title": "Shopping list",
    }
  `);

  await shoppingLists.toggleItem(list.id, '2');
  expect(omit(await shoppingLists.read(list.id), 'createdAt', 'updatedAt')).toMatchInlineSnapshot(`
    Object {
      "id": "1",
      "items": Array [
        Object {
          "content": "Bananas",
          "id": "2",
          "status": "picked",
        },
      ],
      "title": "Shopping list",
    }
  `);

  await shoppingLists.deleteItem(list.id, '2');
  expect(omit(await shoppingLists.read(list.id), 'createdAt', 'updatedAt')).toMatchInlineSnapshot(`
    Object {
      "id": "1",
      "items": Array [],
      "title": "Shopping list",
    }
  `);

  await shoppingLists.delete(list.id);
  expect(await shoppingLists.read(list.id)).toBeNull();
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
