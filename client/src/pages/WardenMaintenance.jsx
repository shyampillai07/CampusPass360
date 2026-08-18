import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './MaintenancePage.css';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export default function WardenMaintenance() {
  const [tickets, setTickets] = useState([]);

  async function load() {
    const res = await api.get('/maintenance/tickets');
    setTickets(res.data.tickets);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await api.patch(`/maintenance/tickets/${id}`, { status });
    await load();
  }

  return (
    <Layout>
      <div className="cp-maint">
        <h1 className="cp-maint-title">Maintenance Management</h1>
        {tickets.map((t) => (
          <div key={t._id} className="cp-maint-ticket">
            <div className="cp-maint-row">
              <strong>{t.usn}</strong>
              <span className="cp-maint-date">{new Date(t.createdAt).toLocaleDateString()}</span>
            </div>
            <p>{t.description}</p>
            <select value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </Layout>
  );
}