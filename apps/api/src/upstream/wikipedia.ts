import { z } from 'zod';
import { UpstreamError, UpstreamTimeoutError } from '../errors.js';

const WikiParseResponse = z.object({
  parse: z.object({
    wikitext: z.object({
      '*': z.string(),
    }),
  }),
});

const WikiImageResponse = z.object({
  query: z.object({
    pages: z.record(
      z.string(),
      z.object({
        imageinfo: z
          .array(
            z.object({
              url: z.url(),
            })
          )
          .min(1),
      })
    ),
  }),
});

export async function fetchBearWikitext(): Promise<string> {
  const url = createWikipediaUrl();

  url.searchParams.set('action', 'parse');
  url.searchParams.set('page', 'List_of_ursids');
  url.searchParams.set('prop', 'wikitext');
  url.searchParams.set('section', '3');
  url.searchParams.set('format', 'json');

  const json = await fetchWikipediaJson(url);
  const result = WikiParseResponse.safeParse(json);

  if (!result.success) {
    throw new UpstreamError('Wikipedia returned an unexpected response');
  }

  return result.data.parse.wikitext['*'];
}

export async function fetchImageUrl(fileName: string): Promise<string> {
  const url = createWikipediaUrl();

  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', `File:${fileName}`);
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url');
  url.searchParams.set('format', 'json');

  const json = await fetchWikipediaJson(url);
  const result = WikiImageResponse.safeParse(json);

  if (!result.success) {
    throw new UpstreamError('Wikipedia returned an unexpected image response');
  }

  const imagePage = Object.values(result.data.query.pages)[0];

  if (imagePage === undefined) {
    throw new Error('Wikipedia returned no image page.');
  }

  return imagePage.imageinfo[0].url;
}

function createWikipediaUrl(): URL {
  const baseUrl = process.env.WIKIPEDIA_BASE_URL ?? 'https://en.wikipedia.org';

  return new URL('/w/api.php', baseUrl);
}

async function fetchWikipediaJson(url: URL): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        'User-Agent':
          process.env.USER_AGENT ??
          'BearApp/0.1 (https://github.com/Heamcea/WebEngineering_BaseTemplate)',
      },
      signal: AbortSignal.timeout(5000),
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new UpstreamTimeoutError('Wikipedia request timed out');
    }

    throw new UpstreamError('Wikipedia could not be reached');
  }

  if (!response.ok) {
    throw new UpstreamError(`Wikipedia returned ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    throw new UpstreamError('Wikipedia returned invalid JSON');
  }
}
