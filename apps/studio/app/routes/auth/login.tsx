import { createSupabaseServerClient } from '@packages/supabase/server';
import { Star } from 'lucide-react';
import type { ReactElement } from 'react';
import {
  type ActionFunction,
  Form,
  type LoaderFunction,
  type MetaFunction,
  redirect,
} from 'react-router';

import { GoogleLoginButton } from '~/components/google-login-button';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { UnprotectedRoute } from '~/lib/auth-context';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login - Aveon Studio' },
    { name: 'description', content: 'Login to Aveon Studio' },
  ];
};

function isSupportedProvider(provider: string | undefined): boolean {
  const supportedProviders = ['google', 'discord'];

  return (
    provider !== undefined &&
    provider !== null &&
    supportedProviders.indexOf(provider) !== -1
  );
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const { headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );

  return new Response('...', {
    headers,
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const provider = (formData.get('provider') as string) ?? undefined;

  if (!isSupportedProvider(provider)) {
    return null;
  }

  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as never,
    options: {
      redirectTo: 'http://localhost:5173/auth/callback',
    },
  });

  console.debug(data);

  if (data.url) {
    return redirect(data.url, { headers }); // use the redirect API for your server framework
  }

  return null;
};

function LoginPage(): ReactElement {
  const handleEmailLogin = () => {
    // TODO: Implement email login flow
    console.log('Continue with email clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm bg-white shadow-lg">
        <CardHeader className="relative pb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white fill-current" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Get started</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Welcome to Aveon Studio. Sign in to start generating amazing
              flashcards and quizzes.
            </p>
          </div>
        </CardHeader>
        <Form method="post" noValidate encType="multipart/form-data">
          <CardContent className="space-y-4 pt-0">
            <GoogleLoginButton name="provider" value="google" type="submit" />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-400">
                  or continue with email
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleEmailLogin}
                disabled={true}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue with Email (soon)
              </Button>
            </div>
          </CardContent>{' '}
        </Form>
      </Card>
    </div>
  );
}

export default function Login(): ReactElement {
  return (
    <UnprotectedRoute>
      <LoginPage />
    </UnprotectedRoute>
  );
}
