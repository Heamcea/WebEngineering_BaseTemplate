import type { Bear } from './types';
import { getProblemDetail } from './problem';
import { apiUrl } from './api';

export async function fetchBears(signal?: AbortSignal): Promise<Bear[]> {
  const response = await fetch(apiUrl('/api/bears'), {
    signal,
  });

  if (!response.ok) {
    throw new Error(await getProblemDetail(response));
  }

  return (await response.json()) as Bear[];
}
