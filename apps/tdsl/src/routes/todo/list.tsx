import { CheckCircle, Circle, ListPlus, XCircle } from 'lucide-react';
import { Fragment } from 'react';
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  Outlet,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import * as z from 'zod';

import { todos } from '../../data/todos';
import { TodoItem, TodoItemSchema, TodoStatusSchema } from '../../types';
import { cx } from '../../utils';

export const TodoList: React.FC = () => {
  let data = useLoaderData();
  let items = TodoItemSchema.array().parse(data);

  let actionData = useActionData();
  let contentError = getErrorMessage('content', actionData);

  let completed: Array<TodoItem> = [];
  let uncompleted: Array<TodoItem> = [];
  for (let item of items) {
    if (item.status === 'completed') {
      completed.push(item);
    } else {
      uncompleted.push(item);
    }
  }

  return (
    <Fragment>
      <div className="p-4 flex flex-col gap-8 bg-gray-200 rounded-md">
        <Form method="post">
          <div className="flex bg-white items-stretch p-2 rounded">
            <label className="flex flex-col flex-1">
              <div className="text-xs tracking-wider flex gap-4">
                <span className="text-gray-700">New todo</span>
                {contentError != null ? (
                  <span role="alert" className="text-red-500">
                    {contentError.message}
                  </span>
                ) : null}
              </div>
              <input
                key={items.length}
                type="text"
                name="content"
                placeholder="What needs to be done?"
                autoFocus
                className="placeholder:text-gray-400"
                aria-invalid={contentError != null}
                aria-required
              />
            </label>

            <button
              type="submit"
              name="action"
              value="create"
              aria-label="Create new to-do item"
              className="hover:text-blue-500"
            >
              <ListPlus />
            </button>
          </div>
        </Form>

        <div className="flex flex-col gap-1 flex-1">
          <h2 className="text-xs tracking-wider">To-do</h2>
          <ul className="flex flex-col gap-2 items-stretch">
            {uncompleted.map((item) => (
              <Todo key={item.id} item={item} />
            ))}
            {completed.map((item) => (
              <Todo key={item.id} item={item} />
            ))}
          </ul>
        </div>

        <div className="p-2 bg-white rounded">
          <p className="text-xs tracking-wider">Filters</p>
          <ul className="flex gap-4 text-sm">
            <li>
              <Link to={{ search: '' }} className="hover:text-blue-500">
                Show all
              </Link>
            </li>
            <li>
              <Link to={{ search: '?status=uncompleted' }} className="hover:text-blue-500">
                Show not completed
              </Link>
            </li>
            <li>
              <Link to={{ search: '?status=completed' }} className="hover:text-blue-500">
                Show completed
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Outlet />
    </Fragment>
  );
};

const Todo: React.FC<{ item: TodoItem }> = ({ item }) => {
  return (
    <li
      key={item.id}
      className={cx('p-2 rounded hover:bg-gray-50 flex gap-2 items-center', {
        'bg-white': item.status === 'uncompleted',
        'bg-gray-100 text-gray-500': item.status === 'completed',
      })}
    >
      <Form method="post" className="contents">
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          name="action"
          value="toggle"
          aria-label={`Mark as ${item.status === 'completed' ? 'not completed' : 'completed'}`}
          className={cx({
            'hover:text-green-500': item.status === 'uncompleted',
          })}
        >
          {item.status === 'completed' ? <CheckCircle size={16} /> : <Circle size={16} />}
        </button>
        <Link to={`./${item.id}`} className="flex-1">
          {item.content}
        </Link>
        <button type="submit" name="action" value="delete" aria-label="Remove item" className="hover:text-red-500">
          <XCircle size={16} />
        </button>
      </Form>
    </li>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let status = TodoStatusSchema.safeParse(url.searchParams.get('status'));
  let items = await todos.list(status.success ? status.data : undefined);
  return json(items.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)));
}

const ActionInputSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('create'),
    content: z.string().min(1, 'Your to-do must contain at least one character'),
  }),
  z.object({ action: z.literal('toggle'), id: z.string() }),
  z.object({ action: z.literal('delete'), id: z.string() }),
]);

export async function action({ request }: ActionFunctionArgs) {
  let formData = Object.fromEntries(await request.formData());
  let input = ActionInputSchema.safeParse(formData);

  if (!input.success) return json(input.error);

  switch (input.data.action) {
    case 'create': {
      let next = await todos.create(input.data.content.trim());
      let url = new URL(request.url);
      return redirect(`${url.pathname}/${next.id}${url.search}`);
    }

    case 'toggle': {
      let next = await todos.toggle(input.data.id);
      if (next == null) throw new Response('Not found', { status: 404 });

      let url = new URL(request.url);
      return redirect(`${url.pathname}/${next.id}${url.search}`);
    }

    case 'delete': {
      await todos.delete(input.data.id);
      return redirect('/todo');
    }
  }
}

function getErrorMessage(name: string, error: unknown) {
  if (!isValidationError(error)) return null;
  return error.issues.find((err) => err.path[0] === name) ?? null;
}

function isValidationError(error: unknown): error is z.ZodError {
  return error != null && 'issues' in error;
}
