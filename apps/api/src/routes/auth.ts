import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';

import { RegisterUser, LoginUser, User } from '../schemas/auth.js';
import { Problem } from '../schemas/problem.js';
import { registerUser, loginUser } from '../services/auth-service.js';
import {
  createSession,
  getSessionUser,
  SESSION_TTL_SECONDS,
} from '../services/session-service.js';
import { z } from 'zod';

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
  app.post(
    '/api/auth/login',
    {
      schema: {
        body: LoginUser,
        response: {
          200: User,
          400: Problem,
          401: Problem,
          415: Problem,
          500: Problem,
        },
      },
    },
    async (request, reply) => {
      const user = await loginUser(
        app.repos.users,
        request.body.email,
        request.body.password
      );

      const previousSessionId = request.cookies.sid;

      if (previousSessionId !== undefined) {
        await app.repos.sessions.delete(previousSessionId);
      }

      const session = await createSession(app.repos.sessions, user.id);

      void reply.setCookie('sid', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
      });

      return await reply.code(200).send({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  );
  app.get(
    '/api/auth/me',
    {
      schema: {
        response: {
          200: User,
          401: Problem,
          500: Problem,
        },
      },
    },
    async (request, reply) => {
      const user = await getSessionUser(
        app.repos.sessions,
        app.repos.users,
        request.cookies.sid
      );

      return await reply.code(200).send({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  );
  app.post(
    '/api/auth/logout',
    {
      schema: {
        response: {
          204: z.undefined(),
          500: Problem,
        },
      },
    },
    async (request, reply) => {
      const sessionId = request.cookies.sid;

      if (sessionId !== undefined) {
        await app.repos.sessions.delete(sessionId);
      }

      void reply.clearCookie('sid', {
        path: '/',
      });

      return await reply.code(204).send();
    }
  );
};
