import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  RotateCcwIcon,
  XCircleIcon,
} from 'lucide-react';
import { type ReactElement, useState } from 'react';
import type { MetaFunction } from 'react-router';
import { useNavigate, useParams } from 'react-router';

import { metaFunction } from '~/common/meta-function';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import DashboardLayout from '~/layouts/dashboard-layout';
import { ProtectedRoute, useAuth } from '~/lib/auth-context';

export const meta: MetaFunction = metaFunction;

interface FlashcardData {
  id: number;
  front: string;
  back: string;
}

interface FlashcardSet {
  id: number;
  title: string;
  cards: FlashcardData[];
}

// Mock data for demonstration
const mockFlashcardSets: FlashcardSet[] = [
  {
    id: 1,
    title: 'Spanish Vocabulary',
    cards: [
      { id: 1, front: 'Hello', back: 'Hola' },
      { id: 2, front: 'Goodbye', back: 'Adiós' },
      { id: 3, front: 'Please', back: 'Por favor' },
      { id: 4, front: 'Thank you', back: 'Gracias' },
      { id: 5, front: 'Good morning', back: 'Buenos días' },
    ],
  },
  {
    id: 2,
    title: 'JavaScript Fundamentals',
    cards: [
      {
        id: 1,
        front: 'What is a variable?',
        back: 'A container for storing data values',
      },
      {
        id: 2,
        front: 'What is a function?',
        back: 'A reusable block of code that performs a specific task',
      },
      {
        id: 3,
        front: 'What is an array?',
        back: 'A data structure that stores multiple values in a single variable',
      },
      {
        id: 4,
        front: 'What is JSON?',
        back: 'JavaScript Object Notation - a lightweight data interchange format',
      },
    ],
  },
];

function FlashcardPlayContent(): ReactElement {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCards, setCorrectCards] = useState<Set<number>>(new Set());
  const [incorrectCards, setIncorrectCards] = useState<Set<number>>(new Set());

  if (!user) {
    return <div>Loading...</div>;
  }

  const flashcardSet = mockFlashcardSets.find((set) => set.id === Number(id));

  if (!flashcardSet) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Flashcard Set Not Found
          </h1>
          <Button onClick={() => navigate('/flashcards')}>
            Back to Flashcards
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentCard = flashcardSet.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcardSet.cards.length) * 100;
  const isLastCard = currentCardIndex === flashcardSet.cards.length - 1;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (isLastCard) {
      // Show completion screen or navigate back
      navigate('/flashcards');
      return;
    }
    setCurrentCardIndex(currentCardIndex + 1);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleCorrect = () => {
    setCorrectCards((prev) => new Set([...prev, currentCard.id]));
    setIncorrectCards((prev) => {
      const updated = new Set([...prev]);
      updated.delete(currentCard.id);
      return updated;
    });
    handleNext();
  };

  const handleIncorrect = () => {
    setIncorrectCards((prev) => new Set([...prev, currentCard.id]));
    setCorrectCards((prev) => {
      const updated = new Set([...prev]);
      updated.delete(currentCard.id);
      return updated;
    });
    handleNext();
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setCorrectCards(new Set());
    setIncorrectCards(new Set());
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-4xl mx-auto h-[calc(100%-20px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/flashcards')}
              className="rounded-full"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Sets
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {flashcardSet.title}
              </h1>
              <p className="text-sm text-gray-600">
                Card {currentCardIndex + 1} of {flashcardSet.cards.length}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-full"
          >
            <RotateCcwIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <Card
            className="w-full max-w-2xl h-80 cursor-pointer transition-transform duration-300 hover:scale-105 shadow-lg"
            onClick={handleFlip}
          >
            <CardContent className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="text-2xl font-medium text-gray-900 mb-4">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>
                <p className="text-sm text-gray-500">
                  {isFlipped ? 'Click to see front' : 'Click to reveal answer'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="rounded-full"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>

          {isFlipped && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={handleIncorrect}
                className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircleIcon className="w-5 h-5 mr-2" />
                Incorrect
              </Button>
              <Button
                size="lg"
                onClick={handleCorrect}
                className="rounded-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Correct
              </Button>
            </>
          )}

          {!isFlipped && (
            <Button
              size="lg"
              onClick={handleNext}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLastCard ? 'Finish' : 'Next'}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={handleNext}
            disabled={isLastCard}
            className="rounded-full"
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span>Correct: {correctCards.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircleIcon className="w-4 h-4 text-red-600" />
            <span>Incorrect: {incorrectCards.size}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function FlashcardPlay(): ReactElement {
  return (
    <ProtectedRoute>
      <FlashcardPlayContent />
    </ProtectedRoute>
  );
}
