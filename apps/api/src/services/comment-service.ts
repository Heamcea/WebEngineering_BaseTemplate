import { type CommentData, type NewCommentData } from '../schemas/comment.js';
import { ForbiddenError } from '../errors.js';
import type { UserData } from '../repositories/user-repository.js';
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
  input: NewCommentData,
  authorId: string
): Promise<CommentData> {
  return await repository.create(bearId, input, authorId);
}

function canDeleteComment(user: UserData, comment: CommentData): boolean {
  return user.id === comment.authorId || user.role === 'moderator';
}

export async function deleteComment(
  repository: CommentRepository,
  commentId: string,
  user: UserData
): Promise<boolean> {
  const comment = await repository.findById(commentId);

  if (comment === undefined) {
    return false;
  }

  if (!canDeleteComment(user, comment)) {
    throw new ForbiddenError('You cannot delete this comment');
  }

  return await repository.delete(commentId);
}
