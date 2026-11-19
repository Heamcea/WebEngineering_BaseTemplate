import { eq } from 'drizzle-orm';

import { BearSchema, type Bear } from '../schemas/bear.js';
import { fetchBearWikitext, fetchImageUrl } from '../upstream/wikipedia.js';
import { UpstreamError } from '../errors.js';

import { db } from '../db/db.js';
import { bears } from '../db/schema.js';

interface ParsedBear extends Bear {
  fileName: string | null;
}

export async function fetchBearsFromWikipedia(): Promise<Bear[]> {
  const wikitext = await fetchBearWikitext();

  const rows = wikitext.split('{{Species table/row').slice(1);

  const parsedBears = rows.map(parseBear);

  const bearsWithImages = await Promise.all(
    parsedBears.map(async (bear) => {
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

export async function getBears(): Promise<Bear[]> {
  const rows = await db.select().from(bears);

  return rows.map((row) =>
    BearSchema.parse({
      id: row.id,
      name: row.name,
      binomial: row.binomial,
      range: row.range,
      imageUrl: row.imageUrl,
    })
  );
}

export async function getBearById(id: string): Promise<Bear | undefined> {
  const [row] = await db.select().from(bears).where(eq(bears.id, id)).limit(1);

  if (row === undefined) {
    return undefined;
  }

  return BearSchema.parse({
    id: row.id,
    name: row.name,
    binomial: row.binomial,
    range: row.range,
    imageUrl: row.imageUrl,
  });
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
