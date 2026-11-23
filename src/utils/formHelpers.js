export function normalizeOptions(question) {
  const raw = question.options || question.pilihan || question.opsi || [];
  return raw.map((opt) => ({
    value: opt.value ?? opt.kode ?? opt.id,
    label: opt.label ?? opt.teks ?? opt.nama ?? String(opt.value ?? opt.kode),
    exclusive: Boolean(opt.exclusive || opt.value === 'tidak_ada' || opt.kode === 'tidak_ada'),
  }));
}

export function handleMultiChoiceChange(currentValues, option, allOptions) {
  const list = Array.isArray(currentValues) ? [...currentValues] : [];
  const exists = list.includes(option.value);

  if (exists) {
    return list.filter((item) => item !== option.value);
  }

  // Jika memilih opsi exclusive (mis. "tidak_ada"), hapus opsi lainnya
  if (option.exclusive) {
    return [option.value];
  }

  // Jika memilih opsi biasa, hapus opsi exclusive yang sebelumnya tercentang
  const exclusiveValues = allOptions.filter((o) => o.exclusive).map((o) => o.value);
  return [...list.filter((item) => !exclusiveValues.includes(item)), option.value];
}

// Menyiapkan payload PATCH: kosongkan dengan null jika dihapus, jangan beri default "tidak"
export function buildDraftPayload(questions, answers) {
  const payload = {};
  questions.forEach((q) => {
    const val = answers[q.id];
    const isEmpty =
      val === undefined ||
      val === null ||
      val === '' ||
      (Array.isArray(val) && val.length === 0);

    payload[q.id] = isEmpty ? null : val;
  });
  return payload;
}

// Menyiapkan payload validasi (hanya kirim jawaban yang terisi)
export function buildFilledAnswers(answers) {
  const cleaned = {};
  Object.entries(answers).forEach(([key, val]) => {
    const isEmpty =
      val === undefined ||
      val === null ||
      val === '' ||
      (Array.isArray(val) && val.length === 0);
    if (!isEmpty) {
      cleaned[key] = val;
    }
  });
  return cleaned;
}