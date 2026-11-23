import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';
import { MHS } from '../config/mahasiswa';

export default function BerandaPage() {
  const [profile, setProfile] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [meRes, formsRes] = await Promise.all([
          telehealthService.getProfile(),
          telehealthService.getForms(),
        ]);
        setProfile(meRes.data);
        setForms(formsRes.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat beranda.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="card">Memuat data pasien dan formulir...</div>;
  if (error) return <div className="card error-box">{error}</div>;

  const stats = profile?.statistik || {};

  return (
    <div className="stack">
      <section className="card">
        <h2>Profil Pasien & Identitas Mahasiswa</h2>
        <div className="grid-2">
          <div>
            <p><strong>Nama Pasien:</strong> {profile?.nama} ({profile?.id})</p>
            <p><strong>No. Rekam Medis:</strong> {profile?.no_rm}</p>
          </div>
          <div>
            <p><strong>Mahasiswa:</strong> {MHS.nama} ({MHS.nim})</p>
            <p><strong>Kelas:</strong> {MHS.kelas}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box"><span>Total</span><strong>{stats.total ?? 0}</strong></div>
          <div className="stat-box"><span>Draf</span><strong>{stats.draf ?? 0}</strong></div>
          <div className="stat-box"><span>Menunggu</span><strong>{stats.menunggu ?? 0}</strong></div>
          <div className="stat-box"><span>Perlu Klarifikasi</span><strong>{stats.perlu_klarifikasi ?? 0}</strong></div>
          <div className="stat-box"><span>Sudah Ditinjau</span><strong>{stats.sudah_ditinjau ?? 0}</strong></div>
        </div>
      </section>

      <section className="card">
        <h2>Pilih Formulir Self-Assessment</h2>
        <div className="stack">
          {forms.map((f) => (
            <div key={f.id} className="form-item-card">
              <div>
                <div className="row-gap">
                  <h3>{f.judul}</h3>
                  <span className={`badge ${f.id === 'FRM-KELUHAN' ? 'badge-blue' : 'badge-cyan'}`}>
                    {f.id === 'FRM-KELUHAN' ? 'Wajib' : 'Bonus'}
                  </span>
                </div>
                <p className="muted">
                  ID: {f.id} • Jenis hasil: {f.jenis_hasil} • Estimasi: {f.estimasi_menit} menit
                </p>
              </div>
              <Link to={`/forms/${f.id}/petunjuk`} className="btn btn-primary">
                Pilih Formulir
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}