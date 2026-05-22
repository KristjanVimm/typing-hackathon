const API_BASE = '/api';

export async function fetchRandomWords(count = 25) {
  const res = await fetch(`${API_BASE}/typing/words?count=${count}`);
  if (!res.ok) throw new Error(`words ${res.status}`);
  return res.text();
}

export async function submitResult(result) {
  const res = await fetch(`${API_BASE}/typing/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  });
  if (!res.ok) throw new Error(`results ${res.status}`);
  return res.json();
}

export async function fetchStats(userId) {
  const url = userId
    ? `${API_BASE}/typing/stats?userId=${encodeURIComponent(userId)}`
    : `${API_BASE}/typing/stats`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`stats ${res.status}`);
  return res.json();
}
