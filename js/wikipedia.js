    var baseUrl = "https://en.wikipedia.org/w/api.php";
    var title = "List_of_ursids";

    var params = {
        action: "parse",
        page: title,
        prop: "wikitext",
        section: 3,
        format: "json",
        origin: "*"
    };


export function fetchImageUrl(fileName) {
 // Fetching bear data 
     var imageParams = {
        action: "query",
        titles: "File:" + fileName,
        prop: "imageinfo",
        iiprop: "url",
        format: "json",
        origin: "*"
    };
    var url = baseUrl + "?" + new URLSearchParams(imageParams).toString();
        return fetch(url).then(function(res) {
            return res.json();
        }).then(function(data) {
            var pages = data.query.pages;
            var page = Object.values(pages)[0];
            return page.imageinfo[0].url;
        });
    }

export function fetchBearWikitext() {
    return fetch(baseUrl + "?" + new URLSearchParams(params).toString())
        .then(function(res) { return res.json(); })
        .then(function(data) {
        return data.parse.wikitext['*'];
        });
    }