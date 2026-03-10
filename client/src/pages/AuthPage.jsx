import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../graphql/mutations';

const AuthPage = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isLogin = mode === 'login';

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Player',
  });
  const [error, setError] = useState('');

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  const loading = loginLoading || registerLoading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (isLogin) {
        const { data } = await loginMutation({
          variables: { email: form.email, password: form.password },
        });
        if (data?.login) {
          login(data.login.user);
          navigate(data.login.user.role === 'Admin' ? '/admin' : '/player');
        }
      } else {
        const { data } = await registerMutation({
          variables: {
            username: form.username,
            email: form.email,
            password: form.password,
            role: form.role,
          },
        });
        if (data?.register) {
          login(data.register.user);
          navigate(data.register.user.role === 'Admin' ? '/admin' : '/player');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <main className="auth-page" aria-label={isLogin ? 'Login page' : 'Register page'}>
      <div className="auth-container">
        <div className="auth-logo" aria-hidden="true">⬡</div>
        <h1 className="auth-title">
          {isLogin ? 'ENTER THE ARENA' : 'JOIN THE ARENA'}
        </h1>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back, warrior.' : 'Create your warrior profile.'}
        </p>

        {error && (
          <div className="auth-error" role="alert" aria-live="polite">
            <span aria-hidden="true">⚠ </span>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username" className="form-label">USERNAME</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                value={form.username}
                onChange={handleChange}
                placeholder="Your warrior name"
                required
                autoComplete="username"
                aria-required="true"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">EMAIL</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">PASSWORD</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-required="true"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">CONFIRM PASSWORD</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                  aria-required="true"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">ROLE</label>
                <select
                  id="role"
                  name="role"
                  className="form-input form-select"
                  value={form.role}
                  onChange={handleChange}
                  aria-label="Select your role"
                >
                  <option value="Player">Player</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn-auth"
            disabled={loading}
            aria-label={isLogin ? 'Log in' : 'Create account'}
          >
            {loading ? (
              <span className="loading-dots" aria-label="Loading">
                <span /><span /><span />
              </span>
            ) : (
              isLogin ? 'LOGIN' : 'REGISTER'
            )}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? (
            <>Don't have an account?{' '}
              <Link to="/register" className="auth-link">Register here</Link>
            </>
          ) : (
            <>Already a warrior?{' '}
              <Link to="/login" className="auth-link">Login here</Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
};

export default AuthPage;
