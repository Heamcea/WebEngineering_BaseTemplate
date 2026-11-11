import { useEffect, useState } from 'react';

import { HighlightText } from '../search/HighlightText';

import type { FormEvent, ReactElement } from 'react';

import { getProblemDetail } from '../../problem';

import { apiUrl } from '../../api';

interface Comment {
  id: string;
  bearId: string;
  author: string;
  text: string;
  createdAt: string;
}

interface CommentsProps {
  bearId: string;
  searchTerm: string;
}

export function Comments({ bearId, searchTerm }: CommentsProps): ReactElement {
  const [showComments, setShowComments] = useState(false);

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadComments(): Promise<void> {
      setLoading(true);
      setError(null);
      setComments([]);

      try {
        const response = await fetch(apiUrl(`/api/bears/${bearId}/comments`), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await getProblemDetail(response));
        }

        const data = (await response.json()) as Comment[];
        setComments(data);
      } catch (error: unknown) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error ? error.message : 'Could not load comments.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadComments();

    return () => {
      controller.abort();
    };
  }, [bearId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void submitComment();
  }

  async function submitComment(): Promise<void> {
    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (trimmedName === '' || trimmedComment === '') {
      return;
    }

    setError(null);

    try {
      const response = await fetch(apiUrl(`/api/bears/${bearId}/comments`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: trimmedName,
          text: trimmedComment,
        }),
      });

      if (!response.ok) {
        throw new Error(await getProblemDetail(response));
      }

      const newComment = (await response.json()) as Comment;

      setComments((currentComments) => [...currentComments, newComment]);

      setName('');
      setComment('');
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Could not create comment.'
      );
    }
  }

  async function handleDelete(commentId: string): Promise<void> {
    setError(null);

    try {
      const response = await fetch(apiUrl(`/api/comments/${commentId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await getProblemDetail(response));
      }

      setComments((currentComments) =>
        currentComments.filter((item) => item.id !== commentId)
      );
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Could not delete comment.'
      );
    }
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

          {error !== null && <p>{error}</p>}

          <h2>
            <HighlightText text="Comments" query={searchTerm} />
          </h2>

          {loading ? (
            <p>Loading comments...</p>
          ) : (
            <ul className="comment-container">
              {comments.map((item) => (
                <li key={item.id}>
                  <p>
                    <HighlightText text={item.author} query={searchTerm} />
                  </p>

                  <p>
                    <HighlightText text={item.text} query={searchTerm} />
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      void handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
