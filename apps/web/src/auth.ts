import { apiUrl } from './api';
import { getProblemDetail } from './problem';

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
