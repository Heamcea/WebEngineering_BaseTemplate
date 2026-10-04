import { useState } from 'react';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { Article } from './features/article/Article';

import type { Bear } from './types';
import type { ReactElement } from 'react';

const previewBears: Bear[] = [
  {
    name: 'Brown bear',
    binomial: 'Ursus arctos',
    range: 'Europe, Asia and North America',
    fileName: null,
  },
  {
    name: 'Polar bear',
    binomial: 'Ursus maritimus',
    range: 'Arctic',
    fileName: null,
  },
];

export function App(): ReactElement {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Header />

      <Navigation onSearch={setSearchTerm} />

      <main>
        <Article bears={previewBears} searchTerm={searchTerm} />

        <Sidebar />
      </main>

      <Footer />
    </>
  );
}
