import { ShoppingListSchema } from '@tdsl/types';
import { XCircle } from 'lucide-react';
import { Fragment } from 'react';
import { ActionFunctionArgs, json, redirect, useLoaderData } from 'react-router-dom';
import * as z from 'zod';

import { shoppingLists } from '../../data/shopping-lists';
import { ActionList, ActionListItem, CreateInput, PageSection, SuspendedOutlet, VStack } from '../../ui';

export const ShoppingLists: React.FC = () => {
  let data = useLoaderData();
  let lists = ShoppingListSchema.array().parse(data);

  return (
    <Fragment>
      <PageSection element="div" level="secondary">
        <VStack gap="8" flex="fill">
          <CreateInput
            label="New shopping list"
            name="title"
            placeholder="What should it be called?"
            submitLabel="Create new shopping list"
          />

          <ActionList title="Shopping lists">
            {lists.map((list) => (
              <ActionListItem
                key={list.id}
                id={list.id}
                title={list.title}
                to={`./${list.id}`}
                right={{
                  action: 'delete',
                  label: 'Remove list',
                  icon: <XCircle size={16} />,
                  kind: 'destructive',
                }}
              />
            ))}
          </ActionList>
        </VStack>
      </PageSection>

      <SuspendedOutlet />
    </Fragment>
  );
};

export default ShoppingLists;

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
