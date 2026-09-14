const baseUrl = "https://en.wikipedia.org/w/api.php";
const wikiPageTitle = "List_of_ursids";

const bearRequestParams = {
    action: "parse",
    page: wikiPageTitle,
    prop: "wikitext",
    section: 3,
    format: "json",
    origin: "*",
};

export async function fetchImageUrl(fileName) {
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
    const imagePages = data.query.pages;
    const imagePage = Object.values(imagePages)[0];

    return imagePage.imageinfo[0].url;
}

export async function fetchBearWikitext() {
    const url = baseUrl + "?" + new URLSearchParams(bearRequestParams).toString();
    const data = await fetchJson(url);
    return data.parse.wikitext["*"];
}

async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Wikipedia request failed: " + response.status);
    }

    return response.json();
}
