import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import DigitalPass from '../components/DigitalPass';
import './PassPage.css';

export default function PassPage() {
  const { user } = useAuth();
  return (
    <Layout>
      <div className="cp-pass-page">
        <h1 className="cp-pass-page-title">My Digital Pass</h1>
        <p className="cp-pass-page-note">This QR code refreshes automatically every 40 seconds — a screenshot will stop working after 45 seconds.</p>
        <DigitalPass user={user} />
      </div>
    </Layout>
  );
}