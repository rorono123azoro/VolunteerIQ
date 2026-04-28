import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { loginWithGoogle, loginWithMock } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      // App.jsx will handle redirection automatically
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithMock();
      // App.jsx will handle redirection automatically
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-left">
        <div className="landing-tagline">
          Match.<br />Coordinate.<br />Impact.
        </div>
        <p className="landing-subtitle">
          AI-powered volunteer coordination for NGOs and nonprofits.
          Intelligent matching, real-time tracking, and automated impact reporting
          — built on Google's technology stack.
        </p>
      </div>

      <div className="landing-right">
        <div className="landing-form">
          <h2>Welcome to VolunteerIQ</h2>
          <p>Sign in to start making an impact</p>

          <button
            className="google-btn"
            onClick={handleLogin}
            disabled={loading}
            id="google-signin-btn"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
          
          <button
            onClick={handleMockLogin}
            disabled={loading}
            style={{ marginTop: '10px', padding: '12px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
          >
            Dev Bypass (Test Mode)
          </button>

          {error && <p className="form-error" style={{ marginTop: '12px' }}>{error}</p>}

          <div className="landing-stats">
            <div className="landing-stat">
              <div className="stat-value">1B+</div>
              <div className="stat-label">Volunteers globally</div>
            </div>
            <div className="landing-stat">
              <div className="stat-value">40%</div>
              <div className="stat-label">Average dropout</div>
            </div>
            <div className="landing-stat">
              <div className="stat-value">0</div>
              <div className="stat-label">Data-driven platforms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
