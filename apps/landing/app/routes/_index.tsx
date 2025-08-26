import type { MetaFunction } from '@remix-run/cloudflare';

import { Header } from '~/components/header';
import { Hero } from '~/components/hero';

export const meta: MetaFunction = () => {
  return [
    { title: 'Aveon App' },
    { name: 'description', content: 'AI Learning Companion' },
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
