var baseUrl = "https://en.wikipedia.org/w/api.php";
var title = "List_of_ursids";

var params = {
    action: "parse",
    page: title,
    prop: "wikitext",
    section: 3,
    format: "json",
    origin: "*",
};

export async function fetchImageUrl(fileName) {
    // Fetching bear data
    var imageParams = {
        action: "query",
        titles: "File:" + fileName,
        prop: "imageinfo",
        iiprop: "url",
        format: "json",
        origin: "*",
    };
    var url = baseUrl + "?" + new URLSearchParams(imageParams).toString();
    var response = await fetch(url);
    if(!response.ok){
        throw new Error("Wikipedia request failed: " + response.status);
    }
    var data = await response.json();
    var pages = data.query.pages;
    var page = Object.values(pages)[0];
    
    return page.imageinfo[0].url;
}

export async function fetchBearWikitext() {
    var response = await fetch(baseUrl + "?" + new URLSearchParams(params).toString());
    if(!response.ok){
        throw new Error("Wikipedia request failed: " + response.status);
    }
    var data = await response.json();
    return data.parse.wikitext["*"];
}
