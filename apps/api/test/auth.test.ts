import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import argon2 from 'argon2';

process.env.DATABASE_URL ??=
  'postgresql://test:test@localhost:5432/test';

const { buildApp } = await import('../src/app.js');

import { MemoryBearRepository } from '../src/repositories/test/memory-bear-repository.js';
import { MemoryCommentRepository } from '../src/repositories/test/memory-comment-repository.js';
import { MemoryUserRepository } from '../src/repositories/test/memory-user-repository.js';

describe('Auth API', () => {
  let app: ReturnType<typeof buildApp>;
  let users: MemoryUserRepository;

  beforeEach(() => {
    users = new MemoryUserRepository();

    app = buildApp({
      repos: {
        bears: new MemoryBearRepository([]),
        comments: new MemoryCommentRepository(),
        users,
      },
    });
  });

  afterEach(async () => {
    await app.close();
  });

  it('registers a user and stores only the password hash', async () => {
  const email = 'alice@example.com';
  const password = 'TestPassword123';

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      email,
      password,
    },
  });

  expect(response.statusCode).toBe(201);

  const user = await users.findByEmail(email);

  expect(user).toBeDefined();

  if (!user) {
    throw new Error('User was not created');
  }

  expect(user.passwordHash).not.toBe(password);
  expect(user.passwordHash).toMatch(/^\$argon2id\$/);

  expect(
    await argon2.verify(user.passwordHash, password)
  ).toBe(true);

  expect(response.json()).toEqual({
    id: user.id,
    email,
    role: 'user',
  });
});
it('returns 409 for a duplicate email', async () => {
  const payload = {
    email: 'alice@example.com',
    password: 'TestPassword123',
  };

  const first = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload,
  });

  expect(first.statusCode).toBe(201);

  const second = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload,
  });

  expect(second.statusCode).toBe(409);
  expect(second.json()).toMatchObject({
    status: 409,
    detail: 'Email already exists',
  });
});
it('returns 400 for an invalid email', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      email: 'invalid-email',
      password: 'TestPassword123',
    },
  });

  expect(response.statusCode).toBe(400);
});
it('returns 400 for a short password', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      email: 'alice@example.com',
      password: 'abc123',
    },
  });

  expect(response.statusCode).toBe(400);

  const user = await users.findByEmail('alice@example.com');

  expect(user).toBeUndefined();
});
});