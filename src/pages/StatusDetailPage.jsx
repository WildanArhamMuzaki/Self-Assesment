import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';
import StatusBadges from '../components/common/StatusBadges';
import TimelineView from '../components/common/TimelineView';

export default function StatusDetailPage() {
  const { id } = useParams();
  const [statusData, setStatusData] = useState(null);
  const [replies, setReplies] = useState({});
  const [sendingCid, setSendingCid] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await telehealthService.getAssessmentStatus(id);
      setStatusData(res.data);
    } catch (err) {
      setError(err.message || 'Gagal memuat status.');
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [id]);

  const handleReply = async (cid) => {
    const text = (replies[cid] || '').trim();
    if (!text) return;
    setSendingCid(cid);
    setError('');
    setMessage('');
    try {
      await telehealthService.replyClarification(id, cid, text);
      setMessage('Jawaban klarifikasi berhasil dikirim.');
      setReplies((prev) => ({ ...prev, [cid]: '' }));
      await fetchStatus();
    } catch (err) {
      setError(err.message || 'Gagal mengirim jawaban klarifikasi.');
    } finally {
      setSendingCid('');
    }
  };

  if (!statusData && !error) return <div className="card">Memuat pelacakan status...</div>;

  const klarifikasiList = statusData?.klarifikasi_menunggu || [];
  const tindakLanjut = statusData?.tindak_lanjut;

  return (
    <div className="stack">
      {/* Halaman 8: Tracking Status */}
      <section className="card stack">
        <div className="row-between">
          <h2>Pelacakan Status ({id})</h2>
          <button type="button" className="btn btn-secondary" onClick={fetchStatus}>
            Muat Ulang Status
          </button>
        </div>

        <StatusBadges
          pengiriman={statusData?.status_pengiriman}
          peninjauan={statusData?.status_peninjauan}
        />

        {statusData?.pesan && <div className="info-box">{statusData.pesan}</div>}
        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}
      </section>

      {/* Halaman 9: Klarifikasi Petugas */}
      {klarifikasiList.length > 0 && (
        <section className="card stack">
          <h3>Pertanyaan Klarifikasi dari Petugas</h3>
          {klarifikasiList.map((k) => (
            <div key={k.id} className="clarification-card stack-sm">
              <p><strong>Pertanyaan ({k.id}):</strong> {k.pertanyaan}</p>
              <textarea
                rows={3}
                className="input"
                placeholder="Tulis jawaban klarifikasi Anda di sini..."
                value={replies[k.id] || ''}
                onChange={(e) => setReplies((prev) => ({ ...prev, [k.id]: e.target.value }))}
              />
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={sendingCid === k.id}
                  onClick={() => handleReply(k.id)}
                >
                  {sendingCid === k.id ? 'Mengirim...' : 'Kirim Jawaban Klarifikasi'}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Halaman 10: Tindak Lanjut */}
      {tindakLanjut && (
        <section className="card stack">
          <h3>Tindak Lanjut Petugas</h3>
          <div className="followup-card">
            <p><strong>Jenis Tindak Lanjut:</strong> {tindakLanjut.jenis?.label}</p>
            <p><strong>Arahan Petugas:</strong> {tindakLanjut.arahan}</p>
            {tindakLanjut.jadwal_konsultasi && (
              <p>
                <strong>Jadwal Konsultasi:</strong>{' '}
                {new Date(tindakLanjut.jadwal_konsultasi).toLocaleString('id-ID')}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Timeline Proses */}
      <section className="card stack">
        <h3>Timeline Peninjauan</h3>
        <TimelineView timeline={statusData?.timeline || []} />
      </section>
    </div>
  );
}