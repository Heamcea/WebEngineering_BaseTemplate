import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { registerUser, loginUser } from '../auth';
import type { AuthUser } from '../auth';
import { useNavigate } from 'react-router';

interface RegisterPageProps {
  onLogin: (user: AuthUser) => void;
}

export function RegisterPage({ onLogin }: RegisterPageProps): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent).submitter;

    const isRegister =
      submitter instanceof HTMLButtonElement && submitter.value === 'register';

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(email, password);

        setSuccess(true);
        setPassword('');
      } else {
        const user = await loginUser(email, password);

        onLogin(user);
        void navigate('/');
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Authentication failed'
      );
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
      <h2>Login / Register</h2>

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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" value="login" disabled={loading}>
            Login
          </button>

          <button type="submit" value="register" disabled={loading}>
            Register
          </button>
        </div>

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
