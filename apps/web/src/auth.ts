import { apiUrl } from './api';
import { getProblemDetail } from './problem';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function registerUser(
  email: string,
  password: string
): Promise<void> {
  const response = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(await getProblemDetail(response));
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await getProblemDetail(response));
  }

  return (await response.json()) as AuthUser;
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(apiUrl('/api/auth/logout'), {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(await getProblemDetail(response));
  }
}
export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(apiUrl('/api/auth/me'));

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await getProblemDetail(response));
  }

  return (await response.json()) as AuthUser;
}
