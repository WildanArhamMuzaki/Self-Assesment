import { useEffect, useState } from 'react';
import { telehealthService } from '../services/telehealthService';

export default function CekUtsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const loadUts = () => {
    telehealthService
      .getUtsStatus()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || 'Gagal memuat status UTS.'));
  };

  useEffect(() => {
    loadUts();
  }, []);

  if (error) return <div className="card error-box">{error}</div>;
  if (!data) return <div className="card">Memuat bukti fitur UTS...</div>;

  return (
    <div className="card stack">
      <div className="row-between">
        <div>
          <h2>Status Bukti Fitur UTS ({data.nim})</h2>
          <p className="muted">{data.nama} — {data.kelas}</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={loadUts}>
          Refresh
        </button>
      </div>

      <div className="info-box">
        <p>
          <strong>Progres Bukti Fitur:</strong> {data.bukti_fitur?.tercapai} /{' '}
          {data.bukti_fitur?.total} fitur terdeteksi
        </p>
        <p>
          <strong>Status Penilaian Dosen:</strong>{' '}
          <span className="badge badge-blue">{data.penilaian?.status?.label}</span>
        </p>
        {data.penilaian?.catatan && <p><strong>Catatan Dosen:</strong> {data.penilaian.catatan}</p>}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Kode Fitur</th>
            <th>Keterangan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(data.bukti_fitur?.daftar || []).map((f) => (
            <tr key={f.kode}>
              <td><code>{f.kode}</code></td>
              <td>{f.label}</td>
              <td>
                <span className={`badge ${f.tercapai ? 'badge-green' : 'badge-gray'}`}>
                  {f.tercapai ? 'Tercapai' : 'Belum Terdeteksi'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}