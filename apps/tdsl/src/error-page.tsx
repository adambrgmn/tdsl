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

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
};

function hasStatusText(error: unknown): error is { statusText: string } {
  return typeof error === 'object' && error != null && 'statusText' in error;
}

function isError(error: unknown): error is Error {
  return error != null && error instanceof Error;
}
