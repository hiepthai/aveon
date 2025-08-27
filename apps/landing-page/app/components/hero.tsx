import { AveonLogo } from '~/components/logo';

export const Hero = () => (
  <section className="px-6 pt-20">
    <div className="mx-auto max-w-5xl text-center">
      <div className="mb-8 flex flex-col items-center justify-center">
        <AveonLogo className="max-w-48 fill-gray-600 dark:fill-gray-200 mb-12" />

        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-600 border border-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Limited Beta Access
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        Tired of forgetting everything you study?
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold text-[#4B59BC] mb-8">
        Remember 90% of what you learn (instead of 10%)
      </h2>

      <div className="text-center max-w-4xl mx-auto mb-8">
        <p className="text-lg text-gray-600 mb-4">
          Your PKM system (Notion, Obsidian, Roam) is great for storing
          knowledge, but terrible for retention.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Stop wasting hours re-reading the same material. Our AI transforms
          your existing notes into:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#4B59BC]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-[#4B59BC]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Flashcards
            </h3>
            <p className="text-gray-600 text-sm">
              Adapt to what you forget most
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#4B59BC]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-[#4B59BC]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Practice Quizzes
            </h3>
            <p className="text-gray-600 text-sm">Test real understanding</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#4B59BC]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-[#4B59BC]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mini Projects
            </h3>
            <p className="text-gray-600 text-sm">Apply what you've learned</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
