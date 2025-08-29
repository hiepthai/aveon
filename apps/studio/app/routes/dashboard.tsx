import {
  ChartNoAxesCombinedIcon,
  FileCheckIcon,
  MessageCircleQuestionMarkIcon,
} from 'lucide-react';
import type { ReactElement } from 'react';
import type { MetaFunction } from 'react-router';

import { metaFunction } from '~/common/meta-function';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import DashboardLayout from '~/layouts/dashboard-layout';
import { ProtectedRoute, useAuth } from '~/lib/auth-context';

export const meta: MetaFunction = metaFunction;

function DashboardContent(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{' '}
            {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-600">
            Ready to create amazing flashcards and quizzes? Let's get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-none hover:scale-105 transition-transform border-none cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="space-y-4">
                <div className="w-10 h-10 p-2 text-blue-900 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FileCheckIcon />
                </div>
                <h4 className="text-gray-900 text-2xl">Create Flashcards</h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Generate interactive flashcards for better learning and
                retention.
              </p>
              <Button size="lg" className="w-full rounded-full">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-none hover:scale-105 transition-transform border-none cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="space-y-4">
                <div className="w-10 h-10 p-2 text-green-900 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <MessageCircleQuestionMarkIcon />
                </div>
                <h4 className="text-gray-900 text-2xl">Build Quizzes</h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Create engaging quizzes to test knowledge and understanding.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full"
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-none hover:scale-105 transition-transform border-none cursor-pointer">
            <CardHeader className="pb-4">
              <CardTitle className="space-y-4">
                <div className="w-10 h-10 p-2 text-purple-900 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <ChartNoAxesCombinedIcon />
                </div>
                <h4 className="text-gray-900 text-2xl">Track Progress</h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Monitor learning progress and performance analytics.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full"
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Email</span>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Account Created
                </span>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Last Sign In
                </span>
                <p className="text-gray-900">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Authentication Provider
                </span>
                <p className="text-gray-900 capitalize">
                  {user.app_metadata?.provider || 'Email'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard(): ReactElement {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
