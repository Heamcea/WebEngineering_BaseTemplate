import { randomUUID } from 'node:crypto';

import {
  Comment,
  type CommentData,
  type NewCommentData,
} from '../../schemas/comment.js';

import type { CommentRepository } from '.././comment-repository.js';

export class MemoryCommentRepository implements CommentRepository {
  private readonly comments = new Map<string, CommentData>();

  async listByBear(bearId: string): Promise<CommentData[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.bearId === bearId
    );
  }

  async create(bearId: string, input: NewCommentData): Promise<CommentData> {
    const comment = Comment.parse({
      id: randomUUID(),
      bearId,
      author: input.author,
      text: input.text,
      createdAt: new Date().toISOString(),
    });

    this.comments.set(comment.id, comment);

    return comment;
  }

  async delete(commentId: string): Promise<boolean> {
    return this.comments.delete(commentId);
  }
}
