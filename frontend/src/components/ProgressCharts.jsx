import { SAMPLE_SESSIONS } from '../sampleData.js';
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

  const wpms      = sessionHistory.map(s => s.wpm);
  const accs      = sessionHistory.map(s => s.accuracy);
  const durations = sessionHistory.map(s => s.duration);

  const avgWpm    = Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length);
  const bestWpm   = Math.max(...wpms);
  const latestWpm = wpms[wpms.length - 1];
  const wpmTrend  = latestWpm - wpms[0];

  const avgAcc    = (accs.reduce((a, b) => a + b, 0) / accs.length).toFixed(1);
  const latestAcc = accs[accs.length - 1].toFixed(1);

  const totalMins = Math.round(durations.reduce((a, b) => a + b, 0) / 60);

  const variance    = wpms.map(w => (w - avgWpm) ** 2).reduce((a, b) => a + b, 0) / wpms.length;
  const consistency = Math.max(0, Math.round(100 - (Math.sqrt(variance) / avgWpm) * 100));

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

  const poolGrowth = sessionHistory.map(s => ({
    session: `S${s.session}`,
    poolSize: s.letterPool.length,
  }));

  let insight = '';
  if (wpmTrend > 8)       insight = `Strong improvement — up ${wpmTrend} WPM over ${sessionHistory.length} sessions.`;
  else if (wpmTrend < 0)  insight = `WPM dipped slightly. Try slowing down to improve accuracy first.`;
  else                    insight = `Steady progress.`;
  if (worstKeys[0])       insight += ` Focus on the '${worstKeys[0].key}' key — highest error count.`;
  if (parseFloat(latestAcc) < 85) insight += ` Accuracy below 85% — prioritise precision over speed.`;

  const comboData = sessionHistory.map(s => ({
    session: `S${s.session}`,
    wpm:     s.wpm,
    acc:     s.accuracy,
  }));

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

      <div style={{
        borderLeft: '3px solid #378ADD',
        padding: '10px 14px',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        marginBottom: '1.25rem',
      }}>
        {insight}
      </div>

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
