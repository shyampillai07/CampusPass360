import Layout from '../components/Layout';

export default function PlaceholderPage({ title }) {
  return (
    <Layout>
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--palace-navy)' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Coming soon.</p>
      </div>
    </Layout>
  );
}