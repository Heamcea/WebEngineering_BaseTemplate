import { type CommentData, type NewCommentData } from '../schemas/comment.js';

import type { CommentRepository } from '../repositories/comment-repository.js';

export async function getCommentsForBear(
  repository: CommentRepository,
  bearId: string
): Promise<CommentData[]> {
  return await repository.listByBear(bearId);
}

export async function createComment(
  repository: CommentRepository,
  bearId: string,
  input: NewCommentData
): Promise<CommentData> {
  return await repository.create(bearId, input);
}

export async function deleteComment(
  repository: CommentRepository,
  commentId: string
): Promise<boolean> {
  return await repository.delete(commentId);
}
