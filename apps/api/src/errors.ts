const PROBLEM_BASE = 'https://bears.example/problems';

export abstract class AppError extends Error {
  abstract readonly status: number;
  abstract readonly type: string;
  abstract readonly title: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  readonly status = 404;
  readonly type = `${PROBLEM_BASE}/not-found`;
  readonly title = 'Resource not found';
}

export class UpstreamError extends AppError {
  readonly status = 502;
  readonly type = `${PROBLEM_BASE}/upstream`;
  readonly title = 'Upstream unavailable';
}

export class UpstreamTimeoutError extends AppError {
  readonly status = 504;
  readonly type = `${PROBLEM_BASE}/upstream-timeout`;
  readonly title = 'Upstream timeout';
}
