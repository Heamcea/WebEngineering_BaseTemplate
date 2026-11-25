import argon2 from 'argon2';

import type {
  UserRepository,
  UserData,
} from '../repositories/user-repository.js';

import { ConflictError, UnauthorizedError } from '../errors.js';

const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$9Qb3znsQxlykTBsIHLe3JA$JDPLjzBXKHySzGlv34M3ZZQqK3AxZK0omNKluzHJRu0';

export async function registerUser(
  repository: UserRepository,
  email: string,
  password: string
): Promise<UserData> {
  const existingUser = await repository.findByEmail(email);

  if (existingUser !== undefined) {
    throw new ConflictError('Email already exists');
  }
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const user = await repository.create({
    email,
    passwordHash,
  });

  if (user === undefined) {
    throw new ConflictError('Email already exists');
  }

  return user;
}

export async function loginUser(
  repository: UserRepository,
  email: string,
  password: string
): Promise<UserData> {
  const user = await repository.findByEmail(email);

  const validPassword = await argon2.verify(
    user?.passwordHash ?? DUMMY_HASH,
    password
  );

  if (user === undefined || !validPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  return user;
}
