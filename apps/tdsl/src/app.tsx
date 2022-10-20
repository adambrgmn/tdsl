import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './error-page';
import { Root } from './routes/root';
import { ShoppingList, action as shoppingListAction, loader as shoppingListLoader } from './routes/shopping/id';
import { ShoppingLists, action as shoppingListsAction, loader as shoppingListsLoader } from './routes/shopping/list';
import { Start } from './routes/start';
import { TodoSingle, loader as todoSingleLoader } from './routes/todo/id';
import { TodoList, action as todoListAction, loader as todoListLoader } from './routes/todo/list';

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
        element: <TodoList />,
        errorElement: <ErrorPage />,
        loader: todoListLoader,
        action: todoListAction,
        children: [
          {
            path: '/todo/:id',
            element: <TodoSingle />,
            errorElement: <ErrorPage />,
            loader: todoSingleLoader,
          },
        ],
      },
      {
        path: '/shopping',
        element: <ShoppingLists />,
        errorElement: <ErrorPage />,
        loader: shoppingListsLoader,
        action: shoppingListsAction,
        children: [
          {
            path: '/shopping/:id',
            element: <ShoppingList />,
            errorElement: <ErrorPage />,
            loader: shoppingListLoader,
            action: shoppingListAction,
          },
        ],
      },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
