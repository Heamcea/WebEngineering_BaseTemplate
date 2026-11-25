import { eq } from 'drizzle-orm';

import { db } from '../db/db.js';
import { users } from '../db/schema.js';

import type {
  UserRepository,
  UserData,
  NewUserData,
} from './user-repository.js';

export class DrizzleUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserData | undefined> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return row;
  }

  async create(input: NewUserData): Promise<UserData> {
    const [row] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash: input.passwordHash,
      })
      .onConflictDoNothing({ target: users.email })
      .returning();

    return row;
  }
}
