import type { MetaFunction } from '@remix-run/node';
import { data } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getApi } from '../../lib/api';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

interface LoaderData {
  message?: string;
}

export async function loader() {
  const api = getApi();

  const res = await api.hello.$post({ json: { name: 'Tom' } });

  let json;

  if (res.ok) {
    json = await res.json();
  }

  return data<SuccessJsonResponse<LoaderData>>(
    { ok: true, data: { message: json?.message } },
    {},
  );
}

export default function Index() {
  const {
    data: { message },
  } = useLoaderData<SuccessJsonResponse<LoaderData>>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <h1>{message}</h1>
      </div>
    </div>
  );
}
