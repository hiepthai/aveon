import type { MetaFunction } from '@remix-run/cloudflare';

import { AveonLogo } from '~/components/logo';

export const meta: MetaFunction = () => {
  return [
    { title: 'Aveon App' },
    { name: 'description', content: 'AI Learning Companion' },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <AveonLogo className="w-xs fill-gray-500 dark:fill-gray-200" />
      </div>
    </div>
  );
}
