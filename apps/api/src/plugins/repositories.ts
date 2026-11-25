import fp from 'fastify-plugin';

import type { BearRepository } from '../repositories/bear-repository.js';
import type { CommentRepository } from '../repositories/comment-repository.js';
import type { UserRepository } from '../repositories/user-repository.js';
import type { SessionRepository } from '../repositories/session-repository.js';
import { DrizzleSessionRepository } from '../repositories/drizzle-session-repository.js';
import { DrizzleUserRepository } from '../repositories/drizzle-user-repository.js';
import { DrizzleBearRepository } from '../repositories/drizzle-bear-repository.js';
import { DrizzleCommentRepository } from '../repositories/drizzle-comment-repository.js';

export interface Repositories {
  bears: BearRepository;
  comments: CommentRepository;
  users: UserRepository;
  sessions: SessionRepository;
}

interface RepositoryPluginOptions {
  repos?: Repositories;
}

declare module 'fastify' {
  interface FastifyInstance {
    repos: Repositories;
  }
}

export const repositoriesPlugin = fp<RepositoryPluginOptions>(
  async (app, options) => {
    app.decorate(
      'repos',
      options.repos ?? {
        bears: new DrizzleBearRepository(),
        comments: new DrizzleCommentRepository(),
        users: new DrizzleUserRepository(),
        sessions: new DrizzleSessionRepository(),
      }
    );
  }
);
