interface ErrorObject {
  code: number;
  message: string;
  details: Record<string, string>;
}

interface JsonResponse<Data = unknown> {
  ok: boolean;
  data?: Data;
  error?: ErrorObject;
}

interface SuccessJsonResponse<Data = unknown>
  extends Exclude<JsonResponse<Data>, 'data'> {
  data: Data;
}

interface Window {
  gtag: (command: string, targetId: string, parameters?: Record<string, any>) => void;
  turnstile: {
    // @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/
    render: (element: string | HTMLElement, options: {
      sitekey: string;
      callback?: (token: string) => void;
      'error-callback'?: () => void;
      'expired-callback'?: () => void;
      'timeout-callback'?: () => void;
      'after-interactive-callback'?: () => void;
      'before-interactive-callback'?: () => void;
      'unsupported-callback'?: () => void;
      theme?: 'light' | 'dark' | 'auto';
      size?: 'normal' | 'compact';
      appearance?: 'always' | 'execute' | 'interaction-only'
      tabindex?: number;
      'response-field'?: boolean;
      'response-field-name'?: string;
    }) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId: string) => void;
    getResponse: (widgetId?: string) => string;
  };
}