import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './routes/root';
import { Start } from './routes/start';
import { Todo, loader as todoLoader, action as todoAction } from './routes/todo';
import { ShoppingRoot } from './routes/shopping/root';
import { ShoppingLists, loader as shoppingListsLoader, action as shoppingListsAction } from './routes/shopping/start';
import { ShoppingList, loader as shoppingListLoader, action as shoppingListAction } from './routes/shopping/id';
import { ErrorPage } from './error-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Start />,
      },
      {
        path: '/todo',
        element: <Todo />,
        loader: todoLoader,
        action: todoAction,
      },
      {
        path: '/shopping',
        element: <ShoppingRoot />,
        children: [
          {
            path: '/shopping',
            element: <ShoppingLists />,
            loader: shoppingListsLoader,
            action: shoppingListsAction,
          },
          {
            path: '/shopping/:id',
            element: <ShoppingList />,
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
