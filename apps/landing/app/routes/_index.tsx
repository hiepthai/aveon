import type { MetaFunction } from '@remix-run/cloudflare';

import { Header } from '~/components/header';
import { Hero } from '~/components/hero';

export const meta: MetaFunction = () => {
  return [
    { title: 'Aveon - Never Forget What You Learn Again | AI Learning Companion' },
    { name: 'description', content: 'Transform your PKM notes (Notion, Obsidian, Roam) into smart flashcards, quizzes, and projects. Remember 90% of what you study with AI-powered active learning. Join 847+ professionals on the waitlist.' },
    { name: 'keywords', content: 'PKM, personal knowledge management, learning, memory, flashcards, AI, spaced repetition, Notion, Obsidian, Roam, knowledge retention' },
    { property: 'og:title', content: 'Aveon - Never Forget What You Learn Again' },
    { property: 'og:description', content: 'AI transforms your notes into smart flashcards and quizzes. Remember 90% of what you study instead of 10%.' },
    { property: 'og:type', content: 'website' },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
    </div>
  );
}
