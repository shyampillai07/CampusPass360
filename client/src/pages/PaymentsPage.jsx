import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './PaymentsPage.css';

const initialForm = { academicYear: '', vtuDuReference: '', vtuRentAmount: '', ddNumber: '', ddBankName: '', messFeeAmount: '' };

export default function PaymentsPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadStatus() {
    const res = await api.get('/status/me');
    setStatus(res.data.payment);
    setLoading(false);
  }

  useEffect(() => { loadStatus(); }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!file) { setError('Please attach your rent receipt PDF.'); return; }
    setSubmitting(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append('receipt', file);

    try {
      await api.post('/ledger', data);
      setSuccess('Submitted — your warden will verify this shortly.');
      setForm(initialForm);
      setFile(null);
      await loadStatus();
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs.join(', ') : err.response?.data?.error || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Layout><p style={{ padding: 40 }}>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="cp-payments">
        <h1 className="cp-payments-title">Payment &amp; Ledger</h1>

        {status && (
          <div className="cp-payments-status">
            <div className="cp-payments-row">
              <span>VTU Rent</span>
              <span className={`cp-payments-badge cp-payments-badge--${status.vtuRentStatus.toLowerCase()}`}>{status.vtuRentStatus}</span>
            </div>
            <div className="cp-payments-row">
              <span>Mess DD</span>
              <span className={`cp-payments-badge cp-payments-badge--${status.messDdStatus.toLowerCase()}`}>{status.messDdStatus}</span>
            </div>
            {status.isFullyPaid && <p className="cp-payments-done">Fully verified — your warden can now allocate a room.</p>}
          </div>
        )}

        {!status?.isFullyPaid && (
          <form className="cp-payments-form" onSubmit={handleSubmit}>
            <h2>Submit payment for a new academic year</h2>
            {error && <div className="cp-payments-error">{error}</div>}
            {success && <div className="cp-payments-success">{success}</div>}

            <label>Academic Year (e.g. 2025-2026)</label>
            <input value={form.academicYear} onChange={update('academicYear')} required placeholder="2025-2026" />
            <label>VTU / SB Collect Reference</label>
            <input value={form.vtuDuReference} onChange={update('vtuDuReference')} required />
            <label>VTU Rent Amount (₹)</label>
            <input type="number" value={form.vtuRentAmount} onChange={update('vtuRentAmount')} required />
            <label>Mess DD Number</label>
            <input value={form.ddNumber} onChange={update('ddNumber')} required />
            <label>DD Bank Name</label>
            <input value={form.ddBankName} onChange={update('ddBankName')} required />
            <label>Mess Fee Amount (₹)</label>
            <input type="number" value={form.messFeeAmount} onChange={update('messFeeAmount')} required />
            <label>Rent Receipt (PDF)</label>
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />

            <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
          </form>
        )}
      </div>
    </Layout>
  );
}