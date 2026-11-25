import type { SessionData, SessionRepository } from '../session-repository.js';

export class MemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, SessionData>();

  async create(session: SessionData): Promise<void> {
    if (this.sessions.has(session.id)) {
      throw new Error('Session already exists');
    }

    this.sessions.set(session.id, session);
  }

  async findById(id: string): Promise<SessionData | undefined> {
    return this.sessions.get(id);
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }
}
