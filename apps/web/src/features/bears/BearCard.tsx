import { HighlightText } from '../search/HighlightText';
import { Link } from 'react-router';

import type { Bear } from '../../types';
import type { ReactElement } from 'react';

const PLACEHOLDER_IMAGE = '/media/placeholder.jpg';

interface BearCardProps {
  bear: Bear;
  searchTerm: string;
}

export function BearCard({ bear, searchTerm }: BearCardProps): ReactElement {
  return (
    <div className="bear">
      <img
        src={bear.imageUrl ?? PLACEHOLDER_IMAGE}
        alt={`Image of ${bear.name}`}
        width={200}
        onError={(event) => {
          event.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
      />
      <p>
        <strong>
          <Link to={`/bears/${bear.id}`}>
            <HighlightText text={bear.name} query={searchTerm} />
          </Link>
        </strong>
        (
        <HighlightText text={bear.binomial} query={searchTerm} />)
      </p>

      <p>
        <HighlightText text={`Range: ${bear.range}`} query={searchTerm} />
      </p>
    </div>
  );
}
