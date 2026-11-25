import { eq } from 'drizzle-orm';

import { db } from '../db/db.js';
import { comments } from '../db/schema.js';

import {
  Comment,
  type CommentData,
  type NewCommentData,
} from '../schemas/comment.js';

import type { CommentRepository } from './comment-repository.js';

export class DrizzleCommentRepository implements CommentRepository {
  async listByBear(bearId: string): Promise<CommentData[]> {
    const rows = await db
      .select()
      .from(comments)
      .where(eq(comments.bearId, bearId));

    return rows.map((row) =>
      Comment.parse({
        id: row.id,
        bearId: row.bearId,
        author: row.author,
        text: row.text,
        authorId: row.authorId,
        createdAt: row.createdAt.toISOString(),
      })
    );
  }

  async findById(id: string): Promise<CommentData | undefined> {
    const [row] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1);

    if (row === undefined) {
      return undefined;
    }

    return Comment.parse({
      id: row.id,
      bearId: row.bearId,
      author: row.author,
      authorId: row.authorId,
      text: row.text,
      createdAt: row.createdAt.toISOString(),
    });
  }

  async create(
    bearId: string,
    input: NewCommentData,
    authorId: string
  ): Promise<CommentData> {
    const [row] = await db
      .insert(comments)
      .values({
        bearId,
        author: input.author,
        authorId,
        text: input.text,
      })
      .returning();

    return Comment.parse({
      id: row.id,
      bearId: row.bearId,
      author: row.author,
      authorId: row.authorId,
      text: row.text,
      createdAt: row.createdAt.toISOString(),
    });
  }

  async delete(commentId: string): Promise<boolean> {
    const deleted = await db
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning({
        id: comments.id,
      });

    return deleted.length > 0;
  }
}
