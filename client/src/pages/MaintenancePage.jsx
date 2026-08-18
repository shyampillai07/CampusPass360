import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './MaintenancePage.css';

export default function MaintenancePage() {
  const [tickets, setTickets] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const res = await api.get('/maintenance/tickets/me');
    setTickets(res.data.tickets);
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await api.post('/maintenance/tickets', { description });
      setDescription('');
      await load();
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Submission failed.');
    } finally { setSubmitting(false); }
  }

  return (
    <Layout>
      <div className="cp-maint">
        <h1 className="cp-maint-title">Maintenance Requests</h1>

        <form className="cp-maint-form" onSubmit={handleSubmit}>
          {error && <div className="cp-maint-error">{error}</div>}
          <label>Describe the issue</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
          <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Ticket'}</button>
        </form>

        {tickets.map((t) => (
          <div key={t._id} className="cp-maint-ticket">
            <div className="cp-maint-row">
              <span className={`cp-maint-badge cp-maint-badge--${t.status.toLowerCase()}`}>{t.status}</span>
              <span className="cp-maint-date">{new Date(t.createdAt).toLocaleDateString()}</span>
            </div>
            <p>{t.description}</p>
            {t.resolutionNote && <p className="cp-maint-note">Warden note: {t.resolutionNote}</p>}
          </div>
        ))}
      </div>
    </Layout>
  );
}