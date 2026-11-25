import { useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { Link } from 'react-router';
import type { AuthUser } from '../auth';

interface NavigationProps {
  searchTerm: string;
  onSearch: (query: string) => void;
  user: AuthUser | null;
  authLoading: boolean;
  logoutLoading: boolean;
  onLogout: () => void;
}

export function Navigation({
  searchTerm,
  onSearch,
  user,
  authLoading,
  logoutLoading,
  onLogout,
}: NavigationProps): ReactElement {
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    onSearch(searchInput.trim());
  }

  return (
    <nav>
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Our team</a>
        </li>
        <li>
          <a href="#">Projects</a>
        </li>
        <li>
          <a href="#">Blog</a>
        </li>
        {!authLoading &&
          (user === null ? (
            <li>
              <Link to="/register">Login / Register</Link>
            </li>
          ) : (
            <>
              <button type="button" onClick={onLogout} disabled={logoutLoading}>
                {logoutLoading ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ))}
      </ul>

      <form className="search" onSubmit={handleSubmit}>
        <input
          type="search"
          name="q"
          placeholder="Search query"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
        />

        <input type="submit" value="Go!" />
      </form>
    </nav>
  );
}
