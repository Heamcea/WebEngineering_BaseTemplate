import { randomUUID } from 'node:crypto';

import {
  Comment,
  type CommentData,
  type NewCommentData,
} from '../schemas/comment.js';

const comments = new Map<string, CommentData>();

export function getCommentsForBear(bearId: string): CommentData[] {
  return Array.from(comments.values()).filter(
    (comment) => comment.bearId === bearId
  );
}

export function createComment(
  bearId: string,
  input: NewCommentData
): CommentData {
  const comment = Comment.parse({
    id: randomUUID(),
    bearId,
    author: input.author,
    text: input.text,
    createdAt: new Date().toISOString(),
  });

  comments.set(comment.id, comment);

  return comment;
}

export function deleteComment(commentId: string): boolean {
  return comments.delete(commentId);
}
