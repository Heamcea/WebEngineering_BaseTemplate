import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { z } from 'zod';

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
