import { beforeAll, describe, expect, test } from 'vitest';

import { MemoryUserRepository } from '../src/repositories/test/memory-user-repository.js';
import { MemoryBearRepository } from '../src/repositories/test/memory-bear-repository.js';
import { MemoryCommentRepository } from '../src/repositories//test/memory-comment-repository.js';
import { MemorySessionRepository } from '../src/repositories/test/memory-session-repository.js';
import type { Bear } from '../src/schemas/bear.js';

//dummy
process.env.DATABASE_URL =
  'postgresql://test:test@localhost:5432/test';

let buildApp: typeof import('../src/app.js').buildApp;

async function login(
  app: ReturnType<typeof buildApp>
): Promise<string> {
  const credentials = {
    email: 'test@example.com',
    password: 'TestPassword123',
  };

  const registration = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: credentials,
  });

  expect(registration.statusCode).toBe(201);

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: credentials,
  });

  expect(response.statusCode).toBe(200);

  const setCookie = response.headers['set-cookie'];

  const cookieHeader = Array.isArray(setCookie)
    ? setCookie[0]
    : setCookie;

  const cookie = cookieHeader?.split(';')[0];

  if (cookie === undefined || cookie === '') {
    throw new Error('Session cookie missing');
  }

  return cookie;
}

beforeAll(async () => {
  ({ buildApp } = await import('../src/app.js'));
});

const testBears: Bear[] = [
  {
    id: 'u-arctos',
    name: 'Brown bear',
    binomial: 'Ursus arctos',
    range: 'Europe, Asia, North America',
    imageUrl: null,
  },
];

describe('comments API', () => {
  test('creates, lists and deletes a comment', async () => {
    const app = buildApp({
      repos: {
        bears: new MemoryBearRepository(testBears),
        comments: new MemoryCommentRepository(),
        users: new MemoryUserRepository(),
        sessions: new MemorySessionRepository(),
      },
    });
    const cookie = await login(app);
      const createResponse = await app.inject({
    method: 'POST',
    url: '/api/bears/u-arctos/comments',
    headers: { cookie },
    payload: {
      author: 'Hamza',
      text: 'Testkommentar',
    },
  });

    expect(createResponse.statusCode).toBe(201);

    const created = createResponse.json();

    expect(created.author).toBe('Hamza');
    expect(created.text).toBe('Testkommentar');
    expect(created.bearId).toBe('u-arctos');

    const listResponse = await app.inject({
      method: 'GET',
      url: '/api/bears/u-arctos/comments',
    });

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json()).toHaveLength(1);

    const deleteResponse = await app.inject({
  method: 'DELETE',
  url: `/api/comments/${created.id}`,
  headers: { cookie },
});

    expect(deleteResponse.statusCode).toBe(204);

    const listAfterDelete = await app.inject({
      method: 'GET',
      url: '/api/bears/u-arctos/comments',
    });

    expect(listAfterDelete.json()).toHaveLength(0);

    await app.close();
  });

  test('returns 404 for an unknown bear', async () => {
    const app = buildApp({
      repos: {
        bears: new MemoryBearRepository(testBears),
        comments: new MemoryCommentRepository(),
        users: new MemoryUserRepository(),
        sessions: new MemorySessionRepository(),
      },
    });
const cookie = await login(app);
const response = await app.inject({
  method: 'POST',
  url: '/api/bears/not-existing/comments',
  headers: { cookie },
  payload: {
    author: 'Hamza',
    text: 'Test',
  },
});

expect(response.statusCode).toBe(404);

    await app.close();
  });
});