import { randomUUID } from 'node:crypto';
import { bearRoutes } from './routes/bears.js';
import { commentRoutes } from './routes/comments.js';
import {
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod';

import Fastify, { type FastifyInstance } from 'fastify';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true,
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.get('/health', async () => ({
    status: 'ok',
    version: process.env.APP_VERSION ?? 'dev',
    uptime: Math.round(process.uptime()),
  }));
  void app.register(bearRoutes);
  void app.register(commentRoutes);
  return app;
}
