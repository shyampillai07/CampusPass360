import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './WardenDashboard.css';

export default function WardenDashboard() {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  async function loadLedgers() {
    setLoading(true);
    const res = await api.get('/ledger', { params: { status: 'PENDING' } });
    setLedgers(res.data.ledgers);
    setLoading(false);
  }

  useEffect(() => { loadLedgers(); }, []);

  async function handleVerify(id, stream, status) {
    setBusyId(id + stream);
    try {
      await api.put(`/ledger/${id}/verify`, { stream, status });
      await loadLedgers(); 
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Layout><p style={{ padding: 40 }}>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="cp-warden">
        <h1 className="cp-warden-title">Payment Verification</h1>
        <p className="cp-warden-count">{ledgers.length} pending</p>

        {ledgers.length === 0 && <p className="cp-warden-empty">Nothing pending — all caught up.</p>}

        {ledgers.map((l) => (
          <div key={l._id} className="cp-ledger-card">
            <div className="cp-ledger-head">
              <strong>{l.usn}</strong>
              <span>{l.academicYear}</span>
            </div>

            <div className="cp-ledger-row">
              <div>
                <span className="cp-ledger-label">VTU Rent — ₹{l.vtuRentAmount}</span>
                <span className={`cp-badge cp-badge--${l.vtuRentStatus.toLowerCase()}`}>{l.vtuRentStatus}</span>
              </div>
              {l.vtuRentStatus === 'PENDING' && (
                <div className="cp-ledger-actions">
                  <button disabled={busyId === l._id + 'vtuRent'} onClick={() => handleVerify(l._id, 'vtuRent', 'VERIFIED')}>Verify</button>
                  <button className="cp-btn-reject" disabled={busyId === l._id + 'vtuRent'} onClick={() => handleVerify(l._id, 'vtuRent', 'REJECTED')}>Reject</button>
                </div>
              )}
            </div>

            <div className="cp-ledger-row">
              <div>
                <span className="cp-ledger-label">Mess DD — ₹{l.messFeeAmount}</span>
                <span className={`cp-badge cp-badge--${l.messDdStatus.toLowerCase()}`}>{l.messDdStatus}</span>
              </div>
              {l.messDdStatus === 'PHYSICAL_DD_RECEIVED' && (
                <div className="cp-ledger-actions">
                  <button disabled={busyId === l._id + 'messDd'} onClick={() => handleVerify(l._id, 'messDd', 'VERIFIED')}>Verify</button>
                  <button className="cp-btn-reject" disabled={busyId === l._id + 'messDd'} onClick={() => handleVerify(l._id, 'messDd', 'REJECTED')}>Reject</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}