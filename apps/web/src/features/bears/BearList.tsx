import { BearCard } from './BearCard';
import { HighlightText } from '../search/HighlightText';

import type { Bear } from '../../types';
import type { ReactElement } from 'react';

interface BearListProps {
  bears: readonly Bear[];
  searchTerm: string;
}

export function BearList({ bears, searchTerm }: BearListProps): ReactElement {
  return (
    <section className="more_bears">
      <h2>
        <HighlightText text="More Bears" query={searchTerm} />
      </h2>

      {bears.map((bear) => (
        <BearCard key={bear.binomial} bear={bear} searchTerm={searchTerm} />
      ))}
    </section>
  );
}
