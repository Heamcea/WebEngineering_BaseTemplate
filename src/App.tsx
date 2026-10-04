import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { Article } from './features/article/Article';
import { fetchBears } from './bears';
import type { ReactElement } from 'react';
import type { BearState } from './types';

export function App(): ReactElement {
  const [searchTerm, setSearchTerm] = useState('');

  const [bearState, setBearState] = useState<BearState>({
    status: 'loading',
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadBears(): Promise<void> {
      try {
        setBearState({
          status: 'loading',
        });

        const bears = await fetchBears(controller.signal);

        if (bears.length === 0) {
          setBearState({
            status: 'empty',
          });
          return;
        }

        setBearState({
          status: 'success',
          bears,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Could not load bears:', error);

        setBearState({
          status: 'error',
          message: 'Could not load bear information. Please try again later.',
        });
      }
    }

    void loadBears();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <Header />

      <Navigation onSearch={setSearchTerm} />

      <main>
        <Article bearState={bearState} searchTerm={searchTerm} />

        <Sidebar />
      </main>

      <Footer />
    </>
  );
}
