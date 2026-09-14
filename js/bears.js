 import {
    fetchBearWikitext,
    fetchImageUrl
} from './wikipedia.js';

 export function setupBears() {

      function extractBears(wikitext) {
       var bears = [];
        var rows = wikitext.split('{{Species table/row').slice(1); // erste ist kein bär
        console.log(rows);
          rows.forEach(function(row) {
            var nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
            var binomialMatch = row.match(/\|binomial=(.*?)\n/);
            var rangeMatch = row.match(/\|range=(.*?)\s+\|range-image=/);
            var imageMatch = row.match(/\|image=File:(.*?)\s+\|image-size=/);

            if (nameMatch && binomialMatch && rangeMatch) {
                var bear = {
                  name: nameMatch[1],
                  binomial: binomialMatch[1],
                  range: rangeMatch[1]
                };

                    var moreBears = document.querySelector('.more_bears');
                    var bearElement = document.createElement('div');
                    bearElement.className = 'bear';

                    var imageElement = document.createElement('img');
                    imageElement.alt = 'Image of ' + bear.name;
                    imageElement.style.width = '200px';
                    imageElement.style.height = 'auto';

                    var nameElement = document.createElement('p');
                    nameElement.innerHTML =
                        '<b>' + bear.name + '</b> (' + bear.binomial + ')';

                    var rangeElement = document.createElement('p');
                    rangeElement.textContent = 'Range: ' + bear.range;

                    bearElement.appendChild(imageElement);
                    bearElement.appendChild(nameElement);
                    bearElement.appendChild(rangeElement);

                    moreBears.appendChild(bearElement);

                    if (imageMatch) {
                     var fileName = imageMatch[1].trim();
                     console.log(fileName)
                     fetchImageUrl(fileName).then(function(imageUrl) {
                        console.log(imageUrl)
                        imageElement.src = imageUrl;
                     });
                    }
              };
          });
      }
    fetchBearWikitext().then(function(wikitext) {
        extractBears(wikitext);
    });
}