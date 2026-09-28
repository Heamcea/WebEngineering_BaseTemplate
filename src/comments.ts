export function setupComments(): void {
  // Show/hide comments toggle
  const showHideBtn = document.querySelector<HTMLButtonElement>('.show-hide');
  const commentWrapper =
    document.querySelector<HTMLDivElement>('.comment-wrapper');

  if (showHideBtn === null || commentWrapper === null) {
    throw new Error('Comment elements not found');
  }

  commentWrapper.style.display = 'none';

  showHideBtn.addEventListener('click', () => {
    const showHideText = showHideBtn.textContent;
    if (showHideText === 'Show comments') {
      showHideBtn.textContent = 'Hide comments';
      commentWrapper.style.display = 'block';
    } else {
      showHideBtn.textContent = 'Show comments';
      commentWrapper.style.display = 'none';
    }
  });

  // Comment form stuff
  const form = document.querySelector<HTMLFormElement>('.comment-form');
  const nameField = document.querySelector<HTMLInputElement>('#name');
  const commentField = document.querySelector<HTMLInputElement>('#comment');
  const list = document.querySelector<HTMLUListElement>('.comment-container');
  if (
    form === null ||
    nameField === null ||
    commentField === null ||
    list === null
  ) {
    throw new Error('Comment form elements not found');
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameValue = nameField.value.trim();
    const commentValue = commentField.value.trim();

    if (nameValue === '' || commentValue === '') {
      return;
    }

    const listItem = document.createElement('li');
    const namePara = document.createElement('p');
    const commentPara = document.createElement('p');

    namePara.textContent = nameValue;
    commentPara.textContent = commentValue;

    list.appendChild(listItem);
    listItem.appendChild(namePara);
    listItem.appendChild(commentPara);

    nameField.value = '';
    commentField.value = '';
  });
}
