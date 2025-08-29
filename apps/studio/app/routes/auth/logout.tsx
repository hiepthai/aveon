import { createSupabaseServerClient } from '@packages/supabase/server';
import { type ActionFunction, redirect } from 'react-router';

export const action: ActionFunction = async ({ request, context }) => {
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
