import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { ActionFunctionArgs, RouterProvider, createBrowserRouter, json } from 'react-router-dom';

import { CreateInput } from './CreateInput';

beforeEach(enableFetchMocks);
afterEach(disableFetchMocks);

it('renders a Form wrapped input element', async () => {
  let action = jest.fn(async (_: ActionFunctionArgs) => json({ success: true }));

  const router = createBrowserRouter([
    {
      path: '/',
      element: <CreateInput label="New to-do" name="content" submitLabel="Create to-do" />,
      action,
    },
  ]);

  render(<RouterProvider router={router} />);

  let input = screen.getByRole('textbox', { name: 'New to-do' });
  let button = screen.getByRole('button', { name: 'Create to-do' });

  await userEvent.type(input, 'Buy groceries');
  expect(input).toHaveValue('Buy groceries');

  await userEvent.click(button);
  expect(action).toHaveBeenCalled();

  let [last] = action.mock.lastCall;
  let text = await last.request.text();
  expect(text).toMatchInlineSnapshot(`"action=create&content=Buy+groceries"`);
});
