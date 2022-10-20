import { Loader } from 'lucide-react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { PageSection } from './Page';
import { VStack } from './Stack';

export const SuspendedOutlet: React.FC = () => {
  let fallback = (
    <PageSection element="div" level="neutral">
      <VStack place="center" flex="fill">
        <Loader size={48} className="animate-spin" />
      </VStack>
    </PageSection>
  );

  return (
    <Suspense fallback={fallback}>
      <Outlet />
    </Suspense>
  );
};
