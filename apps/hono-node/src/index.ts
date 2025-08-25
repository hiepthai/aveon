import { serve } from '@hono/node-server';
import { getLogger } from '@packages/common';
import { app } from '@packages/hono-core/server';

serve(
  {
    fetch: app.fetch,
    port: 3030,
  },
  (info) => {
    getLogger().info(`Server is running on http://localhost:${info.port}`);
  },
);
