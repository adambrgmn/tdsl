import { PageSection, VStack } from '@tdsl/ui';
import { ServerCrash } from 'lucide-react';
import { useRouteError } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  let message: string;

  if (hasStatusText(error)) {
    message = error.statusText;
  } else if (isError(error)) {
    message = error.message;
  } else {
    message = 'Not really sure what happened';
  }

  if (hasStatus(error)) {
    switch (error.status) {
      case 404:
        message = 'The item you wanted could not be found.';
        break;
      default:
        message = 'Something went wrong while fetching you data.';
        break;
    }
  }

  return (
    <PageSection element="section" level="danger">
      <VStack gap="8" place="center" flex="fill">
        <ServerCrash size={48} />
        <VStack gap="1" place="center">
          <h1 className="text-xl font-bold">Oops, something went wrong!</h1>
          <p>
            <i>{message}</i>
          </p>
        </VStack>
      </VStack>
    </PageSection>
  );
};

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error != null && 'status' in error;
}

function hasStatusText(error: unknown): error is { statusText: string } {
  return typeof error === 'object' && error != null && 'statusText' in error;
}

function isError(error: unknown): error is Error {
  return error != null && error instanceof Error;
}
