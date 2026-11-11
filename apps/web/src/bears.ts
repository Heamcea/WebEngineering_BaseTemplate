import type { Bear } from './types';

export async function fetchBears(signal?: AbortSignal): Promise<Bear[]> {
  const response = await fetch('/api/bears', {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Could not load bears: ${response.status}`);
  }

  return (await response.json()) as Bear[];
}
