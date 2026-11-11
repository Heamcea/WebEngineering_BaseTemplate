import { z } from 'zod';

import { BearId } from './bear.js';

export const NewComment = z.object({
  author: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1).max(2000),
});

export const Comment = NewComment.extend({
  id: z.string().uuid(),
  bearId: BearId,
  createdAt: z.string(),
});

export type NewCommentData = z.infer<typeof NewComment>;
export type CommentData = z.infer<typeof Comment>;
