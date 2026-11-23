import { normalizeOptions, handleMultiChoiceChange } from '../../utils/formHelpers';

export default function DynamicField({ question, value, onChange, errorMessage }) {
  const isRequired = Boolean(question.required ?? question.wajib);
  const isMeasurement = question.data_type === 'pengukuran';
  const options = normalizeOptions(question);
  const labelText = question.pertanyaan || question.label;

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className={`input ${errorMessage ? 'input-error' : ''}`}
            value={value ?? ''}
            maxLength={question.max_length}
            placeholder={question.placeholder || 'Ketik jawaban Anda...'}
            onChange={(e) => onChange(question.id, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <textarea
            rows={3}
            className={`input ${errorMessage ? 'input-error' : ''}`}
            value={value ?? ''}
            maxLength={question.max_length}
            placeholder={question.placeholder || 'Tuliskan keterangan tambahan...'}
            onChange={(e) => onChange(question.id, e.target.value)}
          />
        );

      case 'single_choice':
        return (
          <div className="choice-list">
            {options.map((opt) => (
              <label key={String(opt.value)} className="choice-item">
                <input
                  type="radio"
                  name={question.id}
                  checked={value === opt.value}
                  onChange={() => onChange(question.id, opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'multi_choice':
        return (
          <div className="choice-list">
            {options.map((opt) => {
              const checked = Array.isArray(value) && value.includes(opt.value);
              return (
                <label key={String(opt.value)} className="choice-item">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChange(question.id, handleMultiChoiceChange(value, opt, options))
                    }
                  />
                  <span>
                    {opt.label} {opt.exclusive && <small className="muted">(Eksklusif)</small>}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case 'scale':
        return (
          <div className="scale-group">
            {options.map((opt) => {
              const numericVal = Number(opt.value);
              const selected = value === numericVal;
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  className={`scale-btn ${selected ? 'scale-btn-active' : ''}`}
                  onClick={() => onChange(question.id, numericVal)}
                >
                  <strong>{numericVal}</strong>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        );

      case 'number':
        return (
          <div className="number-wrapper">
            <input
              type="number"
              step="any"
              className={`input ${errorMessage ? 'input-error' : ''}`}
              value={value ?? ''}
              min={question.min}
              max={question.max}
              onChange={(e) =>
                onChange(question.id, e.target.value === '' ? null : Number(e.target.value))
              }
            />
            {question.satuan && <span className="unit-tag">{question.satuan}</span>}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className={`input ${errorMessage ? 'input-error' : ''}`}
            value={value ?? ''}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => onChange(question.id, e.target.value || null)}
          />
        );

      default:
        return (
          <input
            type="text"
            className="input"
            value={value ?? ''}
            onChange={(e) => onChange(question.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className={`field-card ${isMeasurement ? 'field-measurement' : 'field-subjective'}`}>
      <div className="field-header">
        <label className="field-label">
          {labelText} {isRequired && <span className="required-star">*</span>}
        </label>
        <span className={`data-type-tag ${isMeasurement ? 'tag-measure' : 'tag-subj'}`}>
          {isMeasurement ? 'Pengukuran Objektif' : 'Laporan Subjektif'}
        </span>
      </div>

      {question.deskripsi && <p className="field-hint">{question.deskripsi}</p>}

      {renderInput()}

      {value !== undefined && value !== null && value !== '' && (
        <div className="field-actions">
          <button
            type="button"
            className="btn-link"
            onClick={() => onChange(question.id, null)}
          >
            Kosongkan jawaban
          </button>
        </div>
      )}

      {errorMessage && <p className="error-text">{errorMessage}</p>}
    </div>
  );
}