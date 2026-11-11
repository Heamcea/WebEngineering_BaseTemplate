import { BearSchema, type Bear } from '../schemas/bear.js';
import { fetchBearWikitext, fetchImageUrl } from '../upstream/wikipedia.js';
import { UpstreamError } from '../errors.js';

interface ParsedBear extends Bear {
  fileName: string | null;
}

export async function getBears(): Promise<Bear[]> {
  const wikitext = await fetchBearWikitext();

  const rows = wikitext.split('{{Species table/row').slice(1);

  const bears = rows.map(parseBear);

  const bearsWithImages = await Promise.all(
    bears.map(async (bear) => {
      let imageUrl: string | null = null;

      if (bear.fileName !== null && bear.fileName !== '') {
        try {
          imageUrl = await fetchImageUrl(bear.fileName);
        } catch (error: unknown) {
          console.error('Could not fetch image URL:', error);
        }
      }

      const result = BearSchema.safeParse({
        id: bear.id,
        name: bear.name,
        binomial: bear.binomial,
        range: bear.range,
        imageUrl,
      });

      if (!result.success) {
        throw new UpstreamError('Wikipedia returned invalid bear data');
      }

      return result.data;
    })
  );

  return bearsWithImages;
}
export async function getBearById(id: string): Promise<Bear | undefined> {
  const bears = await getBears();

  return bears.find((bear) => bear.id === id);
}

function parseBear(row: string): ParsedBear {
  const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
  const binomialMatch = row.match(/\|binomial=(.*?)\n/);
  const rangeMatch = row.match(/\|range=(.*?)\s+\|range-image=/);
  const imageMatch = row.match(/\|image=File:(.*?)\s+\|image-size=/);

  if (nameMatch === null || binomialMatch === null || rangeMatch === null) {
    throw new UpstreamError('Wikipedia returned unparsable bear data');
  }

  const binomial = binomialMatch[1].trim();

  const id = binomial
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    id,
    name: nameMatch[1],
    binomial,
    range: rangeMatch[1],
    fileName: imageMatch?.[1]?.trim() ?? null,
    imageUrl: null,
  };
}
