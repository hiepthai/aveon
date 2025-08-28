import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import { CookieMethodsServer } from '@supabase/ssr/src/types';

export const createSupabaseServerClient = (request: Request, env: Env) => {
  const headers = new Headers();

  const supabase = createServerClient(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      } as CookieMethodsServer,
    },
  );

  return { supabase, headers };
};
