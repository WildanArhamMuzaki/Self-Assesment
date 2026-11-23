import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';
import { buildFilledAnswers } from '../utils/formHelpers';

export default function PeriksaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function runValidation() {
      try {
        const detailRes = await telehealthService.getAssessmentDetail(id);
        const data = detailRes.data;
        const formId = data.form?.id || data.form_id;
        const filled = buildFilledAnswers(data.answers || {});

        // POST /forms/{id}/validate dengan "nim" agar tercatat sebagai bukti fitur
        const valRes = await telehealthService.validateForm(formId, filled);
        setValidation(valRes.data);
      } catch (err) {
        setError(err.message || 'Gagal memvalidasi formulir.');
      } finally {
        setLoading(false);
      }
    }
    runValidation();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await telehealthService.submitAssessment(id);
      navigate(`/assessments/${id}/konfirmasi`);
    } catch (err) {
      setError(err.message || 'Gagal mengirim formulir.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="card">Memeriksa kelengkapan jawaban...</div>;

  const isValid = Boolean(validation?.valid);
  const ringkasan = validation?.hasil_pratinjau?.ringkasan || [];
  const errorsList = Object.entries(validation?.errors || {});

  return (
    <div className="card stack">
      <h2>Periksa Jawaban Sebelum Mengirim</h2>

      {error && <div className="error-box">{error}</div>}

      {validation?.kelengkapan && (
        <div className="info-box">
          <strong>Kelengkapan:</strong> {validation.kelengkapan.persen}% ({validation.kelengkapan.status})
        </div>
      )}

      {!isValid && errorsList.length > 0 && (
        <div className="error-box">
          <strong>Masih ada jawaban wajib yang belum sesuai:</strong>
          <ul>
            {errorsList.map(([field, msg]) => (
              <li key={field}>
                <code>{field}</code>: {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Pratinjau Ringkasan Jawaban</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Pertanyaan</th>
            <th>Jawaban</th>
          </tr>
        </thead>
        <tbody>
          {ringkasan.map((item) => (
            <tr key={item.question_id}>
              <td>{item.pertanyaan || item.label}</td>
              <td>
                <span className={!item.terisi ? 'muted' : ''}>{item.jawaban_teks}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(`/assessments/${id}/isi`)}
        >
          &larr; Ubah Jawaban
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!isValid || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Mengirim...' : 'Kirim Formulir Sekarang'}
        </button>
      </div>
    </div>
  );
}