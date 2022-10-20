import { ClipboardList, ListChecks } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { Page, PageSection, VStack } from '../ui';
import { cx } from '../utils';

export const Root: React.FC = () => {
  return (
    <Page>
      <PageSection element="header" level="primary">
        <VStack gap="8" flex="fill">
          <h1 className="text-xs font-semibold tracking-wider">
            <Link to="/">TD//SL</Link>
          </h1>

          <nav>
            <VStack gap="2" element="ul">
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
            </VStack>
          </nav>
        </VStack>
      </PageSection>

      <Outlet />
    </Page>
  );
};
