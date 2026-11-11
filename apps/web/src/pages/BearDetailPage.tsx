import { Link, useParams } from 'react-router';
import { HighlightText } from '../features/search/HighlightText';
import type { BearState } from '../types';
import type { ReactElement } from 'react';

const PLACEHOLDER_IMAGE = '/media/placeholder.jpg';

interface BearDetailPageProps {
  bearState: BearState;
  searchTerm: string;
}

export function BearDetailPage({
  bearState,
  searchTerm,
}: BearDetailPageProps): ReactElement {
  const { bearId } = useParams<{ bearId: string }>();

  if (bearState.status === 'loading') {
    return (
      <main>
        <p>Loading bear...</p>
      </main>
    );
  }

  if (bearState.status === 'error') {
    return (
      <main>
        <p>{bearState.message}</p>
      </main>
    );
  }

  if (bearState.status === 'empty') {
    return (
      <main>
        <p>No bears found.</p>
      </main>
    );
  }

  const bear = bearState.bears.find((item) => item.id === bearId);

  if (bear === undefined) {
    return (
      <main>
        <h1>Bear not found</h1>

        <Link to="/">Back to bear list</Link>
      </main>
    );
  }

  return (
    <main>
      <article>
        <Link to="/">← Back to bear list</Link>

        <h1>
          <HighlightText text={bear.name} query={searchTerm} />
        </h1>

        <img
          src={bear.imageUrl ?? PLACEHOLDER_IMAGE}
          alt={`Image of ${bear.name}`}
          width={300}
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />

        <p>
          <strong>
            <HighlightText text="Scientific name:" query={searchTerm} />
          </strong>{' '}
          <HighlightText text={bear.binomial} query={searchTerm} />
        </p>

        <p>
          <strong>
            <HighlightText text="Range:" query={searchTerm} />
          </strong>{' '}
          <HighlightText text={bear.range} query={searchTerm} />
        </p>
      </article>
    </main>
  );
}
