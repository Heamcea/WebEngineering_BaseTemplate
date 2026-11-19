import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { env } from '../config/env.js';
import { DatabaseUnavailableError } from '../errors.js';

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
      version: env.APP_VERSION,
      uptime: Math.round(process.uptime()),
    })
  );
  app.get(
    '/health/ready',
    {
      schema: {
        response: {
          200: z.object({
            status: z.string(),
          }),
        },
      },
    },
    async () => {
      try {
        await pool.query('SELECT 1');
      } catch {
        throw new DatabaseUnavailableError('Database readiness check failed');
      }

      return {
        status: 'ready',
      };
    }
  );
};
