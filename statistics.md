## Statistics (kb-00005 — ProgressCharts.jsx)

### What to build

Build `src/ProgressCharts.jsx` — the statistics and data visualisation layer for
the keybr clone. This component is designed to work in two phases:

**Phase 1 (now):** Run entirely on sample data defined inside this file.
**Phase 2 (later):** The owner will swap `SAMPLE_SESSIONS` for real session data
piped in from `useTypingEngine`. No other changes required — the component must
be data-source agnostic.

---

### Step 1 — Create `src/sampleData.js`

Create this file first. It is the only file that changes between Phase 1 and Phase 2.

```js
// src/sampleData.js
// PHASE 1: sample data for development and hackathon demo.
// PHASE 2: delete this file and pipe real sessionHistory from useTypingEngine.

export const SAMPLE_SESSIONS = [
  { session: 1,  wpm: 22, accuracy: 74.2, duration: 88, letterPool: ['a','s','d','f','j','k'],             errors: { f:5, j:4, k:3, d:2, s:1 } },
  { session: 2,  wpm: 25, accuracy: 77.8, duration: 81, letterPool: ['a','s','d','f','j','k'],             errors: { f:4, j:3, k:3, d:2, a:1 } },
  { session: 3,  wpm: 24, accuracy: 79.1, duration: 95, letterPool: ['a','s','d','f','j','k','e','i'],     errors: { j:5, e:4, i:3, f:2, k:1 } },
  { session: 4,  wpm: 29, accuracy: 81.5, duration: 76, letterPool: ['a','s','d','f','j','k','e','i'],     errors: { e:4, i:4, j:2, f:2, k:1 } },
  { session: 5,  wpm: 31, accuracy: 83.0, duration: 70, letterPool: ['a','s','d','f','j','k','e','i','r','t'], errors: { r:6, t:5, e:3, i:2, j:1 } },
  { session: 6,  wpm: 28, accuracy: 80.3, duration: 85, letterPool: ['a','s','d','f','j','k','e','i','r','t'], errors: { r:5, t:4, e:3, f:2, i:1 } },
  { session: 7,  wpm: 34, accuracy: 85.7, duration: 68, letterPool: ['a','s','d','f','j','k','e','i','r','t'], errors: { t:4, r:3, e:2, i:2, j:1 } },
  { session: 8,  wpm: 37, accuracy: 87.2, duration: 62, letterPool: ['a','s','d','f','j','k','e','i','r','t','n','o'], errors: { n:5, o:4, t:2, r:2, e:1 } },
  { session: 9,  wpm: 36, accuracy: 88.0, duration: 65, letterPool: ['a','s','d','f','j','k','e','i','r','t','n','o'], errors: { n:4, o:3, t:2, r:1, e:1 } },
  { session: 10, wpm: 41, accuracy: 90.1, duration: 58, letterPool: ['a','s','d','f','j','k','e','i','r','t','n','o'], errors: { n:3, o:2, t:2, r:1, e:1 } },
];

// Each session shape — this is the contract. Do not change field names.
// {
//   session:    number      — 1-indexed session number
//   wpm:        number      — words per minute (integer)
//   accuracy:   number      — percentage, 1 decimal place, 0-100
//   duration:   number      — seconds taken to complete the lesson
//   letterPool: string[]    — active letter pool at end of this session
//   errors:     { [key: string]: number }  — per-key error count for the session
// }
```

---

### Step 2 — Create `src/ProgressCharts.jsx`

```jsx
// src/ProgressCharts.jsx
import { SAMPLE_SESSIONS } from './sampleData.js';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

// -------------------------------------------------------------------
// PHASE 2 SWAP POINT
// When real data is available, the parent component passes sessionHistory
// as a prop. Until then, the prop falls back to SAMPLE_SESSIONS.
// Change nothing else — just stop passing the fallback from the parent.
// -------------------------------------------------------------------

export default function ProgressCharts({ sessionHistory = SAMPLE_SESSIONS }) {

  if (!sessionHistory || sessionHistory.length < 2) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontSize: '14px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: '12px',
      }}>
        Complete at least 2 lessons to see your progress.
      </div>
    );
  }

  // ── Derived statistics ──────────────────────────────────────────

  const wpms        = sessionHistory.map(s => s.wpm);
  const accs        = sessionHistory.map(s => s.accuracy);
  const durations   = sessionHistory.map(s => s.duration);

  const avgWpm      = Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length);
  const bestWpm     = Math.max(...wpms);
  const latestWpm   = wpms[wpms.length - 1];
  const wpmTrend    = latestWpm - wpms[0];

  const avgAcc      = (accs.reduce((a, b) => a + b, 0) / accs.length).toFixed(1);
  const latestAcc   = accs[accs.length - 1].toFixed(1);

  const totalMins   = Math.round(durations.reduce((a, b) => a + b, 0) / 60);

  // Consistency: 100 minus coefficient of variation (lower variance = higher score)
  const variance    = wpms.map(w => (w - avgWpm) ** 2).reduce((a, b) => a + b, 0) / wpms.length;
  const consistency = Math.max(0, Math.round(100 - (Math.sqrt(variance) / avgWpm) * 100));

  // Per-key error totals across all sessions
  const errorTotals = {};
  sessionHistory.forEach(s => {
    Object.entries(s.errors || {}).forEach(([key, count]) => {
      errorTotals[key] = (errorTotals[key] || 0) + count;
    });
  });
  const worstKeys = Object.entries(errorTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, count]) => ({ key, count }));

  // Letter pool size over time
  const poolGrowth = sessionHistory.map(s => ({
    session: `S${s.session}`,
    poolSize: s.letterPool.length,
  }));

  // Auto-generated insight
  let insight = '';
  if (wpmTrend > 8)       insight = `Strong improvement — up ${wpmTrend} WPM over ${sessionHistory.length} sessions.`;
  else if (wpmTrend < 0)  insight = `WPM dipped slightly. Try slowing down to improve accuracy first.`;
  else                    insight = `Steady progress. `;
  if (worstKeys[0])       insight += ` Focus on the '${worstKeys[0].key}' key — highest error count.`;
  if (parseFloat(latestAcc) < 85) insight += ` Accuracy below 85% — prioritise precision over speed.`;

  // ── Chart data ──────────────────────────────────────────────────

  const comboData = sessionHistory.map(s => ({
    session: `S${s.session}`,
    wpm:     s.wpm,
    acc:     s.accuracy,
  }));

  // ── Styles (inline — no external CSS needed) ───────────────────

  const card = {
    background: 'var(--color-background-primary)',
    border: '0.5px solid var(--color-border-tertiary)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
  };

  const metricGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
    marginBottom: '1.25rem',
  };

  const metric = {
    background: 'var(--color-background-secondary)',
    borderRadius: '8px',
    padding: '12px 14px',
  };

  const sectionLabel = {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '1.25rem 0 0.5rem',
  };

  return (
    <div>

      {/* ── Summary metrics ── */}
      <div style={metricGrid}>
        {[
          { label: 'Latest WPM',   value: latestWpm,  sub: `${wpmTrend >= 0 ? '+' : ''}${wpmTrend} from session 1` },
          { label: 'Best WPM',     value: bestWpm,    sub: `session ${wpms.indexOf(bestWpm) + 1}` },
          { label: 'Avg accuracy', value: `${avgAcc}%`, sub: `latest ${latestAcc}%` },
          { label: 'Consistency',  value: `${consistency}%`, sub: 'lower variance = higher' },
          { label: 'Practice time', value: `${totalMins}m`, sub: `${sessionHistory.length} sessions` },
        ].map(m => (
          <div key={m.label} style={metric}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{m.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{m.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '3px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Insight ── */}
      <div style={{
        borderLeft: '3px solid #378ADD',
        padding: '10px 14px',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        marginBottom: '1.25rem',
      }}>
        {insight}
      </div>

      {/* ── WPM + Accuracy trend ── */}
      <div style={sectionLabel}>Speed &amp; accuracy over sessions</div>
      <div style={{ ...card, padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#378ADD', marginRight: 5 }} />WPM</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#1D9E75', marginRight: 5 }} />Accuracy %</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={comboData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis dataKey="session" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="wpm" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <YAxis yAxisId="acc" orientation="right" domain={[50, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(val, name) => name === 'acc' ? `${val}%` : `${val} wpm`} />
            <ReferenceLine yAxisId="wpm" y={avgWpm} stroke="#378ADD" strokeDasharray="4 3" strokeOpacity={0.4} />
            <Line yAxisId="wpm" type="monotone" dataKey="wpm" stroke="#378ADD" strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="acc" type="monotone" dataKey="acc" stroke="#1D9E75" strokeWidth={1.5} strokeDasharray="5 4" dot={{ r: 3, shape: 'square' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Per-key error bar chart ── */}
      <div style={sectionLabel}>Worst keys (cumulative errors)</div>
      <div style={{ ...card, padding: '1rem' }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={worstKeys} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis dataKey="key" tick={{ fontSize: 13, fontFamily: 'monospace' }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#E24B4A" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Letter pool growth ── */}
      <div style={sectionLabel}>Letter pool size over time</div>
      <div style={{ ...card, padding: '1rem' }}>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={poolGrowth} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis dataKey="session" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} label={{ value: 'letters', angle: -90, position: 'insideLeft', fontSize: 11, fill: 'var(--color-text-secondary)' }} />
            <Tooltip formatter={v => [`${v} letters`, 'pool size']} />
            <Line type="stepAfter" dataKey="poolSize" stroke="#9FE1CB" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
```

---

### Step 3 — Wire into `KeybrClone.jsx` (for the refinery)

In `KeybrClone.jsx`, import and use the component. During Phase 1 no props
are needed — it runs on sample data by default:

```jsx
import ProgressCharts from './ProgressCharts.jsx';

// Inside your JSX:
<ProgressCharts />
```

For Phase 2 (real data), pass the session history array built up during play:

```jsx
<ProgressCharts sessionHistory={sessionHistory} />
```

Where `sessionHistory` is a `useState` array that the parent pushes to on
every `isComplete` transition from `useTypingEngine`:

```js
const [sessionHistory, setSessionHistory] = useState([]);

useEffect(() => {
  if (isComplete) {
    setSessionHistory(prev => [...prev, {
      session:    prev.length + 1,
      wpm,
      accuracy,
      duration:   elapsedSeconds,
      letterPool,
      errors,
    }]);
  }
}, [isComplete]);
```

---

### Completion criteria

- [ ] `src/sampleData.js` exists and exports `SAMPLE_SESSIONS` with 10 sessions
- [ ] `src/ProgressCharts.jsx` renders without errors using sample data
- [ ] All 4 sections render: summary metrics, trend chart, error bar chart, pool growth chart
- [ ] The insight string is non-empty and references real derived values
- [ ] Component accepts `sessionHistory` prop and uses it when provided
- [ ] Placeholder renders correctly when `sessionHistory.length < 2`
- [ ] Commit: `feat(keybr): kb-00005 ProgressCharts complete`
- [ ] Run `gt done`