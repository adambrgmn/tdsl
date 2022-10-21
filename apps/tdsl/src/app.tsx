import { List as ShoppingListsList, Single as ShoppingListsSingle } from '@tdsl/section-shopping-lists';
import { List as TodosList, Single as TodosSingle } from '@tdsl/section-todos';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './error-page';
import { Root } from './routes/root';
import { Start } from './routes/start';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Start />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/todo',
        element: <TodosList.TodoList />,
        errorElement: <ErrorPage />,
        loader: TodosList.loader,
        action: TodosList.action,
        children: [
          {
            path: '/todo/:id',
            element: <TodosSingle.TodoSingle />,
            errorElement: <ErrorPage />,
            loader: TodosSingle.loader,
          },
        ],
      },
      {
        path: '/shopping',
        element: <ShoppingListsList.ShoppingLists />,
        errorElement: <ErrorPage />,
        loader: ShoppingListsList.loader,
        action: ShoppingListsList.action,
        children: [
          {
            path: '/shopping/:id',
            element: <ShoppingListsSingle.ShoppingList />,
            errorElement: <ErrorPage />,
            loader: ShoppingListsSingle.loader,
            action: ShoppingListsSingle.action,
          },
        ],
      },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
