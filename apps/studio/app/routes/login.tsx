import { Star, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { MetaFunction } from 'react-router';

import { AppleLoginButton } from '~/components/apple-login-button';
import { FacebookLoginButton } from '~/components/facebook-login-button';
import { GoogleLoginButton } from '~/components/google-login-button';
import { MicrosoftLoginButton } from '~/components/microsoft-login-button';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login - Aveon Studio' },
    { name: 'description', content: 'Login to Aveon Studio' },
  ];
};

export default function Login(): ReactElement {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = () => {
    // TODO: Implement email login flow
    console.log('Continue with email clicked');
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log(`Continue with ${provider} clicked`);
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

        <CardContent className="space-y-4 pt-0">
          <GoogleLoginButton onClick={() => handleSocialLogin('Google')} />

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
            {/*<AppleLoginButton onClick={() => handleSocialLogin('Apple')} />*/}
            {/*<MicrosoftLoginButton*/}
            {/*  onClick={() => handleSocialLogin('Microsoft')}*/}
            {/*/>*/}
            {/*<FacebookLoginButton*/}
            {/*  onClick={() => handleSocialLogin('Facebook')}*/}
            {/*/>*/}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
