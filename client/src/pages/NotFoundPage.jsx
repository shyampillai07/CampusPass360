import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--palace-navy)' }}>404</h1>
        <p style={{ color: 'var(--text-muted)' }}>Page not found.</p>
        <Link to="/" style={{ color: 'var(--mysuru-gold)' }}>Go home</Link>
      </div>
    </Layout>
  );
}