import { Button } from '~/components/ui/button';

export const Header = () => (
  <header className="border-b border-gray-100 px-6 py-4">
    <div className="mx-auto max-w-7xl flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">
            hi@aveon.app
          </a>
          <a href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900">Login</button>
        <Button className="bg-[#4B59BC] hover:bg-[#3d4a9f] text-white px-6">
          Get Started
        </Button>
      </div>
    </div>
  </header>
);
