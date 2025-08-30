import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { cn } from '~/lib/utils';

interface FlashCard {
  id: number;
  question: string;
  answer: string;
  coverImage: string;
}

const flashcardData: FlashCard[] = [
  {
    id: 1,
    question: 'What is the highest mountain in the world?',
    answer:
      'Mount Everest, standing at 8,848.86 meters (29,031.7 feet) above sea level, located in the Himalayas on the border between Nepal and Tibet.',
    coverImage: '/mountain-sunset-vista.png',
  },
  {
    id: 2,
    question: 'Which ocean is the largest?',
    answer:
      "The Pacific Ocean is the largest ocean, covering about 46% of the world's water surface and about one-third of the total surface area of Earth.",
    coverImage: '/ocean-waves-tropical-beach.png',
  },
  {
    id: 3,
    question: "Which city is known as 'The Big Apple'?",
    answer:
      "New York City is known as 'The Big Apple'. The nickname was popularized in the 1920s by sports writer John J. Fitz Gerald.",
    coverImage: '/city-skyline-night.png',
  },
  {
    id: 4,
    question: 'What percentage of Earth is covered by forests?',
    answer:
      "Approximately 31% of Earth's land area is covered by forests, which equals about 4.06 billion hectares of forest worldwide.",
    coverImage: '/forest-path-sunlight-trees.png',
  },
  {
    id: 5,
    question: 'Which is the largest hot desert in the world?',
    answer:
      'The Sahara Desert is the largest hot desert in the world, covering approximately 9 million square kilometers across North Africa.',
    coverImage: '/desert-dunes-golden-hour.png',
  },
  {
    id: 6,
    question: 'What is the smallest country in the world?',
    answer:
      'Vatican City is the smallest country in the world, with an area of only 0.17 square miles (0.44 square kilometers), located entirely within Rome, Italy.',
    coverImage: '/ancient-architecture-columns.png',
  },
  {
    id: 7,
    question: 'Which planet is known as the Red Planet?',
    answer:
      'Mars is known as the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface.',
    coverImage: '/space-planets-cosmos.png',
  },
  {
    id: 8,
    question: 'What is the longest river in the world?',
    answer:
      'The Nile River is generally considered the longest river in the world, flowing approximately 6,650 kilometers (4,130 miles) through northeastern Africa.',
    coverImage: '/river-landscape-sunset.png',
  },
  {
    id: 9,
    question: 'Which element has the chemical symbol Au?',
    answer:
      'Gold has the chemical symbol Au, which comes from the Latin word "aurum" meaning gold.',
    coverImage: '/golden-abstract-texture.png',
  },
  {
    id: 10,
    question: 'What is the capital of Australia?',
    answer:
      'Canberra is the capital of Australia, located in the Australian Capital Territory (ACT) between Sydney and Melbourne.',
    coverImage: '/modern-city-architecture.png',
  },
];

export default function FlipableFlashcards() {
  const [totalCards] = useState(flashcardData.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [hasBeenFlipped, setHasBeenFlipped] = useState<Set<number>>(new Set());
  const [cardsStudied, setCardsStudied] = useState(0);
  const [learnedCards, setLearnedCards] = useState(0);
  const [stillLearningCards, setStillLearningCards] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [showResultsCard, setShowResultsCard] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCards = useMemo(() => {
    const remainingCards = totalCards - currentIndex;
    const cardsToShow = Math.min(5, remainingCards);
    return flashcardData.slice(currentIndex, currentIndex + cardsToShow);
  }, [currentIndex, totalCards]);

  const currentCard = useMemo(() => visibleCards[0], [visibleCards]);

  const checkAchievements = (newCardsStudied: number, newStreak: number) => {
    const newAchievements: string[] = [];

    if (newCardsStudied === 1 && !achievements.includes('First Flip')) {
      newAchievements.push('First Flip');
    }
    if (newStreak === 3 && !achievements.includes('Study Streak')) {
      newAchievements.push('Study Streak');
    }
    if (newCardsStudied === 5 && !achievements.includes('Deck Master')) {
      newAchievements.push('Deck Master');
    }
    if (
      learnedCards === totalCards &&
      !achievements.includes('Perfect Learner')
    ) {
      newAchievements.push('Perfect Learner');
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
      setShowAchievement(newAchievements[0]);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setFlippedCards(new Set());
    setHasBeenFlipped(new Set());
    setCardsStudied(0);
    setLearnedCards(0);
    setStillLearningCards(0);
    setStreak(0);
    setShowCelebration(false);
    setLevel(1);
    setXp(0);
    setShowResultsCard(false);
  };

  const handleCardFlip = (cardId: number) => {
    if (isDragging) return;

    const newFlippedCards = new Set(flippedCards);
    const wasFlipped = flippedCards.has(cardId);

    if (wasFlipped) {
      newFlippedCards.delete(cardId);
    } else {
      newFlippedCards.add(cardId);
      setHasBeenFlipped((prev) => new Set(prev).add(cardId));

      if (cardId === currentCard?.id) {
        setCardsStudied((prev) => prev + 1);
        setStreak((prev) => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) {
            setBestStreak(newStreak);
          }
          return newStreak;
        });
        setXp((prev) => prev + (5 + streak));
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 800);

        const newXp = xp + (5 + streak);
        const newLevel = Math.floor(newXp / 30) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
        }

        checkAchievements(cardsStudied + 1, streak + 1);
      }
    }

    setFlippedCards(newFlippedCards);
  };

  const handleStart = (clientX: number) => {
    if (showResultsCard || !hasBeenFlipped.has(currentCard?.id)) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || showResultsCard || !hasBeenFlipped.has(currentCard?.id))
      return;
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging || showResultsCard) return;

    const threshold = 100;
    if (Math.abs(dragOffset) > threshold && currentCard) {
      if (dragOffset > threshold) {
        setLearnedCards((prev) => prev + 1);
      } else if (dragOffset < -threshold) {
        setStillLearningCards((prev) => prev + 1);
      }

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      setFlippedCards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentCard.id);
        return newSet;
      });
      setHasBeenFlipped((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentCard.id);
        return newSet;
      });

      if (nextIndex >= totalCards) {
        setShowResultsCard(true);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // ... existing event handlers ...
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

  const getSwipeDirection = () => {
    if (Math.abs(dragOffset) < 30) return null;
    return dragOffset > 0 ? 'right' : 'left';
  };

  const swipeDirection = getSwipeDirection();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/flashcard-bg.jpg"
          alt="Abstract background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {showCelebration && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping" />
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

      {swipeDirection && hasBeenFlipped.has(currentCard?.id) && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {swipeDirection === 'right' && (
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-700/90 to-transparent flex items-center justify-center animate-in slide-in-from-right-2 fade-in duration-200">
              <div className="text-white text-center">
                <div className="text-6xl mb-2">✓</div>
                <div className="text-2xl font-bold">LEARNED</div>
              </div>
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-amber-700/90 to-transparent flex items-center justify-center animate-in slide-in-from-left-2 fade-in duration-200">
              <div className="text-white text-center">
                <div className="text-6xl mb-2">📖</div>
                <div className="text-2xl font-bold">REVIEW</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="absolute top-6 left-6 z-30 text-white">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 text-slate-700 shadow-lg border border-slate-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-sm font-semibold">Level {level}</div>
            <div className="flex-1 bg-slate-200 rounded-full h-1.5 w-20">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(xp % 30) * (100 / 30)}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">{xp}</div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-medium">{learnedCards}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="font-medium">{stillLearningCards}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-blue-600 text-xs">🔥</span>
                <span className="font-semibold">{streak}</span>
              </div>
            )}
          </div>
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
                      Study Session Complete!
                    </h2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="text-center mb-4">
                      <p className="text-xl font-bold text-white mb-3">
                        {learnedCards + stillLearningCards}/{totalCards} Cards
                        Reviewed
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-emerald-300">
                            {learnedCards}
                          </div>
                          <div className="text-xs text-emerald-400">
                            Learned
                          </div>
                        </div>
                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-amber-300">
                            {stillLearningCards}
                          </div>
                          <div className="text-xs text-amber-400">Review</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                        <p className="text-slate-400 text-xs mb-1">Mastery</p>
                        <p className="font-bold text-white text-sm">
                          {learnedCards + stillLearningCards > 0
                            ? Math.round(
                                (learnedCards /
                                  (learnedCards + stillLearningCards)) *
                                  100,
                              )
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                        <p className="text-slate-400 text-xs mb-1">Streak</p>
                        <p className="font-bold text-white text-sm">
                          {bestStreak}
                        </p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                        <p className="text-slate-400 text-xs mb-1">Level</p>
                        <p className="font-bold text-white text-sm">{level}</p>
                      </div>
                    </div>

                    {achievements.length > 0 && (
                      <div className="mt-3">
                        <p className="text-slate-400 mb-2 text-xs font-medium">
                          🏆 Achievements
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {achievements.map((achievement, index) => (
                            <span
                              key={index}
                              className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs font-medium border border-amber-500/30"
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
                      Start New Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : visibleCards.length === 0 ? (
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
            {visibleCards.map((card, index) => {
              const isActive = index === 0;
              const zIndex = 5 - index;
              const isFlipped = flippedCards.has(card.id);
              const canSwipe = hasBeenFlipped.has(card.id) && isActive;

              let transform = '';
              let opacity = 1;

              if (isActive) {
                transform = `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`;
                opacity = 1;

                if (canSwipe && swipeDirection === 'right') {
                  opacity = 0.9;
                } else if (canSwipe && swipeDirection === 'left') {
                  opacity = 0.9;
                }
              } else {
                const offset = index * 12;
                const scale = 1 - index * 0.04;
                const rotateOffset = index * 2;
                transform = `translateY(${offset}px) scale(${scale}) rotate(${rotateOffset}deg)`;
                opacity = 1 - index * 0.15;
              }

              return (
                <div
                  key={card.id}
                  className="absolute inset-0"
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    perspective: '1000px',
                  }}
                >
                  <div
                    className={cn(
                      'relative w-full h-full transition-transform duration-700 ease-out cursor-pointer',
                      isDragging && isActive ? 'transition-none' : '',
                      'preserve-3d',
                    )}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped
                        ? 'rotateY(180deg)'
                        : 'rotateY(0deg)',
                    }}
                    onClick={() => isActive && handleCardFlip(card.id)}
                  >
                    <Card
                      className={cn(
                        'absolute inset-0 border-0 shadow-2xl overflow-hidden bg-slate-800 text-white backface-hidden group',
                        streak > 2 && isActive
                          ? 'ring-1 ring-blue-400/30 shadow-blue-400/20'
                          : '',
                      )}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <CardContent className="p-0 h-full relative overflow-hidden">
                        {/*<div className="absolute inset-0 opacity-20">*/}
                        {/*  <img*/}
                        {/*    src={card.coverImage || '/placeholder.svg'}*/}
                        {/*    alt=""*/}
                        {/*    className="w-full h-full object-cover"*/}
                        {/*  />*/}
                        {/*</div>*/}
                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                          <div className="flex-1 flex items-center">
                            <h2 className="text-3xl font-serif font-bold text-balance leading-tight text-white">
                              {card.question}
                            </h2>
                          </div>

                          <div className="text-center mb-6">
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white/70 text-sm">
                                Tap to reveal answer
                              </span>
                              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">?</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-300">
                                {totalCards - currentIndex} cards left
                              </span>
                              <span className="text-xs text-slate-400">
                                Studied: {cardsStudied}
                              </span>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <div className="text-xs text-slate-400 font-medium">
                                {currentIndex + 1} / {totalCards}
                              </div>
                              <div className="w-16 bg-slate-600 rounded-full h-1">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1 rounded-full transition-all duration-300 ease-out"
                                  style={{
                                    width: `${((currentIndex + 1) / totalCards) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="absolute inset-0 border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 text-white backface-hidden group"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <CardContent className="p-0 h-full relative overflow-hidden">
                        {/*<div className="absolute inset-0 opacity-10">*/}
                        {/*  <img*/}
                        {/*    src={card.coverImage || '/placeholder.svg'}*/}
                        {/*    alt=""*/}
                        {/*    className="w-full h-full object-cover"*/}
                        {/*  />*/}
                        {/*</div>*/}
                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                          <div className="flex-1 flex items-center">
                            <div className="space-y-4">
                              <p className="text-xl font-medium text-balance leading-relaxed text-white">
                                {card.answer}
                              </p>
                            </div>
                          </div>

                          <div className="text-center mb-6">
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white/70 text-sm">
                                Tap to flip back
                              </span>
                              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">↻</span>
                              </div>
                            </div>
                          </div>

                          {isActive && (
                            <div className="text-center mb-4">
                              <div className="text-xs text-white/50 bg-white/5 rounded-full px-3 py-1 inline-block">
                                {hasBeenFlipped.has(card.id)
                                  ? 'Swipe → Learned • Swipe ← Review'
                                  : 'Flip card first to enable swiping'}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-300">
                                {totalCards - currentIndex} cards left
                              </span>
                              <span className="text-xs text-slate-400">
                                Studied: {cardsStudied}
                              </span>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <div className="text-xs text-slate-400 font-medium">
                                {currentIndex + 1} / {totalCards}
                              </div>
                              <div className="w-16 bg-slate-600 rounded-full h-1">
                                <div
                                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-1 rounded-full transition-all duration-300 ease-out"
                                  style={{
                                    width: `${((currentIndex + 1) / totalCards) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/70 z-20">
        <p className="text-sm">
          {showResultsCard
            ? 'Review your learning progress'
            : 'Tap to flip • Swipe after first flip'}
        </p>
      </div>
    </div>
  );
}
