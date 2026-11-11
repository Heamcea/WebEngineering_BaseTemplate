import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod';
import { z } from 'zod';

import { BearId } from '../schemas/bear.js';
import { Comment, NewComment } from '../schemas/comment.js';
import { getBearById } from '../services/bear-service.js';
import {
  createComment,
  deleteComment,
  getCommentsForBear,
} from '../services/comment-service.js';

const ErrorResponse = z.object({
  error: z.string(),
});

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
          404: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const bear = await getBearById(request.params.id);

      if (bear === undefined) {
        return await reply.code(404).send({
          error: 'Bear not found',
        });
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
          404: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const bear = await getBearById(request.params.id);

      if (bear === undefined) {
        return await reply.code(404).send({
          error: 'Bear not found',
        });
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
          404: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const deleted = deleteComment(request.params.commentId);

      if (!deleted) {
        return await reply.code(404).send({
          error: 'Comment not found',
        });
      }

      return await reply.code(204).send(null);
    }
  );
};
