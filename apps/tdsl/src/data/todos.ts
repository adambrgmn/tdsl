import { TodoItem, TodoItemSchema, TodoStatus } from '@tdsl/types';
import localforage from 'localforage';
import { nanoid } from 'nanoid';

export const todoStore = localforage.createInstance({ name: 'tdsl-todos', version: 1.0 });

export async function listTodos(status?: TodoStatus) {
  let items: Array<TodoItem> = [];
  let itemsToRemove: Array<string> = [];
  await todoStore.iterate((value, key) => {
    try {
      let item = TodoItemSchema.parse(value);
      if (status == null || item.status === status) {
        items.push(item);
      }
    } catch (error) {
      console.error(error);
      itemsToRemove.push(key);
    }
  });

  for (let id of itemsToRemove) {
    await deleteTodo(id);
  }

  return items;
}

export async function createTodo(content: string) {
  let id = nanoid();
  let createdAt = new Date().toUTCString();
  let item = TodoItemSchema.parse({ id, createdAt, updatedAt: createdAt, content, status: 'uncompleted' });
  await todoStore.setItem(id, item);

  return item;
}

export async function readTodo(id: string) {
  let value = await todoStore.getItem(id);
  if (value == null) return null;
  return TodoItemSchema.parse(value);
}

type UpdateValue<Value> = Partial<Value> | ((previous: Value) => Value);

export async function updateTodo(id: string, value: UpdateValue<TodoItem>) {
  let current = await readTodo(id);
  if (current == null) return null;

  let next = typeof value === 'function' ? value(current) : { ...current, ...value };
  next.updatedAt = new Date().toUTCString();

  return todoStore.setItem(id, TodoItemSchema.parse(next));
}

export async function deleteTodo(id: string) {
  await todoStore.removeItem(id);
}

export async function toggleTodo(id: string) {
  return updateTodo(id, (prev) => ({
    ...prev,
    status: prev.status === 'completed' ? 'uncompleted' : 'completed',
  }));
}

export const todos = {
  list: listTodos,
  create: createTodo,
  read: readTodo,
  update: updateTodo,
  delete: deleteTodo,

  toggle: toggleTodo,
} as const;
