import { format } from 'date-fns';
import { ActionFunctionArgs, Form, LoaderFunctionArgs, json, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

import { shoppingLists } from '../../data/shopping-lists';
import { ShoppingListItem, ShoppingListSchema } from '../../types';

export const ShoppingList: React.FC = () => {
  let data = useLoaderData();
  let list = ShoppingListSchema.parse(data);

  let picked: Array<ShoppingListItem> = [];
  let unpicked: Array<ShoppingListItem> = [];
  for (let item of list.items) {
    if (item.status === 'picked') {
      picked.push(item);
    } else {
      unpicked.push(item);
    }
  }

  return (
    <article>
      <h1>{list.title}</h1>

      <aside>
        <p>Created: {format(new Date(list.createdAt), 'yyyy-MM-dd HH:mm')}</p>
        <p>Updated: {format(new Date(list.updatedAt), 'yyyy-MM-dd HH:mm')}</p>

        <Form method="post" action="..">
          <input type="hidden" name="id" value={list.id} />
          <button type="submit" name="action" value="delete">
            Remove list
          </button>
        </Form>
      </aside>

      <h2>Pick up</h2>
      <ul>
        {unpicked.map((item) => (
          <li key={item.id}>
            <Form method="post">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" name="action" value="toggle">
                Mark as {item.status === 'picked' ? 'not picked' : 'picked'}
              </button>
              {item.content}
              <button type="submit" name="action" value="delete">
                Remove item
              </button>
            </Form>
          </li>
        ))}
      </ul>

      <h2>Already picked</h2>
      <ul>
        {picked.map((item) => (
          <li key={item.id}>
            <Form method="post">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" name="action" value="toggle">
                Mark as {item.status === 'picked' ? 'not picked' : 'picked'}
              </button>
              {item.content}
              <button type="submit" name="action" value="delete">
                Remove item
              </button>
            </Form>
          </li>
        ))}
      </ul>

      <footer>
        <Form method="post">
          <div>
            <label>
              <span>New list item</span>
              <input type="text" name="content" placeholder="What do you need?" />
            </label>
          </div>
          <button type="submit" name="action" value="create">
            Add new item
          </button>
        </Form>
      </footer>
    </article>
  );
};

const ParamsSchema = z.object({ id: z.string() });

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    let { id } = ParamsSchema.parse(params);
    let list = await shoppingLists.read(id);

    if (list == null) throw new Response('Not found', { status: 404 });
    return json(list);
  } catch (error) {
    if (error instanceof Response) throw error;
    if (error instanceof z.ZodError) throw new Response('No id provided', { status: 400 });

    throw new Error('Something unexpected happened');
  }
}

const ActionInputSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), content: z.string().min(1, 'An item needs some content') }),
  z.object({ action: z.literal('toggle'), id: z.string() }),
  z.object({ action: z.literal('delete'), id: z.string() }),
]);

export async function action({ request, params }: ActionFunctionArgs) {
  let formData = Object.fromEntries(await request.formData());
  let input = ActionInputSchema.safeParse(formData);

  let listId = ParamsSchema.parse(params).id;

  if (!input.success) return json(input.error);

  switch (input.data.action) {
    case 'create': {
      let next = await shoppingLists.appendItem(listId, input.data.content);
      return json(next);
    }

    case 'delete': {
      let next = await shoppingLists.deleteItem(listId, input.data.id);
      return json(next);
    }

    case 'toggle': {
      let next = await shoppingLists.toggleItem(listId, input.data.id);
      return json(next);
    }
  }
}
