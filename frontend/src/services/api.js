const API_BASE = '/api';

export async function fetchPracticeText() {
  const res = await fetch(`${API_BASE}/typing/text`);
  return res.text();
}

export async function submitResult(result) {
  const res = await fetch(`${API_BASE}/typing/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  });
  return res.json();
}
