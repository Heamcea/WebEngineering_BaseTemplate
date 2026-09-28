export function setupSearch() {
  const article = document.querySelector("article");
  // Search highlighter
  document.querySelector(".search").addEventListener("submit", function (e) {
    e.preventDefault();

    article.querySelectorAll(".highlight").forEach((el) => {
      // nur article highlight löschen
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });

    const searchKey = this.q.value.trim();
    if (!searchKey) return;

    const regex = new RegExp(
      "(" + searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
      "gi",
    );

    function walk(node) {
      if (node.nodeType === 3) {
        const parts = node.nodeValue.split(regex);

        if (parts.length > 1) {
          const fragment = document.createDocumentFragment();

          parts.forEach((part, index) => {
            if (index % 2 === 1) {
              const mark = document.createElement("mark");
              mark.className = "highlight";
              mark.textContent = part;

              fragment.appendChild(mark);
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
          });

          node.replaceWith(fragment);
        }
      } else if (
        node.nodeType === 1 &&
        node.tagName !== "SCRIPT" &&
        node.tagName !== "STYLE" &&
        node.tagName !== "FORM"
      ) {
        node.childNodes.forEach(walk);
      }
    }

    walk(article); // nur article nicht body suchen!
  });
}
