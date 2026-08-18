import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Layout from '../components/Layout';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone, branch: user.branch, gender: user.gender });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const res = await api.put('/auth/me', form);
      setUser(res.data.user);
      setSuccess('Profile updated.');
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs.join(', ') : err.response?.data?.error || 'Update failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="cp-profile">
        <h1 className="cp-profile-title">My Profile</h1>

        <div className="cp-profile-locked">
          <div><span>USN</span>{user.usn}</div>
          <div><span>Email</span>{user.email}</div>
          <div><span>Category</span>{user.category}</div>
        </div>

        <form className="cp-profile-form" onSubmit={handleSubmit}>
          {error && <div className="cp-profile-error">{error}</div>}
          {success && <div className="cp-profile-success">{success}</div>}
          <label>Full Name</label>
          <input value={form.name} onChange={update('name')} required />
          <label>Phone</label>
          <input value={form.phone} onChange={update('phone')} required minLength={10} maxLength={10} />
          <label>Branch</label>
          <input value={form.branch} onChange={update('branch')} required />
          <label>Gender</label>
          <select value={form.gender} onChange={update('gender')} required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </Layout>
  );
}