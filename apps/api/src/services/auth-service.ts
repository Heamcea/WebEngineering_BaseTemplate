import argon2 from 'argon2';

import type {
  UserRepository,
  UserData,
} from '../repositories/user-repository.js';

import { ConflictError } from '../errors.js';

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
