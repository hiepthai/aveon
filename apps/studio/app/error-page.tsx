import type { ReactElement } from 'react';
import { isRouteErrorResponse } from 'react-router';

import type { Route } from '../.react-router/types/app/+types/root';

export function ErrorPage({ error }: Route.ErrorBoundaryProps): ReactElement {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
    stack = error.data;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-6xl font-bold">{message}</h1>
      <p className="text-xl">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 mt-4">
          <code>{stack}</code>
        </pre>
      )}
      <p className="mt-4">
        Back to <a href="/">homepage</a>
      </p>
    </main>
  );
}
