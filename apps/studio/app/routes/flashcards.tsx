import {
  BookOpenIcon,
  ClockIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PlusIcon,
  StarIcon,
} from 'lucide-react';
import type { ReactElement } from 'react';
import type { MetaFunction } from 'react-router';

import { metaFunction } from '~/common/meta-function';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import DashboardLayout from '~/layouts/dashboard-layout';
import { ProtectedRoute, useAuth } from '~/lib/auth-context';

export const meta: MetaFunction = metaFunction;

function FlashcardsContent(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data for flashcard sets
  const flashcardSets = [
    {
      id: 1,
      title: 'Spanish Vocabulary',
      description: 'Essential Spanish words and phrases for beginners',
      cardCount: 25,
      lastStudied: '2 days ago',
      progress: 75,
      starred: true,
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      description: 'Core JavaScript concepts and syntax',
      cardCount: 40,
      lastStudied: '1 week ago',
      progress: 60,
      starred: false,
    },
    {
      id: 3,
      title: 'History Facts',
      description: 'Important historical events and dates',
      cardCount: 30,
      lastStudied: '3 days ago',
      progress: 90,
      starred: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-7xl h-[calc(100%-20px)]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Your Flashcards
            </h1>
            <p className="text-gray-600">
              Manage your flashcard collections and track your learning progress
            </p>
          </div>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New Set
          </Button>
        </div>

        {flashcardSets.length === 0 ? (
          <Card className="shadow-none border-none bg-transparent">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No flashcards yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first flashcard set to start learning
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Set
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardSets.map((set) => (
              <Card
                key={set.id}
                className="shadow-none hover:scale-105 transition-transform border-none cursor-pointer bg-white"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 p-2 text-blue-600 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpenIcon />
                      </div>
                      <div>
                        <h4 className="text-gray-900 text-xl font-semibold">
                          {set.title}
                        </h4>
                        {set.starred && (
                          <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500 mt-1" />
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {set.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">
                        {set.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${set.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="w-3 h-3" />
                      <span>{set.cardCount} cards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{set.lastStudied}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                      asChild
                    >
                      <a href={`/flashcards/${set.id}/play`}> Study Now</a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function Flashcards(): ReactElement {
  return (
    <ProtectedRoute>
      <FlashcardsContent />
    </ProtectedRoute>
  );
}
