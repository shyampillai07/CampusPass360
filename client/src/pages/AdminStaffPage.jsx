import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './AdminStaffPage.css';

const initialForm = { role: 'WARDEN', staffId: '', name: '', email: '', phone: '', password: '' };

export default function AdminStaffPage() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function load() {
    const res = await api.get('/admin/staff');
    setStaff(res.data.staff);
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      await api.post('/admin/staff', form);
      setSuccess(`${form.role} account created.`);
      setForm(initialForm);
      await load();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs.join(', ') : err.response?.data?.error || 'Failed to create account.');
    } finally { setSubmitting(false); }
  }

  return (
    <Layout>
      <div className="cp-admin">
        <h1 className="cp-admin-title">Manage Staff Accounts</h1>

        <form className="cp-admin-form" onSubmit={handleSubmit}>
          <h2>Create Warden or Gate Staff account</h2>
          {error && <div className="cp-admin-error">{error}</div>}
          {success && <div className="cp-admin-success">{success}</div>}

          <label>Role</label>
          <select value={form.role} onChange={update('role')}>
            <option value="WARDEN">Warden</option>
            <option value="GATE_STAFF">Gate Staff</option>
          </select>
          <label>Staff ID</label>
          <input value={form.staffId} onChange={update('staffId')} required placeholder="e.g. W002" />
          <label>Full Name</label>
          <input value={form.name} onChange={update('name')} required />
          <label>Email</label>
          <input type="email" value={form.email} onChange={update('email')} required />
          <label>Phone</label>
          <input value={form.phone} onChange={update('phone')} required minLength={10} maxLength={10} />
          <label>Temporary Password</label>
          <input type="password" value={form.password} onChange={update('password')} required />

          <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Account'}</button>
        </form>

        <h2 className="cp-admin-list-title">Existing staff ({staff.length})</h2>
        <table className="cp-admin-table">
          <thead><tr><th>Staff ID</th><th>Name</th><th>Role</th><th>Email</th></tr></thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.staffId}><td>{s.staffId}</td><td>{s.name}</td><td>{s.role}</td><td>{s.email}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}