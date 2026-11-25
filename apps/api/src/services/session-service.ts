import { randomBytes } from 'node:crypto';
import { UnauthorizedError } from '../errors.js';

import type {
  UserData,
  UserRepository,
} from '../repositories/user-repository.js';

import type {
  SessionData,
  SessionRepository,
} from '../repositories/session-repository.js';

export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export async function createSession(
  repository: SessionRepository,
  userId: string
): Promise<SessionData> {
  const session: SessionData = {
    id: randomBytes(32).toString('hex'), // 256 Bit Entropie -) nicht vorhersehbar
    userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000),
  };

  await repository.create(session);

  return session;
}

export async function getSessionUser(
  sessionRepository: SessionRepository,
  userRepository: UserRepository,
  sessionId: string | undefined
): Promise<UserData> {
  if (sessionId === undefined) {
    throw new UnauthorizedError('Not authenticated');
  }

  const session = await sessionRepository.findById(sessionId);

  if (session === undefined || session.expiresAt.getTime() <= Date.now()) {
    throw new UnauthorizedError('Invalid or expired session');
  }

  const user = await userRepository.findById(session.userId);

  if (user === undefined) {
    throw new UnauthorizedError('Not authenticated');
  }

  return user;
}
