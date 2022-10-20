import { format } from 'date-fns';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { Form, LoaderFunctionArgs, json, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

import { todos } from '../../data/todos';
import { TodoItemSchema } from '../../types';
import { HStack, PageSection, VStack } from '../../ui';

export const TodoSingle: React.FC = () => {
  let data = useLoaderData();
  let todo = TodoItemSchema.parse(data);

  return (
    <PageSection element="article" level="item">
      <VStack gap="8" flex="fill">
        <VStack element="header" gap="1" flex="fill">
          <HStack gap="1" text="xs">
            <p>Created: {format(new Date(todo.createdAt), 'yyyy-MM-dd HH:mm')}</p>
            <p>|</p>
            <p>Updated: {format(new Date(todo.updatedAt), 'yyyy-MM-dd HH:mm')}</p>
          </HStack>
          <h1 className="text-lg font-bold">{todo.content}</h1>
        </VStack>

        <Form method="post" action="..">
          <HStack gap="2">
            <input type="hidden" name="id" value={todo.id} />
            <button
              type="submit"
              name="action"
              value="toggle"
              aria-label={`Mark as ${todo.status === 'completed' ? 'not completed' : 'completed'}`}
              className="flex-1 flex place-content-center place-items-center bg-gray-100 h-24 rounded-md hover:bg-gray-200"
            >
              {todo.status === 'completed' ? <CheckCircle size={16} /> : <Circle size={16} />}
            </button>
            <button
              type="submit"
              name="action"
              value="delete"
              aria-label="Remove to-do"
              className="flex-1 flex place-content-center place-items-center bg-gray-100 h-24 rounded-md hover:bg-gray-200 hover:text-red-500"
            >
              <XCircle size={16} />
            </button>
          </HStack>
        </Form>
      </VStack>
    </PageSection>
  );
};

const ParamsSchema = z.object({
  id: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    let { id } = ParamsSchema.parse(params);
    let todo = await todos.read(id);

    if (todo == null) {
      throw new Response('Not found', { status: 404 });
    }

    return json(todo);
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      throw new Response('No id provided', { status: 400 });
    }

    throw new Error('Something unexpected happened');
  }
}
