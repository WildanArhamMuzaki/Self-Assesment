import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';
import StatusBadges from '../components/common/StatusBadges';

export default function RiwayatPage() {
  const [items, setItems] = useState([]);
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadList = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await telehealthService.getAssessments({ useNim: !showDemo });
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat riwayat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [showDemo]);

  const handleDelete = async (id) => {
    if (!confirm('Hapus draf ini?')) return;
    try {
      await telehealthService.deleteDraft(id);
      loadList();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card stack">
      <div className="row-between">
        <h2>Riwayat Self-Assessment</h2>
        <label className="choice-item">
          <input
            type="checkbox"
            checked={showDemo}
            onChange={(e) => setShowDemo(e.target.checked)}
          />
          <span>Tampilkan Data Contoh (NIM DEMO)</span>
        </label>
      </div>

      {error && <div className="error-box">{error}</div>}
      {loading && <p>Memuat daftar riwayat...</p>}

      {!loading && items.length === 0 && (
        <p className="muted">Belum ada riwayat pengisian. Mulai isi formulir dari halaman Beranda.</p>
      )}

      <div className="stack">
        {items.map((item) => {
          const isDraft = item.status_pengiriman?.kode === 'draft';
          return (
            <div key={item.id} className="history-card">
              <div className="stack-sm">
                <div className="row-gap">
                  <strong>{item.judul || item.form?.judul}</strong>
                  <small className="muted">({item.id})</small>
                  {item.klarifikasi_menunggu > 0 && (
                    <span className="badge badge-amber">
                      {item.klarifikasi_menunggu} Klarifikasi Menunggu
                    </span>
                  )}
                </div>
                <StatusBadges
                  pengiriman={item.status_pengiriman}
                  peninjauan={item.status_peninjauan}
                />
              </div>

              <div className="row-gap">
                {isDraft ? (
                  <>
                    <Link to={`/assessments/${item.id}/isi`} className="btn btn-primary">
                      Lanjutkan Draf
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={`/assessments/${item.id}/hasil`} className="btn btn-secondary">
                      Hasil
                    </Link>
                    <Link to={`/assessments/${item.id}/status`} className="btn btn-primary">
                      Status & Tindak Lanjut
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}