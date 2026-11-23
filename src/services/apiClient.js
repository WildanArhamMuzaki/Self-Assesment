const BASE_URL = 'https://telehealth.informatikaunimus.site/api';
const TOKEN = import.meta.env.VITE_API_TOKEN;

export async function apiRequest(path, { method = 'GET', body, withAuth = true } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    if (!TOKEN) {
      throw { status: 401, message: 'VITE_API_TOKEN belum diatur di file .env' };
    }
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw {
      status: response.status,
      message: json.message || 'Terjadi kesalahan pada server API.',
      errors: json.errors || {},
    };
  }

  return json;
}