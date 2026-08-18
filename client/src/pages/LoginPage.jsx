import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(identifier, password);
      if (user.role === 'WARDEN') navigate('/warden/dashboard');
      else if (user.role === 'GATE_STAFF') navigate('/scanner');
      else if (user.role === 'ADMIN') navigate('/admin/staff');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }



  return (
    <Layout>
      <div className="cp-auth-wrap">
        <form className="cp-auth-card" onSubmit={handleSubmit}>
          <h1 className="cp-auth-title">Login</h1>
          {error && <div className="cp-auth-error">{error}</div>}
          <label className="cp-auth-label">USN, Staff ID, or Email</label>
          <input className="cp-auth-input" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          <label className="cp-auth-label">Password</label>
          <input className="cp-auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="cp-auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
          <p className="cp-auth-switch">New student? <Link to="/register">Register here</Link></p>
        </form>
      </div>
    </Layout>
  );
}