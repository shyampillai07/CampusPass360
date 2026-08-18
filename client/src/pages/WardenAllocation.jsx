import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import './WardenAllocation.css';

export default function WardenAllocation() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyBedId, setBusyBedId] = useState(null);
  const [message, setMessage] = useState('');

  async function loadAll() {
    setLoading(true);
    const [studentsRes, roomsRes] = await Promise.all([api.get('/rooms/unallocated'), api.get('/rooms')]);
    setStudents(studentsRes.data.students);
    setRooms(roomsRes.data.rooms);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function handleAllocate(roomId, bedId) {
    if (!selectedStudent) return;
    setBusyBedId(bedId);
    setMessage('');
    try {
      await api.post('/rooms/allocate', { studentId: selectedStudent._id, roomId, bedId });
      setMessage(`Allocated ${selectedStudent.name} successfully.`);
      setSelectedStudent(null);
      await loadAll();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Allocation failed.');
    } finally {
      setBusyBedId(null);
    }
  }

  if (loading) return <Layout><p style={{ padding: 40 }}>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="cp-alloc">
        <h1 className="cp-alloc-title">Room &amp; Bed Allocation</h1>
        {message && <div className="cp-alloc-message">{message}</div>}

        <div className="cp-alloc-grid">
          <div className="cp-alloc-panel">
            <h2>Waiting for allocation ({students.length})</h2>
            {students.length === 0 && <p className="cp-alloc-empty">No fully-paid students awaiting a room.</p>}
            {students.map((s) => (
              <button
                key={s._id}
                className={`cp-alloc-student ${selectedStudent?._id === s._id ? 'cp-alloc-student--selected' : ''}`}
                onClick={() => setSelectedStudent(s)}
              >
                <strong>{s.name}</strong>
                <span>{s.usn} · {s.category} · {s.branch}</span>
              </button>
            ))}
          </div>

          <div className="cp-alloc-panel">
            <h2>{selectedStudent ? `Available beds — ${selectedStudent.category} blocks` : 'Available Beds'}</h2>
            {!selectedStudent && (
              <p className="cp-alloc-hint">Select a student on the left to enable allocation.</p>
            )}
            {rooms
              .filter((r) => !selectedStudent || r.blockId.category === selectedStudent.category)
              .map((room) => (
                <div key={room._id} className="cp-alloc-room">
                  <div className="cp-alloc-room-head">{room.blockId.blockName} — Room {room.roomNumber}</div>
                  <div className="cp-alloc-beds">
                    {room.beds.map((bed) => (
                      <button
                        key={bed._id}
                        className={`cp-alloc-bed cp-alloc-bed--${bed.status.toLowerCase()}`}
                        disabled={bed.status !== 'AVAILABLE' || !selectedStudent || busyBedId === bed._id}
                        onClick={() => handleAllocate(room._id, bed._id)}
                      >
                        {bed.bedNumber}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}