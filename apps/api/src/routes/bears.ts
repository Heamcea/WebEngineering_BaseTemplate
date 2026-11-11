import type { FastifyPluginAsync } from 'fastify';

import { UpstreamError, UpstreamTimeoutError } from '../errors.js';
import { BearId } from '../schemas/bear.js';
import { getBearById, getBears } from '../services/bear-service.js';

export const bearRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/bears', async (_request, reply) => {
    try {
      return await getBears();
    } catch (error: unknown) {
      if (error instanceof UpstreamTimeoutError) {
        return await reply.code(504).send({
          error: 'Wikipedia request timed out',
        });
      }

      if (error instanceof UpstreamError) {
        return await reply.code(502).send({
          error: 'Wikipedia unavailable',
        });
      }
      throw error;
    }
  });

  app.get('/api/bears/:id', async (request, reply) => {
    try {
      const params = BearId.safeParse((request.params as { id?: unknown }).id);

      if (!params.success) {
        return await reply.code(400).send({
          error: 'Invalid bear id',
        });
      }

      const bear = await getBearById(params.data);

      if (bear === undefined) {
        return await reply.code(404).send({
          error: 'Bear not found',
        });
      }

      return bear;
    } catch (error: unknown) {
      if (error instanceof UpstreamTimeoutError) {
        return await reply.code(504).send({
          error: 'Wikipedia request timed out',
        });
      }

      if (error instanceof UpstreamError) {
        return await reply.code(502).send({
          error: 'Wikipedia unavailable',
        });
      }

      throw error;
    }
  });
};
