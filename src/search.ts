export function setupSearch(): void {
  const article = document.querySelector<HTMLElement>('article');

  if (article === null) {
    throw new Error('Article element not found');
  }

  const searchForm = document.querySelector<HTMLFormElement>('.search');

  if (searchForm === null) {
    throw new Error('Search form not found');
  }

  const searchInput =
    searchForm.querySelector<HTMLInputElement>('input[name="q"]');

  if (searchInput === null) {
    throw new Error('Search input not found');
  }

  // Search highlighter
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    article.querySelectorAll('.highlight').forEach((el) => {
      // nur article highlight löschen
      const parent = el.parentNode;
      if (parent !== null) {
        parent.replaceChild(document.createTextNode(el.textContent ?? ''), el);
        parent.normalize();
      }
    });

    const searchKey = searchInput.value.trim();
    if (searchKey === '') return;

    const regex = new RegExp(
      '(' + searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')',
      'gi'
    );

    function walk(node: Node): void {
      if (node instanceof Text) {
        const parts = node.data.split(regex);

        if (parts.length > 1) {
          const fragment = document.createDocumentFragment();

          parts.forEach((part, index) => {
            if (index % 2 === 1) {
              const mark = document.createElement('mark');
              mark.className = 'highlight';
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
        node.tagName !== 'SCRIPT' &&
        node.tagName !== 'STYLE' &&
        node.tagName !== 'FORM'
      ) {
        Array.from(node.childNodes).forEach(walk);
      }
    }

    walk(article); // nur article nicht body suchen!
  });
}
