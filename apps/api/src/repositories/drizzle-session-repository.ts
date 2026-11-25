import { eq } from 'drizzle-orm';

import { db } from '../db/db.js';
import { sessions } from '../db/schema.js';

import type { SessionData, SessionRepository } from './session-repository.js';

export class DrizzleSessionRepository implements SessionRepository {
  async create(session: SessionData): Promise<void> {
    await db.insert(sessions).values(session);
  }

  async findById(id: string): Promise<SessionData | undefined> {
    const [row] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id))
      .limit(1);

    return row;
  }

  async delete(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }
}
