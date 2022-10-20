import { ClipboardList, ListChecks } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { cx } from '../utils';

export const Root: React.FC = () => {
  return (
    <div className="grid grid-cols-[1fr,2fr,2fr] gap-4 p-2 place-items-stretch h-screen">
      <header className="p-4 bg-gray-100 rounded-md flex flex-col gap-8">
        <h1 className="text-xs font-semibold tracking-wider">
          <Link to="/">TD//SL</Link>
        </h1>

        <nav>
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink
                to="/todo"
                className={({ isActive }) =>
                  cx('flex gap-1 items-center hover:text-blue-500', isActive && 'text-blue-500')
                }
              >
                <ListChecks size={16} /> To-dos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shopping"
                className={({ isActive }) =>
                  cx('flex gap-1 items-center hover:text-blue-500', isActive && 'text-blue-500')
                }
              >
                <ClipboardList size={16} />
                Shopping lists
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />
    </div>
  );
};
