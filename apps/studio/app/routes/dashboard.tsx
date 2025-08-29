import {
  ArrowUpIcon,
  ChartNoAxesCombinedIcon,
  FileCheckIcon,
  MessageCircleQuestionMarkIcon,
} from 'lucide-react';
import type { ReactElement } from 'react';
import type { MetaFunction } from 'react-router';

import { metaFunction } from '~/common/meta-function';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Textarea } from '~/components/ui/textarea';
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
      <div className="flex flex-col max-w-7xl h-[calc(100%-20px)]">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full shadow-lg"></div>
          <h3 className="text-3xl font-semibold text-gray-900 mb-2">
            Good to see you,{' '}
            {user.user_metadata?.full_name || user.email?.split('@')[0]}.
          </h3>
          <p className="text-gray-600">
            Ready to create amazing flashcards and quizzes?
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
        <Card className="shadow-none border-none bg-transparent mt-auto">
          <CardContent>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <Button
                variant="outline"
                className="h-auto p-3 text-left bg-white hover:bg-gray-50 border-none rounded-lg text-sm"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-xs mb-1 leading-tight">
                    What topics is best for giving a...
                  </div>
                  <div className="text-xs text-gray-500">
                    Get key tips from driving
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-3 text-left bg-white hover:bg-gray-50 border-none rounded-lg text-sm"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-xs mb-1 leading-tight">
                    Give 3 arguments for and against...
                  </div>
                  <div className="text-xs text-gray-500">Unity v. Unreal</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-3 text-left bg-white hover:bg-gray-50 border-none rounded-lg text-sm"
              >
                <div className="text-left">
                  <div className="font-medium text-gray-900 text-xs mb-1 leading-tight">
                    What should I pack for a 3-day tr...
                  </div>
                  <div className="text-xs text-gray-500">
                    With great weather
                  </div>
                </div>
              </Button>
            </div>
            <div className="flex bg-white items-end rounded-4xl p-3">
              <Textarea
                placeholder="Start typing..."
                className="text-base resize-none border-none shadow-none hover:ring-0 focus:ring-0 focus-visible:ring-0 min-h-8"
              />
              <Button
                size="sm"
                className="rounded-full w-10 h-10 p-0 bg-gray-600 hover:bg-gray-700"
              >
                <ArrowUpIcon className="w-5 h-5" />
              </Button>
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
