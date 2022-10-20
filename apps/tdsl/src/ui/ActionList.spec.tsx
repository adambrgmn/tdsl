import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { XCircle } from 'lucide-react';
import { ActionFunctionArgs, RouterProvider, createBrowserRouter, json } from 'react-router-dom';

import { ActionList, ActionListItem } from './ActionList';

beforeEach(enableFetchMocks);
afterEach(disableFetchMocks);

const items = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
  { id: '5', title: 'Item 5' },
];

it('can render a list of items', () => {
  render(
    <ActionList title="Pick up">
      {items.map((item) => (
        <ActionListItem
          key={item.id}
          id={item.id}
          title={item.title}
          // left={{ action: 'toggle', label: 'Mark as picked', icon: <Circle size={16} />, kind: 'success' }}
          // right={{ action: 'delete', label: 'Remove item', icon: <XCircle size={16} />, kind: 'destructive' }}
        />
      ))}
    </ActionList>,
  );

  let item = screen.getAllByRole('listitem');
  expect(item).toHaveLength(items.length);
});

it('can render each row as a form with submit', async () => {
  let action = jest.fn(async (_: ActionFunctionArgs) => json({ success: true }));

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ActionList title="Pick up">
          {items.map((item) => (
            <ActionListItem
              key={item.id}
              id={item.id}
              title={item.title}
              right={{ action: 'delete', label: 'Remove item', icon: <XCircle size={16} />, kind: 'destructive' }}
            />
          ))}
        </ActionList>
      ),
      action,
    },
  ]);

  render(<RouterProvider router={router} />);

  let item = screen.getAllByRole('listitem');
  expect(item).toHaveLength(items.length);

  let wrapper = within(item[0]);
  await userEvent.click(wrapper.getByRole('button', { name: 'Remove item' }));

  expect(action).toHaveBeenCalled();

  let [last] = action.mock.lastCall;
  let text = await last.request.text();
  expect(text).toMatchInlineSnapshot(`"action=delete&id=1"`);
});
