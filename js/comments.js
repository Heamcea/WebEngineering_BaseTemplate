export function setupComments() {
// Show/hide comments toggle
      var showHideBtn = document.querySelector('.show-hide');
      var commentWrapper = document.querySelector('.comment-wrapper');

      commentWrapper.style.display = 'none';

      showHideBtn.addEventListener('click', function() {
        var showHideText = showHideBtn.textContent;
        if (showHideText === 'Show comments') { 
          showHideBtn.textContent = 'Hide comments';
          commentWrapper.style.display = 'block';
        } else {
          showHideBtn.textContent = 'Show comments';
          commentWrapper.style.display = 'none';
        }
      });

      // Comment form stuff
      var form = document.querySelector('.comment-form');
      var nameField = document.querySelector('#name');
      var commentField = document.querySelector('#comment');
      var list = document.querySelector('.comment-container');

      form.addEventListener('submit', function(e) {
        e.preventDefault();
       
        var nameValue = nameField.value.trim();
        var commentValue = commentField.value.trim();

        if(!nameValue || !commentValue)
        {
          return;
        }

        var listItem = document.createElement('li');
        var namePara = document.createElement('p');
        var commentPara = document.createElement('p');

        namePara.textContent = nameValue;
        commentPara.textContent = commentValue;

        list.appendChild(listItem);
        listItem.appendChild(namePara);
        listItem.appendChild(commentPara);

        nameField.value = '';
        commentField.value = '';
      });
    }