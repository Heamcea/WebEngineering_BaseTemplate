import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';

import { RegisterUser, User } from '../schemas/auth.js';
import { Problem } from '../schemas/problem.js';
import { registerUser } from '../services/auth-service.js';

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/auth/register',
    {
      schema: {
        body: RegisterUser,
        response: {
          201: User,
          400: Problem,
          409: Problem,
          415: Problem,
          500: Problem,
        },
      },
    },
    async (request, reply) => {
      const user = await registerUser(
        app.repos.users,
        request.body.email,
        request.body.password
      );

      return await reply.code(201).send({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  );
};
