import { Form } from 'react-router-dom';

import { HStack } from './Stack';

export type ItemActionsProps = {
  id: string;
  action?: string;
  children: React.ReactNode;
};

export const ItemActions: React.FC<ItemActionsProps> = ({ id, action, children }) => {
  return (
    <Form method="post" action={action}>
      <input type="hidden" name="id" value={id} />
      <HStack gap="2">{children}</HStack>
    </Form>
  );
};

export type ItemActionButtonProps = {
  label: string;
  action: string;
  icon: React.ReactNode;
};

export const ItemActionButton: React.FC<ItemActionButtonProps> = ({ action, label, icon }) => {
  return (
    <button
      type="submit"
      name="action"
      value={action}
      aria-label={label}
      className="flex-1 flex place-content-center place-items-center bg-gray-100 h-24 rounded-md hover:bg-gray-200"
    >
      {icon}
    </button>
  );
};
