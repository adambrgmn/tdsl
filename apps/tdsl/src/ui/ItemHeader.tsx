import { format } from 'date-fns';

import { HStack, VStack } from './Stack';

export type ItemHeaderProps = {
  createdAt?: string;
  updatedAt?: string;
  children: React.ReactNode;
};

export const ItemHeader: React.FC<ItemHeaderProps> = ({ createdAt, updatedAt, children }) => {
  return (
    <VStack element="header" gap="1">
      <HStack gap="1" text="xs">
        {createdAt != null ? <p>Created: {format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</p> : null}
        {createdAt !== null && updatedAt != null ? <p>|</p> : null}
        {updatedAt != null ? <p>Updated: {format(new Date(updatedAt), 'yyyy-MM-dd HH:mm')}</p> : null}
      </HStack>

      <h1 className="text-lg font-bold">{children}</h1>
    </VStack>
  );
};
