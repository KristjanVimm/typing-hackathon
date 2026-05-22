import { useRef, useState, useLayoutEffect } from 'react';

const ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','=','Bksp'],
  ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['Caps','a','s','d','f','g','h','j','k','l',';',"'",'Enter'],
  ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
  ['Space'],
];

const WIDE = {
  Bksp: 'w2', Tab: 'w15', Caps: 'w175',
  Enter: 'w225', Shift: 'w25', Space: 'w6',
};

function getHeatClass(keyStats, k) {
  const ch = k === 'Space' ? ' ' : k.length === 1 ? k.toLowerCase() : null;
  if (!ch) return '';
  const s = keyStats[ch];
  if (!s || s.a === 0) return '';
  const r = s.c / s.a;
  if (r >= 0.95) return 'great';
  if (r >= 0.80) return 'good';
  if (r >= 0.60) return 'ok';
  return 'bad';
}

function isKeyPressed(pressedKey, k) {
  if (!pressedKey) return false;
  if (k === 'Space') return pressedKey === ' ';
  if (k === 'Bksp')  return pressedKey === 'Backspace';
  if (k.length === 1) return pressedKey.toLowerCase() === k.toLowerCase();
  return false;
}

// Pie slice from startAngle to endAngle (radians, 0 = 12 o'clock, clockwise)
function PieSlice({ cx, cy, r, startAngle, endAngle, fill }) {
  if (r < 2) return null;
  const span = endAngle - startAngle;

  // Full circle
  if (span >= 2 * Math.PI - 0.001) {
    return <circle cx={cx} cy={cy} r={r} fill={fill} opacity={0.75} />;
  }
  if (span <= 0.001) return null;

  const x1 = cx + r * Math.sin(startAngle);
  const y1 = cy - r * Math.cos(startAngle);
  const x2 = cx + r * Math.sin(endAngle);
  const y2 = cy - r * Math.cos(endAngle);
  const large = span > Math.PI ? 1 : 0;

  return (
    <path
      d={`M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`}
      fill={fill}
      opacity={0.75}
    />
  );
}

// Curved arrow between two key centres
function Arrow({ x1, y1, x2, y2, strokeWidth, opacity }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 5) return null;

  // Curve: offset midpoint perpendicular to the line
  const mx = (x1 + x2) / 2 - (dy / len) * 14;
  const my = (y1 + y2) / 2 + (dx / len) * 14;

  // Pull the endpoint back a little so the arrowhead sits on the key edge
  const shorten = 10;
  const ex = x2 - (dx / len) * shorten;
  const ey = y2 - (dy / len) * shorten;

  return (
    <path
      d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
      stroke="rgba(96,165,250,0.85)"
      strokeWidth={strokeWidth}
      fill="none"
      opacity={opacity}
      markerEnd="url(#arrowhead)"
    />
  );
}

function Keyboard({ keyStats = {}, transitions = {}, pressedKey = null }) {
  const containerRef = useRef(null);
  const keyEls       = useRef({});
  const [positions, setPositions] = useState({});

  // Measure key centre positions once after mount
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const base = containerRef.current.getBoundingClientRect();
    const pos = {};
    for (const [ch, el] of Object.entries(keyEls.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      pos[ch] = {
        cx: r.left - base.left + r.width  / 2,
        cy: r.top  - base.top  + r.height / 2,
      };
    }
    setPositions(pos);
  }, []);

  // Circle sizing
  const maxAttempts = Math.max(1, ...Object.values(keyStats).map(s => s.a));
  const MAX_R = 16, MIN_R = 4;

  // Top 8 transitions for arrows
  const topTrans = Object.entries(transitions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxTrans = topTrans[0]?.[1] || 1;

  const showOverlay = Object.keys(positions).length > 0 &&
    (Object.keys(keyStats).some(k => keyStats[k].a > 0) || topTrans.length > 0);

  return (
    <div className="keyboard" ref={containerRef} style={{ position: 'relative' }}>

      {/* ── Key rows ── */}
      {ROWS.map((row, ri) => (
        <div key={ri} className="key-row">
          {row.map((k, ki) => {
            const heat    = getHeatClass(keyStats, k);
            const pressed = isKeyPressed(pressedKey, k);
            const cls = ['key', WIDE[k], heat, pressed ? 'pressed' : '']
              .filter(Boolean).join(' ');
            const ch = k === 'Space' ? ' ' : k.length === 1 ? k.toLowerCase() : null;
            return (
              <div
                key={ki}
                className={cls}
                ref={ch ? el => { if (el) keyEls.current[ch] = el; } : undefined}
              >
                {k === 'Space' ? '' : k}
              </div>
            );
          })}
        </div>
      ))}

      {/* ── SVG overlay: circles + arrows ── */}
      {showOverlay && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="5"
              refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="rgba(96,165,250,0.85)" />
            </marker>
          </defs>

          {/* Transition arrows (drawn first so circles appear on top) */}
          {topTrans.map(([trKey, count]) => {
            const [from, to] = trKey.split('|');
            const p1 = positions[from];
            const p2 = positions[to];
            if (!p1 || !p2 || from === to) return null;
            const weight = count / maxTrans;
            return (
              <Arrow
                key={trKey}
                x1={p1.cx} y1={p1.cy}
                x2={p2.cx} y2={p2.cy}
                strokeWidth={1 + weight * 2.5}
                opacity={0.35 + weight * 0.5}
              />
            );
          })}

          {/* Key usage circles (pie: green = correct, red = incorrect) */}
          {Object.entries(keyStats).map(([ch, s]) => {
            if (s.a === 0) return null;
            const pos = positions[ch];
            if (!pos) return null;

            const r = MIN_R + (MAX_R - MIN_R) * Math.sqrt(s.a / maxAttempts);
            const correctAngle = (s.c / s.a) * 2 * Math.PI;

            return (
              <g key={ch}>
                {/* Green slice — correct attempts */}
                <PieSlice
                  cx={pos.cx} cy={pos.cy} r={r}
                  startAngle={0} endAngle={correctAngle}
                  fill="#22C55E"
                />
                {/* Red slice — incorrect attempts */}
                <PieSlice
                  cx={pos.cx} cy={pos.cy} r={r}
                  startAngle={correctAngle} endAngle={2 * Math.PI}
                  fill="#F87171"
                />
                {/* Outline */}
                <circle cx={pos.cx} cy={pos.cy} r={r}
                  fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.75} />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

export default Keyboard;
