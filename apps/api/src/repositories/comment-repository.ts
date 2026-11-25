import type { CommentData, NewCommentData } from '../schemas/comment.js';

export interface CommentRepository {
  listByBear: (bearId: string) => Promise<CommentData[]>;

  findById: (id: string) => Promise<CommentData | undefined>;

  create: (
    bearId: string,
    input: NewCommentData,
    authorId: string
  ) => Promise<CommentData>;

  delete: (commentId: string) => Promise<boolean>;
}
