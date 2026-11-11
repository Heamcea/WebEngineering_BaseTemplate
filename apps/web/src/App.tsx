import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { BearDetailPage } from './pages/BearDetailPage';
import { HomePage } from './pages/HomePage';
import { fetchBears } from './bears';
import type { ReactElement } from 'react';
import type { BearState } from './types';

import { Route, Routes, useSearchParams } from 'react-router';

export function App(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('q') ?? '';

  const [bearState, setBearState] = useState<BearState>({
    status: 'loading',
  });
  function handleSearch(query: string): void {
    const newSearchParams = new URLSearchParams(searchParams);

    if (query === '') {
      newSearchParams.delete('q');
    } else {
      newSearchParams.set('q', query);
    }

    setSearchParams(newSearchParams);
  }
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
          message:
            error instanceof Error
              ? error.message
              : 'Could not load bear information.',
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

      <Navigation searchTerm={searchTerm} onSearch={handleSearch} />

      <Routes>
        <Route
          path="/"
          element={<HomePage bearState={bearState} searchTerm={searchTerm} />}
        />

        <Route
          path="/bears/:bearId"
          element={
            <BearDetailPage bearState={bearState} searchTerm={searchTerm} />
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
