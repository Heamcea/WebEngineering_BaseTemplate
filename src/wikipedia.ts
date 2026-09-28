const baseUrl = "https://en.wikipedia.org/w/api.php";
const wikiPageTitle = "List_of_ursids";

const bearRequestParams = {
    action: "parse",
    page: wikiPageTitle,
    prop: "wikitext",
    section: "3",
    format: "json",
    origin: "*",
};

export async function fetchImageUrl(fileName: string): Promise<string> {
    // Fetching bear data
    const imageParams = {
        action: "query",
        titles: "File:" + fileName,
        prop: "imageinfo",
        iiprop: "url",
        format: "json",
        origin: "*",
    };
    const url = baseUrl + "?" + new URLSearchParams(imageParams).toString();
    const data = await fetchJson(url);
    if (
        !isRecord(data) ||
        !isRecord(data.query) ||
        !isRecord(data.query.pages)
        ) {
        throw new Error('Invalid Wikipedia image response');
        }
    const imagePages = data.query.pages;
    const imagePage = Object.values(imagePages)[0];
    if (!isRecord(imagePage) || !Array.isArray(imagePage.imageinfo)) {
     throw new Error('Invalid Wikipedia image information');
    }
    const imageInfo = imagePage.imageinfo[0];
    if (!isRecord(imageInfo) || typeof imageInfo.url !== 'string') {
        throw new Error('Invalid Wikipedia image URL');
    }
    return imageInfo.url;
}

export async function fetchBearWikitext(): Promise<string> {
    const url = baseUrl + "?" + new URLSearchParams(bearRequestParams).toString();
    const data = await fetchJson(url);
    if (
        !isRecord(data) ||
        !isRecord(data.parse) ||
        !isRecord(data.parse.wikitext) ||
        typeof data.parse.wikitext['*'] !== 'string'
        ) {
        throw new Error('Invalid Wikipedia wikitext response');
        }
    return data.parse.wikitext["*"];
}

async function fetchJson(url: string): Promise<unknown> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Wikipedia request failed: " + response.status);
    }

    return response.json();
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}