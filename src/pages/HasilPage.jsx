import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';

export default function HasilPage() {
  const { id } = useParams();
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    telehealthService
      .getAssessmentHasil(id)
      .then((res) => setHasil(res.data?.hasil || res.data))
      .catch((err) => setError(err.message || 'Gagal memuat hasil.'));
  }, [id]);

  if (error) return <div className="card error-box">{error}</div>;
  if (!hasil) return <div className="card">Memuat hasil assessment...</div>;

  return (
    <div className="card stack">
      <div className="row-between">
        <div>
          <h2>Hasil Assessment: {hasil.judul}</h2>
          <p className="muted">ID: {id}</p>
        </div>
        <Link to={`/assessments/${id}/status`} className="btn btn-primary">
          Lihat Tracking Status &rarr;
        </Link>
      </div>

      {/* Skor GAD-7 (jika ada) */}
      {hasil.skor && (
        <div className="score-card">
          <h3>
            Skor GAD-7: {hasil.skor.total} / {hasil.skor.maks} ({hasil.skor.kategori?.label})
          </h3>
          <p>{hasil.skor.keterangan}</p>
        </div>
      )}

      {/* Perbandingan dengan pengisian sebelumnya */}
      {hasil.perubahan && (
        <div className="info-box">
          <h4>Perbandingan dengan Pengisian Sebelumnya ({hasil.perubahan.pembanding_id})</h4>
          {hasil.perubahan.skor && (
            <p>
              Skor sebelumnya: <strong>{hasil.perubahan.skor.sebelumnya}</strong> &rarr; Sekarang:{' '}
              <strong>{hasil.perubahan.skor.sekarang}</strong> (Selisih:{' '}
              {hasil.perubahan.skor.selisih > 0
                ? `+${hasil.perubahan.skor.selisih}`
                : hasil.perubahan.skor.selisih}
              )
            </p>
          )}
          <ul>
            {(hasil.perubahan.perubahan || []).map((p, idx) => (
              <li key={idx}>
                <strong>{p.label}:</strong> {p.sebelumnya} &rarr; {p.sekarang}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasil.kelengkapan && (
        <p>
          <strong>Kelengkapan:</strong> {hasil.kelengkapan.label} ({hasil.kelengkapan.persen}%)
        </p>
      )}

      <h3>Ringkasan Jawaban</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Pertanyaan</th>
            <th>Tipe Data</th>
            <th>Jawaban</th>
          </tr>
        </thead>
        <tbody>
          {(hasil.ringkasan || []).map((item) => (
            <tr key={item.question_id}>
              <td>{item.pertanyaan || item.label}</td>
              <td>
                <span
                  className={`data-type-tag ${
                    item.data_type === 'pengukuran' ? 'tag-measure' : 'tag-subj'
                  }`}
                >
                  {item.data_type === 'pengukuran' ? 'Pengukuran' : 'Subjektif'}
                </span>
              </td>
              <td>
                <span className={!item.terisi ? 'muted' : ''}>{item.jawaban_teks}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="info-box">
        <p><strong>Keterbatasan Hasil:</strong> {hasil.keterbatasan}</p>
        <p><strong>Langkah Berikutnya:</strong> {hasil.langkah_berikutnya}</p>
      </div>
    </div>
  );
}