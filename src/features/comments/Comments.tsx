import { useState } from 'react';

import { HighlightText } from '../search/HighlightText';

import type { FormEvent, ReactElement } from 'react';

interface Comment {
  id: string;
  name: string;
  text: string;
}

interface CommentsProps {
  searchTerm: string;
}

const initialComments: Comment[] = [
  {
    id: 'bob-fossil',
    name: 'Bob Fossil',
    text: 'Oh I am so glad you taught me all about the big brown angry guys...',
  },
];

export function Comments({ searchTerm }: CommentsProps): ReactElement {
  const [showComments, setShowComments] = useState(false);

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const [comments, setComments] = useState<Comment[]>(initialComments);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (trimmedName === '' || trimmedComment === '') {
      return;
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      name: trimmedName,
      text: trimmedComment,
    };

    setComments((currentComments) => [...currentComments, newComment]);

    setName('');
    setComment('');
  }

  return (
    <section className="comments">
      <button
        type="button"
        className="show-hide"
        onClick={() => {
          setShowComments((currentValue) => !currentValue);
        }}
      >
        {showComments ? 'Hide comments' : 'Show comments'}
      </button>

      {showComments && (
        <div className="comment-wrapper">
          <h2>
            <HighlightText text="Add comment" query={searchTerm} />
          </h2>

          <form className="comment-form" onSubmit={handleSubmit}>
            <div className="flex-pair">
              Your name:
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                required
              />
            </div>

            <div className="flex-pair">
              Your comment:
              <input
                type="text"
                name="comment"
                placeholder="Enter your comment"
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                }}
                required
              />
            </div>

            <div>
              <input type="submit" value="Submit comment" />
            </div>
          </form>

          <h2>
            <HighlightText text="Comments" query={searchTerm} />
          </h2>

          <ul className="comment-container">
            {comments.map((item) => (
              <li key={item.id}>
                <p>
                  <HighlightText text={item.name} query={searchTerm} />
                </p>

                <p>
                  <HighlightText text={item.text} query={searchTerm} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
