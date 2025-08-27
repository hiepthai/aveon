interface JsonResponse<Data = unknown> {
  ok: boolean;
  data?: Data;
  error?: ErrorObject;
}

interface SuccessJsonResponse<Data = unknown>
  extends Exclude<JsonResponse<Data>, 'data'> {
  data: Data;
}

declare global {
  interface Window {
    gtag: (command: string, targetId: string, parameters?: Record<string, any>) => void;
  }
}