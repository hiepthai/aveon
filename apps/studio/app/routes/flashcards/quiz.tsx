import { useEffect, useRef, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { cn } from '~/lib/utils';

interface QuizCard {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  coverImage: string;
}

const quizData: QuizCard[] = [
  {
    id: 1,
    question: 'What is the highest mountain in the world?',
    options: ['K2', 'Mount Everest', 'Kangchenjunga', 'Lhotse'],
    correctAnswer: 1,
    coverImage: '/mountain-sunset-vista.png',
  },
  {
    id: 2,
    question: 'Which ocean is the largest?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 3,
    coverImage: '/ocean-waves-tropical-beach.png',
  },
  {
    id: 3,
    question: "Which city is known as 'The Big Apple'?",
    options: ['Los Angeles', 'Chicago', 'New York', 'Miami'],
    correctAnswer: 2,
    coverImage: '/city-skyline-night.png',
  },
  {
    id: 4,
    question: 'What percentage of Earth is covered by forests?',
    options: ['20%', '31%', '45%', '52%'],
    correctAnswer: 1,
    coverImage: '/forest-path-sunlight-trees.png',
  },
  {
    id: 5,
    question: 'Which is the largest hot desert in the world?',
    options: ['Gobi', 'Kalahari', 'Sahara', 'Arabian'],
    correctAnswer: 2,
    coverImage: '/desert-dunes-golden-hour.png',
  },
];

export default function SwipeableCards() {
  const [cards, setCards] = useState(quizData);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [showResultsCard, setShowResultsCard] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkAchievements = (
    newScore: number,
    newStreak: number,
    newTotalAnswered: number,
  ) => {
    const newAchievements: string[] = [];

    if (newScore === 1 && !achievements.includes('First Blood')) {
      newAchievements.push('First Blood');
    }
    if (newStreak === 3 && !achievements.includes('Triple Threat')) {
      newAchievements.push('Triple Threat');
    }
    if (
      newScore === 5 &&
      newTotalAnswered === 5 &&
      !achievements.includes('Perfect Score')
    ) {
      newAchievements.push('Perfect Score');
    }
    if (newTotalAnswered === 5 && !achievements.includes('Quiz Master')) {
      newAchievements.push('Quiz Master');
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
      setShowAchievement(newAchievements[0]);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const resetCards = () => {
    setCards(quizData);
    setIsDragging(false);
    setDragOffset(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTotalAnswered(0);
    setStreak(0);
    setShowCelebration(false);
    setLevel(1);
    setXp(0);
    setShowResultsCard(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setTotalAnswered((prev) => prev + 1);

    const isCorrect = answerIndex === cards[0].correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
      setXp((prev) => prev + (10 + streak * 2));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);

      const newXp = xp + (10 + streak * 2);
      const newLevel = Math.floor(newXp / 50) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }

      checkAchievements(score + 1, streak + 1, totalAnswered + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      const newCards = cards.slice(1);
      setCards(newCards);
      if (newCards.length === 0) {
        setShowResultsCard(true);
      }
      setSelectedAnswer(null);
      setShowResult(false);
    }, 1500);
  };

  const handleStart = (clientX: number) => {
    if (showResultsCard) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || showResultsCard) return;
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging || showResultsCard) return;

    const threshold = 100;
    if (Math.abs(dragOffset) > threshold && cards.length > 0) {
      if (selectedAnswer === null) {
        const newCards = cards.slice(1);
        setCards(newCards);
        setTotalAnswered((prev) => prev + 1);
        setStreak(0);
        if (newCards.length === 0) {
          setShowResultsCard(true);
        }
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/flashcard-bg-2.jpg"
          alt="Abstract background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {showCelebration && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full animate-ping" />
          </div>
        </div>
      )}

      {showAchievement && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ease-out animate-in slide-in-from-top-4 fade-in">
          <div className="bg-white/95 backdrop-blur-sm text-slate-800 px-6 py-4 rounded-lg shadow-xl border border-slate-200 transform transition-all duration-300 ease-out hover:scale-105">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center transition-transform duration-200 ease-out">
                <span className="text-white text-sm font-bold">★</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-700">
                  Achievement Unlocked
                </div>
                <div className="text-xs text-slate-500">{showAchievement}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-6 left-6 z-30 text-white">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 space-y-3 text-slate-700 shadow-lg border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="text-sm font-medium">Level {level}</div>
            <div className="flex-1 bg-slate-200 rounded-full h-2 w-24">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(xp % 50) * 2}%` }}
              />
            </div>
            <div className="text-xs text-slate-500">{xp} XP</div>
          </div>
          {streak > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔥</span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {streak} streak
              </span>
            </div>
          )}
          {bestStreak > 0 && (
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <span>Best streak:</span>
              <span className="font-medium text-slate-600">{bestStreak}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={resetCards}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          Reset
        </Button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {showResultsCard ? (
          <div
            className="relative w-full max-w-sm select-none"
            style={{ aspectRatio: '9/16', maxHeight: '80vh' }}
          >
            <Card className="absolute inset-0 border-0 shadow-2xl overflow-hidden bg-slate-800 text-white">
              <CardContent className="p-0 h-full relative overflow-hidden">
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div className="flex-1 flex items-center">
                    <h2 className="text-3xl font-serif font-bold text-balance leading-tight text-white">
                      Quiz Complete!
                    </h2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="text-center mb-6">
                      <p className="text-2xl font-bold text-white mb-2">
                        Final Score: {score}/{totalAnswered}
                      </p>
                      <p className="text-lg text-slate-300">
                        {Math.round((score / totalAnswered) * 100)}% Accuracy
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-slate-300 text-xs mb-1">
                          Level Reached
                        </p>
                        <p className="font-bold text-white text-lg">{level}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-slate-300 text-xs mb-1">
                          Best Streak
                        </p>
                        <p className="font-bold text-white text-lg">
                          {bestStreak}
                        </p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-slate-300 text-xs mb-1">Total XP</p>
                        <p className="font-bold text-white text-lg">{xp}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-slate-300 text-xs mb-1">
                          Achievements
                        </p>
                        <p className="font-bold text-white text-lg">
                          {achievements.length}
                        </p>
                      </div>
                    </div>

                    {achievements.length > 0 && (
                      <div className="mt-4">
                        <p className="text-slate-300 mb-3 text-sm font-medium">
                          🏆 Achievements Earned
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {achievements.map((achievement, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-200 px-3 py-1 rounded-full text-xs font-medium border border-amber-500/30"
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={resetCards}
                      className="bg-slate-600 hover:bg-slate-500 text-white w-full"
                    >
                      Start New Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center text-white">
            <p>Loading results...</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative w-full max-w-sm cursor-grab active:cursor-grabbing select-none"
            style={{ aspectRatio: '9/16', maxHeight: '80vh' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {cards.slice(0, 5).map((card, index) => {
              const isActive = index === 0;
              const zIndex = 5 - index;

              let transform = '';
              let opacity = 1;

              if (isActive) {
                transform = `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`;
                opacity = 1;
              } else {
                const offset = index * 12;
                const scale = 1 - index * 0.04;
                const rotateOffset = index * 2;
                transform = `translateY(${offset}px) scale(${scale}) rotate(${rotateOffset}deg)`;
                opacity = 1 - index * 0.15;
              }

              return (
                <Card
                  key={card.id}
                  className={cn(
                    'absolute inset-0 transition-all duration-300 ease-out border-0 shadow-2xl overflow-hidden bg-slate-800 text-white',
                    isDragging && isActive ? 'transition-none' : '',
                    streak > 2 && isActive
                      ? 'ring-1 ring-orange-400/30 shadow-orange-400/20'
                      : '',
                  )}
                  style={{
                    transform,
                    zIndex,
                    opacity,
                  }}
                >
                  <CardContent className="p-0 h-full relative overflow-hidden">
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                      <div className="flex-1 flex items-center">
                        <h2 className="text-3xl font-serif font-bold text-balance leading-tight text-white">
                          {card.question}
                        </h2>
                      </div>

                      <div className="space-y-3 mb-6">
                        {card.options.map((option, optionIndex) => {
                          let optionClass =
                            'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-600/50 transition-colors cursor-pointer rounded-lg';

                          if (isActive && showResult) {
                            if (optionIndex === card.correctAnswer) {
                              optionClass =
                                'bg-emerald-700/80 border border-emerald-600/80 rounded-lg';
                            } else if (
                              optionIndex === selectedAnswer &&
                              optionIndex !== card.correctAnswer
                            ) {
                              optionClass =
                                'bg-red-800/80 border border-red-700/80 rounded-lg';
                            } else {
                              optionClass =
                                'bg-slate-700/30 border border-slate-600/30 opacity-50 rounded-lg';
                            }
                          } else if (
                            isActive &&
                            selectedAnswer === optionIndex
                          ) {
                            optionClass =
                              'bg-blue-800/80 border border-blue-700/80 rounded-lg';
                          }

                          return (
                            <div
                              key={optionIndex}
                              className={optionClass}
                              onClick={() =>
                                isActive && handleAnswerSelect(optionIndex)
                              }
                            >
                              <div className="flex items-center space-x-3 px-4 py-3">
                                <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-xs font-medium text-white">
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <span className="text-white text-sm">
                                  {option}
                                </span>
                                {isActive && showResult && (
                                  <div className="ml-auto">
                                    {optionIndex === card.correctAnswer && (
                                      <span className="text-emerald-200 text-xs">
                                        ✓
                                      </span>
                                    )}
                                    {optionIndex === selectedAnswer &&
                                      optionIndex !== card.correctAnswer && (
                                        <span className="text-red-200 text-xs">
                                          ✗
                                        </span>
                                      )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-300">
                            {cards.length} questions left
                          </span>
                          {totalAnswered > 0 && (
                            <span className="text-xs text-slate-400">
                              Score: {score}/{totalAnswered}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <div className="text-xs text-slate-400 font-medium">
                            {quizData.length - cards.length + 1} /{' '}
                            {quizData.length}
                          </div>
                          <div className="w-16 bg-slate-600 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1 rounded-full transition-all duration-300 ease-out"
                              style={{
                                width: `${((quizData.length - cards.length) / quizData.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/70 z-20">
        <p className="text-sm">
          {showResultsCard
            ? 'Review your quiz results'
            : selectedAnswer === null
              ? 'Tap an answer to select'
              : 'Swipe left or right to skip'}
        </p>
      </div>
    </div>
  );
}
