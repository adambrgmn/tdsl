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
    <div>
      <div>
        <div>
          <p>Filters:</p>
          <ul>
            <li>
              <Link to={{ search: '' }}>Show all</Link>
            </li>
            <li>
              <Link to={{ search: '?status=uncompleted' }}>Show uncompleted</Link>
            </li>
            <li>
              <Link to={{ search: '?status=completed' }}>Show completed</Link>
            </li>
          </ul>
        </div>

        <Form method="post">
          <div>
            <label>
              <span>New todo</span>
              <input
                type="text"
                name="content"
                id="content"
                placeholder="What needs to be done?"
                aria-invalid={contentError != null}
                aria-required
              />
              {contentError != null ? <p role="alert">{contentError.message}</p> : null}
            </label>
          </div>

          <button type="submit" name="action" value="create">
            Create
          </button>
        </Form>

        <h2>To do</h2>
        <ul>
          {uncompleted.map((item) => (
            <li key={item.id}>
              <Form method="post">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" name="action" value="toggle">
                  Mark as {item.status === 'completed' ? 'not completed' : 'completed'}
                </button>
                <Link to={`./${item.id}`}>{item.content}</Link>
                <button type="submit" name="action" value="delete">
                  Remove item
                </button>
              </Form>
            </li>
          ))}
        </ul>

        <h2>Done</h2>
        <ul>
          {completed.map((item) => (
            <li key={item.id}>
              <Form method="post">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" name="action" value="toggle">
                  Mark as {item.status === 'completed' ? 'not completed' : 'completed'}
                </button>
                <Link to={`./${item.id}`}>{item.content}</Link>
                <button type="submit" name="action" value="delete">
                  Remove item
                </button>
              </Form>
            </li>
          ))}
        </ul>
      </div>

      <Outlet />
    </div>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let status = TodoStatusSchema.safeParse(url.searchParams.get('status'));
  let items = await todos.list(status.success ? status.data : undefined);
  return json(items.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)));
}

const ActionInputSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), content: z.string().min(1, 'Content must contain at least one character') }),
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
