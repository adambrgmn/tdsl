import { cx } from 'class-variance-authority';
import { Form, Link, To } from 'react-router-dom';

import { VStack } from './Stack';

export type ActionListProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export const ActionList: React.FC<ActionListProps> = ({ title, children }) => {
  return (
    <VStack gap="1">
      <h2 className="text-xs tracking-wider">{title}</h2>
      <VStack element="ul" gap="2" items="stretch">
        {children}
      </VStack>
    </VStack>
  );
};

type Action = {
  action: string;
  label: string;
  icon: React.ReactNode;
  kind?: 'success' | 'destructive';
};

export type ActionListItemProps = {
  id: string;
  title: string;
  action?: string;
  left?: Action;
  right?: Action;
  background?: 'dimmed' | 'regular';
  to?: To;
};

export const ActionListItem: React.FC<ActionListItemProps> = ({
  id,
  title,
  action,
  left,
  right,
  to,
  background = 'regular',
}) => {
  return (
    <li
      className={cx(
        'p-2 rounded hover:bg-gray-50 flex gap-2 items-center',
        background === 'regular' ? 'bg-white' : '',
        background === 'dimmed' ? 'bg-gray-100 text-gray-500' : '',
      )}
    >
      <Form method="post" className="contents" action={action}>
        <input type="hidden" name="id" value={id} />
        {left != null ? <ActionButton {...left} /> : null}

        {to != null ? (
          <Link to={to} className="flex-1">
            {title}
          </Link>
        ) : (
          <span className="flex-1">{title}</span>
        )}

        {right != null ? <ActionButton {...right} /> : null}
      </Form>
    </li>
  );
};

const ActionButton: React.FC<Action> = ({ action, label, icon, kind }) => {
  return (
    <button
      type="submit"
      name="action"
      value={action}
      aria-label={label}
      className={cx(
        kind === 'success' ? 'hover:text-green-500' : '',
        kind === 'destructive' ? 'hover:text-red-500' : '',
      )}
    >
      {icon}
    </button>
  );
};
