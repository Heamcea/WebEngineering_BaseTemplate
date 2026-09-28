export function setupSearch(): void {
  const article = document.querySelector<HTMLElement>('article');

  const searchForm =document.querySelector<HTMLFormElement>('.search');

  const searchInput = searchForm?.querySelector<HTMLInputElement>('input[name="q"]');

  if (!article || !searchForm || !searchInput) {
    throw new Error('Required search elements not found');
  }
  // Search highlighter
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    article.querySelectorAll(".highlight").forEach((el) => {
      // nur article highlight löschen
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent ?? ''), el);
        parent.normalize();
      }
    });

    const searchKey = searchInput.value.trim();
    if (!searchKey) return;

    const regex = new RegExp(
      "(" + searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
      "gi",
    );

function walk(node: Node): void {
      if (node instanceof Text) {
        const parts = node.data.split(regex);

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
        node instanceof Element &&
        node.tagName !== "SCRIPT" &&
        node.tagName !== "STYLE" &&
        node.tagName !== "FORM"
      ) {
        Array.from(node.childNodes).forEach(walk);
      }
    }

    walk(article); // nur article nicht body suchen!
  });
}
