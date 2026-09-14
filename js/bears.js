import { fetchBearWikitext, fetchImageUrl } from "./wikipedia.js";
const PLACEHOLDER_IMAGE = "./media/placeholder.jpg";

export async function setupBears() {
    const moreBears = document.querySelector(".more_bears");
    async function extractBears(wikitext) {
        try {
            const rows = wikitext.split("{{Species table/row").slice(1); // erste ist kein bär
            const bearPromises = rows.map(async (row) => {
                const bear = parseBear(row);
                const { bearElement, imageElement } = createBearElement(bear);
                moreBears.appendChild(bearElement);
                await loadBearImage(bear, imageElement);
            });
            await Promise.all(bearPromises);
        } catch (error) {
            console.error("Could not process bear data:", error);
            throw error;
        }
    }
    try {
        const wikitext = await fetchBearWikitext();
        await extractBears(wikitext);
    } catch (error) {
        console.error(error);
        const errorElement = document.createElement("p");

        errorElement.textContent =
            "Could not load bear information. Please try again later.";

        moreBears.appendChild(errorElement);
    }
}
    function parseBear(row) {
        const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
        const binomialMatch = row.match(/\|binomial=(.*?)\n/);
        const rangeMatch = row.match(/\|range=(.*?)\s+\|range-image=/);
        const imageMatch = row.match(/\|image=File:(.*?)\s+\|image-size=/);

        if (!nameMatch || !binomialMatch || !rangeMatch) {
            throw new Error("Could not parse required bear data.");
        }

        return {
            name: nameMatch[1],
            binomial: binomialMatch[1],
            range: rangeMatch[1],
            fileName: imageMatch ? imageMatch[1].trim() : null,
        };
    }
    function createBearElement(bear) {
        const bearElement = document.createElement("div");
        bearElement.className = "bear";

        const imageElement = document.createElement("img");
        imageElement.alt = "Image of " + bear.name;
        imageElement.style.width = "200px";
        imageElement.style.height = "auto";

        imageElement.addEventListener(
            "error",
            () => {
                imageElement.src = PLACEHOLDER_IMAGE;
            },
            { once: true },
        );

        const nameElement = document.createElement("p");

        const boldName = document.createElement("b");
        boldName.textContent = bear.name;

        const scientificName = document.createTextNode(
            " (" + bear.binomial + ")",
        );

        nameElement.appendChild(boldName);
        nameElement.appendChild(scientificName);

        const rangeElement = document.createElement("p");
        rangeElement.textContent = "Range: " + bear.range;

        bearElement.appendChild(imageElement);
        bearElement.appendChild(nameElement);
        bearElement.appendChild(rangeElement);

        return {
            bearElement,
            imageElement,
        };
    }
    async function loadBearImage(bear, imageElement) {
    if (!bear.fileName) {
        imageElement.src = PLACEHOLDER_IMAGE;
        return;
    }
    try {
        const imageUrl = await fetchImageUrl(bear.fileName);
        imageElement.src = imageUrl;
    } catch (error) {
        console.error("Could not fetch image URL:", error);
        imageElement.src = PLACEHOLDER_IMAGE;
    }
}