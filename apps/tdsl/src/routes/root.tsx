import { Outlet, Link } from 'react-router-dom';

export const Root: React.FC = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/todo">Todo</Link>
        </li>
        <li>
          <Link to="/shopping">Shopping lists</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};
