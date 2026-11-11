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
    async (request, reply) => {
      const bear = await getBearById(request.params.id);

      if (bear === undefined) {
        throw new NotFoundError('Bear not found');
      }

      return getCommentsForBear(request.params.id);
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
          404: Problem,
          415: Problem,
          502: Problem,
          504: Problem,
          500: Problem,
        },
      },
    },
    async (request, reply) => {
      const bear = await getBearById(request.params.id);

      if (bear === undefined) {
        throw new NotFoundError('Bear not found');
      }

      const comment = createComment(request.params.id, request.body);

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
          404: Problem,
          500: Problem,
        },
      },
    },
    async (request, reply) => {
      const deleted = deleteComment(request.params.commentId);

      if (!deleted) {
        throw new NotFoundError('Comment not found');
      }

      return await reply.code(204).send(null);
    }
  );
};
