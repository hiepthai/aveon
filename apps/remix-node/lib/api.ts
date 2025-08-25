import apiClientFactory from '@packages/hono-core/client';

const getApi = () => {
  // fetch always needs hostname.
  const input = 'http://localhost:3030';
  const fetchOptions: Parameters<typeof apiClientFactory>[1] = {};

  return apiClientFactory(input, fetchOptions);
};

export { getApi };
