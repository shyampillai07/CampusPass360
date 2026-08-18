import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Layout from '../components/Layout';
import DigitalPass from '../components/DigitalPass';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/status/me').then((res) => setStatus(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><p style={{ padding: 40 }}>Loading...</p></Layout>;

  const payment = status?.payment;
  const paymentLabel = !payment ? 'No submission yet' : payment.isFullyPaid ? 'VERIFIED' : 'PENDING';
  const roomLabel = status?.room ? `${status.room.block}, Room ${status.room.room} (Bed ${status.room.bed})` : 'Not allocated yet';
  const passData = status?.room && payment?.isFullyPaid ? { room: roomLabel, qrUrl: null } : undefined;

  return (
    <Layout>
      <div className="cp-dash">
        <DigitalPass user={user} />
        <div className="cp-dash-stats">
          <div className={`cp-stat cp-stat--${payment?.isFullyPaid ? 'green' : 'amber'}`}><strong>Payment</strong><span>{paymentLabel}</span></div>
          <div className={`cp-stat cp-stat--${status?.room ? 'green' : 'amber'}`}><strong>Room</strong><span>{roomLabel}</span></div>
          <div className="cp-stat cp-stat--gray"><strong>Maintenance</strong><span>{status?.openMaintenanceTickets ?? 0} open</span></div>
        </div>
      </div>
    </Layout>
  );
}