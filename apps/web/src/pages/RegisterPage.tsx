import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { registerUser } from '../auth';

export function RegisterPage(): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await registerUser(email, password);

      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '15vh',
      }}
    >
      <h2>Register</h2>

      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '280px',
          maxWidth: '100%',
        }}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <label htmlFor="email" style={{ fontSize: '22px' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          required
          style={{
            fontSize: '20px',
          }}
        />

        <label htmlFor="password" style={{ fontSize: '22px' }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          minLength={12}
          maxLength={128}
          required
          style={{
            fontSize: '20px',
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {error !== '' && (
          <p style={{ fontSize: '22px' }} role="alert">
            {error}
          </p>
        )}

        {success && <p role="status">Registration successful!</p>}
      </form>
    </main>
  );
}
