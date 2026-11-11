import type { Bear } from './types';
import { getProblemDetail } from './problem';

export async function fetchBears(signal?: AbortSignal): Promise<Bear[]> {
  const response = await fetch('/api/bears', {
    signal,
  });

  if (!response.ok) {
    throw new Error(await getProblemDetail(response));
  }

  return (await response.json()) as Bear[];
}
