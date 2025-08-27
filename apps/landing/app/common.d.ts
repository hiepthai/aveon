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
}