import { createSupabaseServerClient } from '@packages/supabase/server';
import { type LoaderFunctionArgs, redirect } from 'react-router';

import { ErrorPage } from '~/error-page';

export async function loader({
  request,
  context,
}: LoaderFunctionArgs): Promise<Response> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );

  console.info(`auth/callback CODE: ${code}, NEXT: ${next}`);

  if (!code) {
    throw new Response('Invalid code.', { status: 500 });
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error(error);
    throw new Response(
      `Unable to process your request. [code: ${error.code}]`,
      { status: 500 },
    );
  }

  return redirect(next, { headers });
}

export const ErrorBoundary = ErrorPage;
