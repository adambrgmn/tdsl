import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { XCircle } from 'lucide-react';
import { ActionFunctionArgs, RouterProvider, createBrowserRouter, json } from 'react-router-dom';

import { ItemActionButton, ItemActions } from './ItemActions';

beforeEach(enableFetchMocks);
afterEach(disableFetchMocks);

it('renders buttons wrapped in a form', async () => {
  let action = jest.fn(async (_: ActionFunctionArgs) => json({ success: true }));

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ItemActions id="1">
          <ItemActionButton action="delete" label="Remove item" icon={<XCircle />} />
        </ItemActions>
      ),
      action,
    },
  ]);

  render(<RouterProvider router={router} />);

  let button = screen.getByRole('button', { name: 'Remove item' });
  await userEvent.click(button);
  expect(action).toHaveBeenCalled();

  let [last] = action.mock.lastCall;
  let text = await last.request.text();
  expect(text).toMatchInlineSnapshot(`"id=1"`);
});
