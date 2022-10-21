import { ShoppingListItem, ShoppingListSchema } from '@tdsl/types';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { ActionFunctionArgs, LoaderFunctionArgs, json, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

import { shoppingLists } from '../../data/shopping-lists';
import { ActionList, ActionListItem, CreateInput, ItemHeader, PageSection, Spacer, VStack } from '../../ui';

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
    <PageSection element="section" level="item">
      <VStack gap="8">
        <ItemHeader createdAt={list.createdAt} updatedAt={list.updatedAt}>
          {list.title}
        </ItemHeader>

        <ActionList title="Pick up">
          {unpicked.map((item) => (
            <ActionListItem
              key={item.id}
              id={item.id}
              title={item.content}
              left={{ action: 'toggle', label: 'Mark as picked', icon: <Circle size={16} />, kind: 'success' }}
              right={{ action: 'delete', label: 'Remove item', icon: <XCircle size={16} />, kind: 'destructive' }}
            />
          ))}
        </ActionList>

        <ActionList title="Already picked">
          {picked.map((item) => (
            <ActionListItem
              key={item.id}
              id={item.id}
              title={item.content}
              left={{ action: 'toggle', label: 'Mark as not picked', icon: <CheckCircle size={16} /> }}
              right={{ action: 'delete', label: 'Remove item', icon: <XCircle size={16} />, kind: 'destructive' }}
            />
          ))}
        </ActionList>
      </VStack>

      <Spacer />

      <CreateInput label="New item" name="content" placeholder="What you need today?" submitLabel="Append new item" />
    </PageSection>
  );
};

export default ShoppingList;

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

    throw new Response('Something unexpected happened', { status: 500 });
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
