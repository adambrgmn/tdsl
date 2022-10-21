import { todos } from '@tdsl/data-todos';
import { TodoItem, TodoItemSchema, TodoStatusSchema } from '@tdsl/types';
import {
  ActionList,
  ActionListItem,
  CreateInput,
  HStack,
  PageSection,
  Spacer,
  SuspendedOutlet,
  VStack,
} from '@tdsl/ui';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { Fragment } from 'react';
import { ActionFunctionArgs, Link, LoaderFunctionArgs, json, redirect, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

export const TodoList: React.FC = () => {
  let data = useLoaderData();
  let items = TodoItemSchema.array().parse(data);

  let completed: Array<TodoItem> = [];
  let uncompleted: Array<TodoItem> = [];
  for (let item of items) {
    if (item.status === 'completed') {
      completed.push(item);
    } else {
      uncompleted.push(item);
    }
  }

  let todos = uncompleted.concat(completed);

  return (
    <Fragment>
      <PageSection element="div" level="secondary">
        <VStack gap="8" flex="fill">
          <CreateInput
            label="New to-do"
            name="content"
            placeholder="What needs to be done?"
            submitLabel="Create new to-do item"
          />

          <ActionList title="To-do">
            {todos.map((item) => (
              <ActionListItem
                key={item.id}
                id={item.id}
                title={item.content}
                to={`./${item.id}`}
                background={item.status === 'uncompleted' ? 'regular' : 'dimmed'}
                left={{
                  action: 'toggle',
                  label: `Mark item as ${item.status === 'uncompleted' ? '' : 'not '}completed`,
                  icon: item.status === 'uncompleted' ? <Circle size={16} /> : <CheckCircle size={16} />,
                  kind: item.status === 'uncompleted' ? 'success' : undefined,
                }}
                right={{
                  action: 'delete',
                  label: 'Remove item',
                  icon: <XCircle size={16} />,
                  kind: 'destructive',
                }}
              />
            ))}
          </ActionList>

          <Spacer size="fill" />

          <VStack background="white" padding="2" rounded="normal">
            <p className="text-xs tracking-wider">Filters</p>
            <HStack element="ul" gap="4" text="sm">
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
            </HStack>
          </VStack>
        </VStack>
      </PageSection>

      <SuspendedOutlet />
    </Fragment>
  );
};

export default TodoList;

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
