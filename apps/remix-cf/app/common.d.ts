interface JsonResponse<Data = unknown> {
  ok: boolean;
  data?: Data;
  error?: ErrorObject;
}

interface SuccessJsonResponse<Data = unknown>
  extends Exclude<JsonResponse<Data>, 'data'> {
  data: Data;
}