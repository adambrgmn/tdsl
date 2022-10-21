import { ShoppingList, ShopplingListItemSchema as ShoppingListItemSchema, ShoppingListSchema } from '@tdsl/types';
import localforage from 'localforage';
import { nanoid } from 'nanoid';

export const shoppingListStore = localforage.createInstance({ name: 'tdsl-shopping-lists', version: 1.0 });

export async function listShoppingLists() {
  let items: Array<ShoppingList> = [];
  let itemsToRemove: Array<string> = [];
  await shoppingListStore.iterate((value, key) => {
    try {
      let item = ShoppingListSchema.parse(value);
      items.push(item);
    } catch (error) {
      console.error(error);
      itemsToRemove.push(key);
    }
  });

  for (let id of itemsToRemove) {
    await deleteShoppingList(id);
  }

  return items;
}

export async function createShoppingList(title: string) {
  let id = nanoid();
  let createdAt = new Date().toUTCString();
  let item = ShoppingListSchema.parse({
    id,
    createdAt,
    updatedAt: createdAt,
    title,
    status: 'uncompleted',
    items: [],
  });
  await shoppingListStore.setItem(id, item);

  return item;
}

export async function readShoppingList(id: string) {
  let value = await shoppingListStore.getItem(id);
  if (value == null) return null;
  return ShoppingListSchema.parse(value);
}

type UpdateValue<Value> = Partial<Value> | ((previous: Value) => Value);

export async function updateShoppingList(id: string, value: UpdateValue<ShoppingList>) {
  let current = await readShoppingList(id);
  if (current == null) return null;

  let next = typeof value === 'function' ? value(current) : { ...current, ...value };
  next.updatedAt = new Date().toUTCString();

  return shoppingListStore.setItem(id, ShoppingListSchema.parse(next));
}

export async function deleteShoppingList(id: string) {
  await shoppingListStore.removeItem(id);
}

export async function appendShoppingListItem(listId: string, content: string) {
  let item = ShoppingListItemSchema.parse({ id: nanoid(), status: 'unpicked', content });
  return updateShoppingList(listId, (prev) => ({ ...prev, items: [...prev.items, item] }));
}

export async function deleteShoppingListItem(listId: string, itemId: string) {
  return updateShoppingList(listId, (prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== itemId) }));
}

export async function toggleShoppingListItem(listId: string, itemId: string) {
  return updateShoppingList(listId, (prev) => ({
    ...prev,
    items: prev.items.map((item) => {
      if (item.id === itemId) {
        return { ...item, status: item.status === 'picked' ? 'unpicked' : 'picked' };
      }

      return item;
    }),
  }));
}

export const shoppingLists = {
  list: listShoppingLists,
  create: createShoppingList,
  read: readShoppingList,
  update: updateShoppingList,
  delete: deleteShoppingList,

  appendItem: appendShoppingListItem,
  deleteItem: deleteShoppingListItem,
  toggleItem: toggleShoppingListItem,
} as const;
