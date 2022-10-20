import { ActionFunctionArgs, Form, Link, Outlet, json, redirect, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

import { shoppingLists } from '../../data/shopping-lists';
import { ShoppingListSchema } from '../../types';

export const ShoppingLists: React.FC = () => {
  let data = useLoaderData();
  let items = ShoppingListSchema.array().parse(data);

  return (
    <div>
      <div>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Form method="post">
                <Link to={`./${item.id}`}>{item.title}</Link>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" name="action" value="delete">
                  Remove list
                </button>
              </Form>
            </li>
          ))}
        </ul>

        <Form method="post">
          <div>
            <label>
              <span>New list</span>
              <input type="text" name="title" placeholder="What should it be called?" />
            </label>
          </div>

          <button type="submit" name="action" value="create">
            Create
          </button>
        </Form>
      </div>

      <Outlet />
    </div>
  );
};

export async function loader() {
  let items = await shoppingLists.list();
  return json(items);
}

const ActionInputSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create'), title: z.string().min(1, 'Title must contain at least one character') }),
  z.object({ action: z.literal('delete'), id: z.string() }),
]);

export async function action({ request }: ActionFunctionArgs) {
  let formData = Object.fromEntries(await request.formData());
  let input = ActionInputSchema.safeParse(formData);

  if (!input.success) return json(input.error);

  switch (input.data.action) {
    case 'create': {
      let next = await shoppingLists.create(input.data.title);
      let url = new URL(request.url);
      return redirect(`${url.pathname}/${next.id}`);
    }

    case 'delete': {
      await shoppingLists.delete(input.data.id);
      return redirect('/shopping');
    }
  }
}
