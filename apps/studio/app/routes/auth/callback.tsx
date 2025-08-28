import { createSupabaseServerClient } from '@packages/supabase/server';
import { type LoaderFunctionArgs, redirect } from 'react-router';

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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next, { headers });
    } else {
      console.error(error);
    }
  }

  // return the user to an error page with instructions
  return redirect('/auth/error', { headers });
}
