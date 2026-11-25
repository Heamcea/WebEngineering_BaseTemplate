export interface SessionData {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface SessionRepository {
  create: (session: SessionData) => Promise<void>;
  findById: (id: string) => Promise<SessionData | undefined>;
  delete: (id: string) => Promise<void>;
}
