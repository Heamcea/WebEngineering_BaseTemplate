import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { z } from 'zod';

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        response: {
          200: z.object({
            status: z.string(),
            version: z.string(),
            uptime: z.number(),
          }),
        },
      },
    },
    async () => ({
      status: 'ok',
      version: process.env.APP_VERSION ?? 'dev',
      uptime: Math.round(process.uptime()),
    })
  );
};
