import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { z } from 'zod';

import { NotFoundError } from '../errors.js';
import { BearId } from '../schemas/bear.js';
import { Comment, NewComment } from '../schemas/comment.js';
import { getBearById } from '../services/bear-service.js';
import {
  createComment,
  deleteComment,
  getCommentsForBear,
} from '../services/comment-service.js';
import { Problem } from '../schemas/problem.js';
import { getSessionUser } from '../services/session-service.js';

export const commentRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/bears/:id/comments',
    {
      schema: {
        params: z.object({
          id: BearId,
        }),
        response: {
          200: z.array(Comment),
          400: Problem,
          404: Problem,
          502: Problem,
          504: Problem,
          500: Problem,
        },
      },
    },
    async (request) => {
      const bear = await getBearById(app.repos.bears, request.params.id);

      if (bear === undefined) {
        throw new NotFoundError('Bear not found');
      }

      return await getCommentsForBear(app.repos.comments, request.params.id);
    }
  );

  app.post(
    '/api/bears/:id/comments',
    {
      schema: {
        params: z.object({
          id: BearId,
        }),
        body: NewComment,
        response: {
          201: Comment,
          400: Problem,
          401: Problem,
          404: Problem,
          415: Problem,
          502: Problem,
          504: Problem,
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
      const bear = await getBearById(app.repos.bears, request.params.id);

      if (bear === undefined) {
        throw new NotFoundError('Bear not found');
      }

      const comment = await createComment(
        app.repos.comments,
        request.params.id,
        request.body,
        user.id
      );

      return await reply
        .code(201)
        .header('location', `/api/comments/${comment.id}`)
        .send(comment);
    }
  );

  app.delete(
    '/api/comments/:commentId',
    {
      schema: {
        params: z.object({
          commentId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          400: Problem,
          401: Problem,
          403: Problem,
          404: Problem,
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
      const deleted = await deleteComment(
        app.repos.comments,
        request.params.commentId,
        user
      );

      if (!deleted) {
        throw new NotFoundError('Comment not found');
      }

      return await reply.code(204).send(null);
    }
  );
};
