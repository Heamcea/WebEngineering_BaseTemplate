import { fetchBearWikitext, fetchImageUrl } from './wikipedia';
import type { Bear } from './types';

const PLACEHOLDER_IMAGE = '/media/placeholder.jpg';

export async function setupBears(): Promise<void> {
  const moreBears = document.querySelector<HTMLElement>('.more_bears');
  if (moreBears === null) {
    throw new Error('More Bears element not found');
  }
  const bearContainer: HTMLElement = moreBears;
  async function extractBears(wikitext: string): Promise<void> {
    try {
      const rows = wikitext.split('{{Species table/row').slice(1); // erste ist kein bär
      const bearPromises = rows.map(async (row) => {
        const bear = parseBear(row);
        const { bearElement, imageElement } = createBearElement(bear);
        bearContainer.appendChild(bearElement);
        await loadBearImage(bear, imageElement);
      });
      await Promise.all(bearPromises);
    } catch (error) {
      console.error('Could not process bear data:', error);
      throw error;
    }
  }
  try {
    const wikitext = await fetchBearWikitext();
    await extractBears(wikitext);
  } catch (error) {
    console.error(error);
    const errorElement = document.createElement('p');

    errorElement.textContent =
      'Could not load bear information. Please try again later.';

    moreBears.appendChild(errorElement);
  }
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
  };
}
function createBearElement(bear: Bear): {
  bearElement: HTMLDivElement;
  imageElement: HTMLImageElement;
} {
  const bearElement = document.createElement('div');
  bearElement.className = 'bear';

  const imageElement = document.createElement('img');
  imageElement.alt = 'Image of ' + bear.name;
  imageElement.style.width = '200px';
  imageElement.style.height = 'auto';

  imageElement.addEventListener(
    'error',
    () => {
      imageElement.src = PLACEHOLDER_IMAGE;
    },
    { once: true }
  );

  const nameElement = document.createElement('p');

  const boldName = document.createElement('b');
  boldName.textContent = bear.name;

  const scientificName = document.createTextNode(' (' + bear.binomial + ')');

  nameElement.appendChild(boldName);
  nameElement.appendChild(scientificName);

  const rangeElement = document.createElement('p');
  rangeElement.textContent = 'Range: ' + bear.range;

  bearElement.appendChild(imageElement);
  bearElement.appendChild(nameElement);
  bearElement.appendChild(rangeElement);

  return {
    bearElement,
    imageElement,
  };
}
async function loadBearImage(
  bear: Bear,
  imageElement: HTMLImageElement
): Promise<void> {
  if (bear.fileName === null || bear.fileName === '') {
    imageElement.src = PLACEHOLDER_IMAGE;
    return;
  }
  try {
    const imageUrl = await fetchImageUrl(bear.fileName);
    imageElement.src = imageUrl;
  } catch (error) {
    console.error('Could not fetch image URL:', error);
    imageElement.src = PLACEHOLDER_IMAGE;
  }
}
