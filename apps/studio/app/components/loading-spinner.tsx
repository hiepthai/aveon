import type { ReactElement } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({
  message = 'Loading...',
  size = 'md',
}: LoadingSpinnerProps): ReactElement {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}
        />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
