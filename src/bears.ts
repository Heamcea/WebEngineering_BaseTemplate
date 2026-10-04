import { fetchBearWikitext, fetchImageUrl } from './wikipedia';

import type { Bear } from './types';

export async function fetchBears(signal: AbortSignal): Promise<Bear[]> {
  const wikitext = await fetchBearWikitext(signal);

  const rows = wikitext.split('{{Species table/row').slice(1);

  const bears = rows.map(parseBear);

  return await Promise.all(
    bears.map(async (bear) => {
      if (bear.fileName === null || bear.fileName === '') {
        return bear;
      }

      try {
        const imageUrl = await fetchImageUrl(bear.fileName, signal);

        return {
          ...bear,
          imageUrl,
        };
      } catch (error) {
        if (signal.aborted) {
          throw error;
        }

        console.error('Could not fetch image URL:', error);

        return bear;
      }
    })
  );
}

function parseBear(row: string): Bear {
  const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);

  const binomialMatch = row.match(/\|binomial=(.*?)\n/);

  const rangeMatch = row.match(/\|range=(.*?)\s+\|range-image=/);

  const imageMatch = row.match(/\|image=File:(.*?)\s+\|image-size=/);

  if (nameMatch === null || binomialMatch === null || rangeMatch === null) {
    throw new Error('Could not parse required bear data.');
  }

  return {
    name: nameMatch[1],
    binomial: binomialMatch[1],
    range: rangeMatch[1],
    fileName: imageMatch?.[1]?.trim() ?? null,
    imageUrl: null,
  };
}
