import type { CommentData, NewCommentData } from '../schemas/comment.js';

export interface CommentRepository {
  listByBear: (bearId: string) => Promise<CommentData[]>;

  create: (bearId: string, input: NewCommentData) => Promise<CommentData>;

  delete: (commentId: string) => Promise<boolean>;
}
