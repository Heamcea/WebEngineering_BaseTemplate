import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { z } from 'zod';
import { Problem } from '../schemas/problem.js';
import { NotFoundError } from '../errors.js';
import { BearId, BearSchema } from '../schemas/bear.js';
import { getBearById, getBears } from '../services/bear-service.js';

export const bearRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/bears',
    {
      schema: {
        response: {
          200: z.array(BearSchema),
          502: Problem,
          504: Problem,
          500: Problem,
        },
      },
    },
    async () => {
      return await getBears();
    }
  );

  app.get(
    '/api/bears/:id',
    {
      schema: {
        params: z.object({
          id: BearId,
        }),
        response: {
          200: BearSchema,
          400: Problem,
          404: Problem,
          502: Problem,
          504: Problem,
          500: Problem,
        },
      },
    },
    async (request) => {
      const bear = await getBearById(request.params.id);

      if (bear === undefined) {
        throw new NotFoundError('Bear not found');
      }

      return bear;
    }
  );
};
