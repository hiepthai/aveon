import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { AveonLogo } from '~/components/logo';

export const Hero = () => (
  <section className="px-6 py-20">
    <div className="mx-auto max-w-7xl text-center">
      <div className="mb-6 flex flex-col items-center justify-center">
        <AveonLogo className="h-[96px] fill-gray-600 dark:fill-gray-200 mb-16" />

        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#4B59BC]/10 text-[#4B59BC]">
          <span className="w-2 h-2 bg-[#4B59BC] rounded-full mr-2"></span>
          BUILDING AUTONOMOUS AGENTS MADE EASY
        </span>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Enhancing AI Agents with
        <br />
        <span className="text-[#4B59BC]">TCP/IP Protocols</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Build autonomous agents that can communicate, collaborate, and execute
        complex tasks across distributed networks with seamless TCP/IP
        integration.
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
          Be the first to experience the future of AI agent communication.
        </p>
      </div>

      {/* Hero Illustration */}
      <div className="mt-16"></div>
    </div>
  </section>
);
