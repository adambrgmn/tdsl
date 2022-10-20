import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { TodoList, action, loader } from './list';

jest.mock('nanoid', () => {
  let value = 0;
  return {
    nanoid: jest.fn().mockImplementation(() => {
      return String(++value);
    }),
  };
});

beforeEach(enableFetchMocks);
afterEach(disableFetchMocks);
beforeEach(() => {
  window.localStorage.clear();
});

Request.prototype.formData = async function () {
  let text = await this.text();
  return new URLSearchParams(text);
};

it('renders a list of todo items', async () => {
  const router = createMemoryRouter(
    [{ path: '/todo', element: <TodoList />, loader, action, children: [{ path: '/todo/:id', element: null }] }],
    { initialEntries: ['/todo'], initialIndex: 0 },
  );

  render(<RouterProvider router={router} />);
  expect(await screen.findByRole('heading', { name: 'To-do' })).toBeInTheDocument();

  await userEvent.type(screen.getByRole('textbox', { name: 'New to-do' }), 'Buy groceries');
  await userEvent.click(screen.getByRole('button', { name: 'Create new to-do item' }));

  await screen.findByRole('link', { name: 'Buy groceries' });

  await userEvent.click(screen.getByRole('button', { name: 'Remove item' }));
  expect(screen.queryByRole('link', { name: 'Buy groceries' })).not.toBeInTheDocument();
});
