import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { BearDetailPage } from './pages/BearDetailPage';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { fetchBears } from './bears';
import type { ReactElement } from 'react';
import type { BearState } from './types';
import { getCurrentUser, logoutUser } from './auth';
import type { AuthUser } from './auth';

import { Route, Routes, useSearchParams } from 'react-router';

export function App(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('q') ?? '';

  const [bearState, setBearState] = useState<BearState>({
    status: 'loading',
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser(): Promise<void> {
      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch (error) {
        if (active) {
          setAuthError(
            error instanceof Error ? error.message : 'Failed to load user'
          );
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, []);

  function handleSearch(query: string): void {
    const newSearchParams = new URLSearchParams(searchParams);

    if (query === '') {
      newSearchParams.delete('q');
    } else {
      newSearchParams.set('q', query);
    }

    setSearchParams(newSearchParams);
  }
  async function handleLogout(): Promise<void> {
    setAuthError('');
    setLogoutLoading(true);

    try {
      await logoutUser();

      setUser(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setLogoutLoading(false);
    }
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

      <Navigation
        searchTerm={searchTerm}
        onSearch={handleSearch}
        user={user}
        authLoading={authLoading}
        logoutLoading={logoutLoading}
        onLogout={() => {
          void handleLogout();
        }}
      />
      <p>
        {authLoading
          ? 'Checking login...'
          : user === null
            ? 'Not logged in'
            : `Logged in as: ${user.email}`}
      </p>

      {authError !== '' && <p role="alert">{authError}</p>}

      <Routes>
        <Route
          path="/"
          element={<HomePage bearState={bearState} searchTerm={searchTerm} />}
        />

        <Route
          path="/bears/:bearId"
          element={
            <BearDetailPage
              bearState={bearState}
              searchTerm={searchTerm}
              user={user}
            />
          }
        />

        <Route
          path="/register"
          element={
            authLoading ? (
              <p>Checking login...</p>
            ) : (
              <RegisterPage
                onLogin={(loggedInUser) => {
                  setUser(loggedInUser);
                  setAuthError('');
                }}
              />
            )
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
