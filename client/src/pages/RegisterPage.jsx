import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import './Auth.css';

const initialForm = { usn: '', name: '', email: '', password: '', phone: '', branch: '', category: 'PG', gender: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? errors.join(', ') : err.response?.data?.error || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="cp-auth-wrap">
        <form className="cp-auth-card" onSubmit={handleSubmit}>
          <h1 className="cp-auth-title">Register</h1>
          {error && <div className="cp-auth-error">{error}</div>}
          <label className="cp-auth-label">USN<span style={{ color: 'red' }}>*</span></label>
          <input className="cp-auth-input" value={form.usn} onChange={update('usn')} required />
          <label className="cp-auth-label">Full Name<span style={{ color: 'red' }}>*</span></label>
          <input className="cp-auth-input" value={form.name} onChange={update('name')} required />
          <label className="cp-auth-label">Email<span style={{ color: 'red' }}>*</span></label>
          <input className="cp-auth-input" type="email" value={form.email} onChange={update('email')} required />
          <label className="cp-auth-label">Password<span style={{ color: 'red' }}>*</span></label>
          <input className="cp-auth-input" type="password" value={form.password} onChange={update('password')} required />
          <label className="cp-auth-label">Phone<span style={{ color: 'red' }}>*</span></label>
          <input className="cp-auth-input" value={form.phone} onChange={update('phone')} required minLength={10} maxLength={10} />
          <label className="cp-auth-label">Branch<span style={{ color: 'red' }}>*</span></label>
          <select className="cp-auth-input" value={form.branch} onChange={update('branch')} required>
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="ECE">Electronics and Communication Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
            <option value="Mtech(CSE)">M.Tech Computer Science and Engineering</option>
            <option value="Mtech(civil)">M.Tech Civil Engineering</option>
            <option value="Mtech(ME)">M.Tech Mechanical Engineering</option>
            <option value="MCA">Master of Computer Applications</option>
            <option value="MBA">Master of Business Administration</option>
          </select>
          <label className="cp-auth-label">Category<span style={{ color: 'red' }}>*</span></label>
          <select className="cp-auth-input" value={form.category} onChange={update('category')}>
            <option value="PG">PG</option>
            <option value="UG">UG</option>
          </select>
          <label className="cp-auth-label">Gender<span style={{ color: 'red' }}>*</span></label>
          <select className="cp-auth-input" value={form.gender} onChange={update('gender')} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button className="cp-auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register'}
          </button>
          <p className="cp-auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
        </form>
      </div>
    </Layout>
  );
}