import type { ComponentProps, ReactElement, ReactNode } from 'react';

import { Button } from '~/components/ui/button';

interface SocialLoginButtonProps extends ComponentProps<'button'> {
  provider: string;
  icon: ReactNode;
  onClick?: () => void;
}

export function SocialLoginButton({
  provider,
  icon,
  onClick,
  ...props
}: SocialLoginButtonProps): ReactElement {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full justify-start border-gray-200 hover:bg-gray-50 py-3 cursor-pointer rounded-full"
      size="lg"
      {...props}
    >
      {icon}
      Continue with {provider}
    </Button>
  );
}
