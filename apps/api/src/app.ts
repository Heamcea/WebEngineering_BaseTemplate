import { randomUUID } from 'node:crypto';
import { bearRoutes } from './routes/bears.js';
import { commentRoutes } from './routes/comments.js';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import Fastify, { type FastifyError, type FastifyInstance } from 'fastify';
import { AppError } from './errors.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true,
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin !== '');

  void app.register(cors, {
    origin: corsOrigins,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['content-type', 'x-request-id'],
    exposedHeaders: ['location', 'x-request-id'],
    credentials: false,
    maxAge: 600,
  });
  app.get('/health', async () => ({
    status: 'ok',
    version: process.env.APP_VERSION ?? 'dev',
    uptime: Math.round(process.uptime()),
  }));
  void app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Bear API',
        version: '0.1.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  void app.register(swaggerUi, {
    routePrefix: '/api/docs',
  });

  app.addHook('onSend', async (request, reply) => {
    void reply.header('x-request-id', request.id);
  });
  void app.register(bearRoutes);
  void app.register(commentRoutes);
  app.setErrorHandler<FastifyError>(async (error, request, reply) => {
    if (error.validation !== undefined) {
      const errors = error.validation.map((validationError) => {
        const path = validationError.instancePath
          .replace(/^\//, '')
          .replaceAll('/', '.');

        return {
          path: path === '' ? 'request' : path,
          message: validationError.message ?? 'Invalid value',
        };
      });

      request.log.info({ err: error }, 'request rejected');

      return await reply
        .code(400)
        .type('application/problem+json')
        .send({
          type: 'https://bears.example/problems/validation',
          title: 'Invalid request',
          status: 400,
          detail: 'The request contains invalid data.',
          instance: `urn:uuid:${request.id}`,
          errors,
        });
    }
    if (error.statusCode === 400 || error.statusCode === 415) {
      request.log.info({ err: error }, 'request rejected');

      return await reply
        .code(error.statusCode)
        .type('application/problem+json')
        .send({
          type: 'https://bears.example/problems/request',
          title:
            error.statusCode === 400
              ? 'Invalid request'
              : 'Unsupported media type',
          status: error.statusCode,
          detail:
            error.statusCode === 400
              ? 'The request could not be parsed.'
              : 'The request uses an unsupported content type.',
          instance: `urn:uuid:${request.id}`,
        });
    }

    if (error instanceof AppError) {
      if (error.status >= 500) {
        request.log.error({ err: error }, 'request failed');
      } else {
        request.log.info({ err: error }, 'request rejected');
      }

      return await reply
        .code(error.status)
        .type('application/problem+json')
        .send({
          type: error.type,
          title: error.title,
          status: error.status,
          detail:
            error.status >= 500
              ? 'The request could not be completed.'
              : error.message,
          instance: `urn:uuid:${request.id}`,
        });
    }

    request.log.error({ err: error }, 'request failed');

    return await reply
      .code(500)
      .type('application/problem+json')
      .send({
        type: 'https://bears.example/problems/internal',
        title: 'Internal server error',
        status: 500,
        detail: 'An unexpected error occurred.',
        instance: `urn:uuid:${request.id}`,
      });
  });
  app.setNotFoundHandler(async (request, reply) => {
    return await reply
      .code(404)
      .type('application/problem+json')
      .send({
        type: 'https://bears.example/problems/not-found',
        title: 'Resource not found',
        status: 404,
        detail: 'No such route.',
        instance: `urn:uuid:${request.id}`,
      });
  });
  return app;
}
