import { AveonLogo } from '~/components/logo';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export const Hero = () => (
  <section className="px-6 py-20">
    <div className="mx-auto max-w-7xl text-center">
      <div className="mb-6 flex flex-col items-center justify-center">
        <AveonLogo className="max-w-72 fill-gray-600 dark:fill-gray-200 mb-16" />

        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#4B59BC]/10 text-[#4B59BC]">
          <span className="w-2 h-2 bg-[#4B59BC] rounded-full mr-2"></span>
          Stop Forgetting What You Learn
        </span>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Transform your passive PKM system into
        <br />
        <span className="text-[#4B59BC]">active training tools</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
        By transforming notes into interactive learning formats such as
        flashcards, quizzes, case studies, and small projects, Aveon aims to
        enhance knowledge retention and skill proficiency.
      </p>
      <div className="mx-auto max-w-4xl text-center">
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="flex-1"
          />
          <Button className="px-8 py-2 whitespace-nowrap">Join Waitlist</Button>
        </div>
        <p className="text-sm mt-4 text-gray-500">
          Be the first to experience the future of active PKM system.
        </p>
      </div>

      {/* Hero Illustration */}
      <div className="mt-16"></div>
    </div>
  </section>
);
