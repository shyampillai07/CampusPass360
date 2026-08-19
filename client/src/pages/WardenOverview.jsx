import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import './WardenOverview.css';

export default function WardenOverview() {
  const [rooms, setRooms] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/rooms'), api.get('/ledger', { params: { status: 'PENDING' } })])
      .then(([roomsRes, ledgerRes]) => {
        setRooms(roomsRes.data.rooms);
        setPendingCount(ledgerRes.data.ledgers.length);
        setLoading(false);
      });
  }, []);

  if (loading) return <Layout><p style={{ padding: 40 }}>Loading...</p></Layout>;

  const totalBeds = rooms.reduce((sum, r) => sum + r.beds.length, 0);
  const occupied = rooms.reduce((sum, r) => sum + r.occupiedBedsCount, 0);
  const available = totalBeds - occupied;

  const byBlock = {};
  rooms.forEach((r) => {
    const key = r.blockId.blockName;
    if (!byBlock[key]) byBlock[key] = { category: r.blockId.category, total: 0, occupied: 0 };
    byBlock[key].total += r.beds.length;
    byBlock[key].occupied += r.occupiedBedsCount;
  });

  return (
    <Layout>
      <div className="cp-overview">
        <h1 className="cp-overview-title">Warden Dashboard</h1>

        <div className="cp-overview-stats">
          <div className="cp-ostat cp-ostat--navy"><strong>{totalBeds}</strong><span>Total Beds</span></div>
          <div className="cp-ostat cp-ostat--amber"><strong>{pendingCount}</strong><span>Pending Payments</span></div>
          <div className="cp-ostat cp-ostat--green"><strong>{occupied}</strong><span>Occupied</span></div>
        </div>

        <div className="cp-overview-actions">
          <Link to="/warden/verify" className="cp-overview-action">
            <span>Review Pending Payments</span>

          </Link>
          <Link to="/warden/allocation" className="cp-overview-action">
            <span>Allocate Rooms</span>

          </Link>
        </div>

        <div className="cp-overview-table-wrap">
          <table className="cp-overview-table">
            <thead><tr><th>Block</th><th>Category</th><th>Occupied</th><th>Available</th></tr></thead>
            <tbody>
              {Object.entries(byBlock).map(([name, d]) => (
                <tr key={name}>
                  <td>{name}</td><td>{d.category}</td><td>{d.occupied}</td><td>{d.total - d.occupied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="cp-overview-note">{available} bed{available !== 1 ? 's' : ''} available across all blocks.</p>
      </div>
    </Layout>
  );
}