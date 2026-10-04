import { HighlightText } from '../search/HighlightText';

import type { Bear } from '../../types';
import type { ReactElement } from 'react';

interface BearCardProps {
  bear: Bear;
  searchTerm: string;
}

export function BearCard({ bear, searchTerm }: BearCardProps): ReactElement {
  return (
    <div className="bear">
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
