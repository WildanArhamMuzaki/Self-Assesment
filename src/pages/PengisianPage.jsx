import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { telehealthService } from '../services/telehealthService';
import { isVisible } from '../utils/showIf';
import { buildDraftPayload } from '../utils/formHelpers';
import DynamicField from '../components/form/DynamicField';

export default function PengisianPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [formDef, setFormDef] = useState(null);
  const [answers, setAnswers] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const detailRes = await telehealthService.getAssessmentDetail(id);
        const data = detailRes.data;
        setAssessment(data);
        setAnswers(data.answers || {});

        const formId = data.form?.id || data.form_id;
        const formRes = await telehealthService.getFormDetail(formId);
        setFormDef(formRes.data);
      } catch (err) {
        setStatusMsg(err.message || 'Gagal memuat formulir.');
      }
    }
    init();
  }, [id]);

  if (!formDef) return <div className="card">{statusMsg || 'Memuat formulir...'}</div>;

  const visibleSections = (formDef.sections || []).filter((sec) => isVisible(sec.show_if, answers));
  const activeSection = visibleSections[stepIndex] || visibleSections[0];
  const visibleQuestions = (activeSection?.questions || []).filter((q) =>
    isVisible(q.show_if, answers)
  );

  const handleFieldChange = (questionId, newVal) => {
    setAnswers((prev) => ({ ...prev, [questionId]: newVal }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  const handleSaveDraft = async (goToReview = false) => {
    setSaving(true);
    setStatusMsg('');
    try {
      const allQuestions = (formDef.sections || []).flatMap((s) => s.questions || []);
      const payload = buildDraftPayload(allQuestions, answers);
      await telehealthService.saveDraft(id, payload);
      setStatusMsg('Draf berhasil disimpan.');
      if (goToReview) {
        navigate(`/assessments/${id}/periksa`);
      }
    } catch (err) {
      setStatusMsg(err.message || 'Gagal menyimpan draf.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="row-between">
          <div>
            <h2>{formDef.judul}</h2>
            <p className="muted">ID Draf: {assessment?.id}</p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={saving}
            onClick={() => handleSaveDraft(false)}
          >
            {saving ? 'Menyimpan...' : 'Simpan Draf'}
          </button>
        </div>

        {/* Stepper Navigasi Bagian */}
        <div className="stepper">
          {visibleSections.map((sec, idx) => (
            <button
              key={sec.id || idx}
              type="button"
              className={`step-pill ${idx === stepIndex ? 'step-active' : ''}`}
              onClick={() => setStepIndex(idx)}
            >
              {idx + 1}. {sec.judul || sec.title}
            </button>
          ))}
        </div>

        {statusMsg && <div className="info-box">{statusMsg}</div>}

        {activeSection && (
          <div className="stack">
            <h3>{activeSection.judul || activeSection.title}</h3>
            {visibleQuestions.map((q) => (
              <DynamicField
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={handleFieldChange}
                errorMessage={errors[q.id]}
              />
            ))}
          </div>
        )}

        <div className="row-between mt-16">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            &larr; Bagian Sebelumnya
          </button>

          {stepIndex < visibleSections.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                await handleSaveDraft(false);
                setStepIndex((i) => i + 1);
              }}
            >
              Simpan & Lanjut &rarr;
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={saving}
              onClick={() => handleSaveDraft(true)}
            >
              Periksa Sebelum Mengirim &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}