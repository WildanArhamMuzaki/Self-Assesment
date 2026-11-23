import { apiRequest } from './apiClient';
import { MHS } from '../config/mahasiswa';

export const telehealthService = {
  // 7.1 Umum
  checkApi: () => apiRequest('', { withAuth: false }),
  getProfile: () => apiRequest(`/me?nim=${encodeURIComponent(MHS.nim)}`),
  getForms: () => apiRequest('/forms'),
  getFormDetail: (formId) => apiRequest(`/forms/${formId}`),
  validateForm: (formId, answers) =>
    apiRequest(`/forms/${formId}/validate`, {
      method: 'POST',
      body: { nim: MHS.nim, answers },
    }),

  // 7.2 Self-Assessment
  createDraft: (formId, answers = {}) =>
    apiRequest('/assessments', {
      method: 'POST',
      body: {
        form_id: formId,
        persetujuan: true,
        mahasiswa: MHS,
        answers,
      },
    }),

  getAssessments: ({ useNim = true, statusPeninjauan = '', statusPengiriman = '' } = {}) => {
    const params = new URLSearchParams();
    if (useNim) params.set('nim', MHS.nim);
    if (statusPeninjauan) params.set('status_peninjauan', statusPeninjauan);
    if (statusPengiriman) params.set('status_pengiriman', statusPengiriman);
    const query = params.toString();
    return apiRequest(`/assessments${query ? `?${query}` : ''}`);
  },

  getAssessmentDetail: (id) => apiRequest(`/assessments/${id}`),

  saveDraft: (id, answers) =>
    apiRequest(`/assessments/${id}`, {
      method: 'PATCH',
      body: { answers },
    }),

  deleteDraft: (id) =>
    apiRequest(`/assessments/${id}`, {
      method: 'DELETE',
    }),

  submitAssessment: (id) =>
    apiRequest(`/assessments/${id}/submit`, {
      method: 'POST',
    }),

  getAssessmentHasil: (id) => apiRequest(`/assessments/${id}/hasil`),

  getAssessmentStatus: (id) => apiRequest(`/assessments/${id}/status`),

  replyClarification: (id, cid, jawaban) =>
    apiRequest(`/assessments/${id}/clarifications/${cid}/reply`, {
      method: 'POST',
      body: { jawaban },
    }),

  // 7.3 Status UTS
  getUtsStatus: () => apiRequest(`/uts/${encodeURIComponent(MHS.nim)}`),
};