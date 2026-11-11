import { Article } from '../features/article/Article';
import { Sidebar } from '../components/Sidebar';

import type { BearState } from '../types';
import type { ReactElement } from 'react';

interface HomePageProps {
  bearState: BearState;
  searchTerm: string;
}

export function HomePage({
  bearState,
  searchTerm,
}: HomePageProps): ReactElement {
  return (
    <main>
      <Article bearState={bearState} searchTerm={searchTerm} />

      <Sidebar />
    </main>
  );
}
