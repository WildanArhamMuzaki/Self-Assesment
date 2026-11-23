import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';

export default function PetunjukPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    telehealthService
      .getFormDetail(formId)
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.message));
  }, [formId]);

  const handleMulai = async () => {
    if (!agreed) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await telehealthService.createDraft(formId);
      navigate(`/assessments/${res.data.id}/isi`);
    } catch (err) {
      setError(err.message || 'Gagal memulai pengisian.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!form && !error) return <div className="card">Memuat petunjuk formulir...</div>;

  return (
    <div className="card stack">
      <h2>{form?.judul || formId}</h2>
      {error && <div className="error-box">{error}</div>}

      <div className="info-box">
        <h4>Petunjuk Pengisian</h4>
        {Array.isArray(form?.petunjuk) ? (
          <ul>
            {form.petunjuk.map((p, idx) => <li key={idx}>{p}</li>)}
          </ul>
        ) : (
          <p>{form?.petunjuk || 'Isi setiap pertanyaan sesuai kondisi Anda saat ini.'}</p>
        )}
      </div>

      <label className="consent-box">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          {typeof form?.persetujuan === 'string'
            ? form.persetujuan
            : form?.persetujuan?.teks ||
              'Saya memahami petunjuk di atas dan setuju mengisi formulir self-assessment ini.'}
        </span>
      </label>

      <div className="row-between">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Kembali
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!agreed || submitting}
          onClick={handleMulai}
        >
          {submitting ? 'Membuat Draf...' : 'Mulai Mengisi'}
        </button>
      </div>
    </div>
  );
}