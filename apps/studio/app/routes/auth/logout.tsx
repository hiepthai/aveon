import { createSupabaseServerClient } from '@packages/supabase/server';
import { type LoaderFunction, redirect } from 'react-router';

export const loader: LoaderFunction = async ({ request, context }) => {
  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
  }

  return redirect('/', { headers });
};
