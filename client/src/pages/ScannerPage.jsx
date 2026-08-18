import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../api/axios';
import Layout from '../components/Layout';
import './ScannerPage.css';

const ELEMENT_ID = 'cp-qr-reader';

export default function ScannerPage() {
  const [cameraError, setCameraError] = useState('');
  const [result, setResult] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const busyRef = useRef(false);

  async function verify(qrToken) {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await api.post('/scanner/verify', { qrToken });
      setResult(res.data);
    } catch {
      setResult({ accessGranted: false, reason: 'Verification request failed' });
    } finally {
      setTimeout(() => { busyRef.current = false; }, 2000);
    }
  }

  useEffect(() => {
    const scanner = new Html5Qrcode(ELEMENT_ID);
    let hasStarted = false;
    let isCancelled = false;

    scanner
      .start({ facingMode: 'environment' }, { fps: 10, qrbox: 220 }, verify, () => { })
      .then(() => {
        if (isCancelled) {

          scanner.stop().catch(() => { });
        } else {
          hasStarted = true;
        }
      })
      .catch(() => setCameraError('Camera access was denied or unavailable. Check your browser\'s camera permission for this site.'));

    return () => {
      isCancelled = true;

      if (hasStarted) {
        scanner.stop().then(() => scanner.clear()).catch(() => { });
      }
    };
  }, []);

  return (
    <Layout>
      <div className="cp-scanner">
        <h1 className="cp-scanner-title">Gate Scanner</h1>

        {cameraError ? <div className="cp-scanner-error">{cameraError}</div> : <div id={ELEMENT_ID} className="cp-scanner-view" />}


        <div className="cp-scanner-manual">
          <input placeholder="Paste QR token to test manually" value={manualToken} onChange={(e) => setManualToken(e.target.value)} />
          <button onClick={() => verify(manualToken)}>Verify</button>
        </div>

        {result && (
          <div className={`cp-scan-result cp-scan-result--${result.accessGranted ? 'granted' : 'denied'}`}>
            <div className="cp-scan-status">{result.accessGranted ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</div>
            {result.accessGranted ? (
              <>{result.photoUrl && <img src={result.photoUrl} alt="" className="cp-scan-photo" />}<div><strong>{result.name}</strong></div><div>{result.usn}</div><div>{result.room}</div></>
            ) : <div>{result.reason}</div>}
          </div>
        )}
      </div>
    </Layout>
  );
}