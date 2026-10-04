import { HighlightText } from '../search/HighlightText';

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
          <HighlightText text={bear.name} query={searchTerm} />
        </strong>{' '}
        (
        <HighlightText text={bear.binomial} query={searchTerm} />)
      </p>

      <p>
        <HighlightText text={`Range: ${bear.range}`} query={searchTerm} />
      </p>
    </div>
  );
}
