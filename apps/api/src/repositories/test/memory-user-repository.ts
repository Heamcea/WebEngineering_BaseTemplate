import { randomUUID } from 'node:crypto';

import type {
  UserRepository,
  UserData,
  NewUserData,
} from '../user-repository.js';

export class MemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserData>();

  async findByEmail(email: string): Promise<UserData | undefined> {
    return this.users.get(email);
  }

  async create(input: NewUserData): Promise<UserData | undefined> {
    if (this.users.has(input.email)) {
      return undefined;
    }

    const user: UserData = {
      id: randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      role: 'user',
      createdAt: new Date(),
    };

    this.users.set(user.email, user);

    return user;
  }
}
