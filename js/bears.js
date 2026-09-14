import { fetchBearWikitext, fetchImageUrl } from "./wikipedia.js";

export function setupBears() {
    function extractBears(wikitext) {
        try {
            var bears = [];
            var rows = wikitext.split("{{Species table/row").slice(1); // erste ist kein bär
            console.log(rows);
            rows.forEach(function (row) {
                var nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
                var binomialMatch = row.match(/\|binomial=(.*?)\n/);
                var rangeMatch = row.match(/\|range=(.*?)\s+\|range-image=/);
                var imageMatch = row.match(
                    /\|image=File:(.*?)\s+\|image-size=/,
                );

                if (!nameMatch || !binomialMatch || !rangeMatch) {
                    throw new Error("Could not parse required bear data.");
                }
                var bear = {
                    name: nameMatch[1],
                    binomial: binomialMatch[1],
                    range: rangeMatch[1],
                };

                var moreBears = document.querySelector(".more_bears");
                var bearElement = document.createElement("div");
                bearElement.className = "bear";

                var imageElement = document.createElement("img");
                imageElement.alt = "Image of " + bear.name;
                imageElement.style.width = "200px";
                imageElement.style.height = "auto";
                imageElement.addEventListener(
                    "error",
                    function () {
                        imageElement.src = "./media/placeholder.jpg";
                    },
                    { once: true },
                );

                var nameElement = document.createElement("p");
                nameElement.innerHTML =
                    "<b>" + bear.name + "</b> (" + bear.binomial + ")";

                var rangeElement = document.createElement("p");
                rangeElement.textContent = "Range: " + bear.range;

                bearElement.appendChild(imageElement);
                bearElement.appendChild(nameElement);
                bearElement.appendChild(rangeElement);

                moreBears.appendChild(bearElement);

                if (imageMatch) {
                    var fileName = imageMatch[1].trim();
                    fetchImageUrl(fileName)
                        .then(function (imageUrl) {
                            imageElement.src = imageUrl;
                        })
                        .catch(function (error) {
                            console.error("Could not fetch image URL:", error);
                            imageElement.src = "./media/placeholder.jpg";
                        });
                } else {
                    imageElement.src = "./media/placeholder.jpg";
                }
            });
        } catch (error) {
            console.error("Could not process bear data:", error);
            throw error;
        }
    }
    fetchBearWikitext()
        .then(function (wikitext) {
            extractBears(wikitext);
        })
        .catch(function (error) {
            console.error(error);

            var moreBears = document.querySelector(".more_bears");
            var errorElement = document.createElement("p");

            errorElement.textContent =
                "Could not load bear information. Please try again later.";

            moreBears.appendChild(errorElement);
        });
}
