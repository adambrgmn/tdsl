import { format } from 'date-fns';
import { Form, LoaderFunctionArgs, json, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

import { todos } from '../../data/todos';
import { TodoItemSchema } from '../../types';

export const TodoSingle: React.FC = () => {
  let data = useLoaderData();
  let todo = TodoItemSchema.parse(data);

  return (
    <article>
      <h1>{todo.content}</h1>
      <p>Created: {format(new Date(todo.createdAt), 'yyyy-MM-dd HH:mm')}</p>
      <p>Updated: {format(new Date(todo.updatedAt), 'yyyy-MM-dd HH:mm')}</p>

      <Form method="post" action="..">
        <input type="hidden" name="id" value={todo.id} />
        <button type="submit" name="action" value="toggle">
          Mark as {todo.status === 'completed' ? 'not completed' : 'completed'}
        </button>
        <button type="submit" name="action" value="delete">
          Remove todo
        </button>
      </Form>
    </article>
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
