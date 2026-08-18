import Header from './Header';
import Footer from './Footer';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="cp-shell">
      <Header />
      <main className="cp-main">
        <div className="cp-watermark" aria-hidden="true" />
        <div className="cp-main-inner">{children}</div>
      </main>
      <Footer />
    </div>
  );
}