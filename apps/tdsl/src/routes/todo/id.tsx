import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { LoaderFunctionArgs, json, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

import { todos } from '../../data/todos';
import { TodoItemSchema } from '../../types';
import { ItemActionButton, ItemActions, ItemHeader, PageSection, Spacer, VStack } from '../../ui';

export const TodoSingle: React.FC = () => {
  let data = useLoaderData();
  let todo = TodoItemSchema.parse(data);

  return (
    <PageSection element="section" level="item">
      <VStack gap="8" flex="fill">
        <ItemHeader createdAt={todo.createdAt} updatedAt={todo.updatedAt}>
          {todo.content}
        </ItemHeader>

        <Spacer />

        <ItemActions id={todo.id} action="..">
          <ItemActionButton
            action="toggle"
            label={`Mark as ${todo.status === 'completed' ? 'not completed' : 'completed'}`}
            icon={todo.status === 'completed' ? <CheckCircle size={16} /> : <Circle size={16} />}
          />
          <ItemActionButton action="delete" label="Remove to-do" icon={<XCircle size={16} />} />
        </ItemActions>
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
    if (error instanceof Response) throw error;
    if (error instanceof z.ZodError) throw new Response('No id provided', { status: 400 });

    throw new Response('Something unexpected happened', { status: 500 });
  }
}
