import { useState, useEffect, useRef, useCallback } from 'react';

export function useTypingTest(text) {
  const [typed, setTyped]       = useState([]); // 'ok' | 'er' | null per char
  const [pos, setPos]           = useState(0);
  const [started, setStarted]   = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed]   = useState(0);   // seconds
  const [keyStats, setKeyStats]       = useState({});  // char → {a, c}
  const [transitions, setTransitions] = useState({});  // 'a|b' → count

  const startTime        = useRef(null);
  const timerRef         = useRef(null);
  const lastCorrectChar  = useRef(null);  // for bigram tracking

  // Reset whenever text changes
  useEffect(() => {
    clearInterval(timerRef.current);
    setTyped(new Array((text || '').length).fill(null));
    setPos(0);
    setStarted(false);
    setFinished(false);
    setElapsed(0);
    setKeyStats({});
    setTransitions({});
    startTime.current = null;
    lastCorrectChar.current = null;
  }, [text]);

  const handleKey = useCallback((key) => {
    if (finished || !text) return;

    // Before the test has started, only character keys can begin it
    if (!started) {
      if (key.length !== 1) return;   // ignore Backspace etc. before starting
      setStarted(true);
      startTime.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
      }, 250);
      // fall through — process this first character normally
    }

    if (key === 'Backspace') {
      setPos(p => {
        if (p === 0) return p;
        setTyped(t => { const n = [...t]; n[p - 1] = null; return n; });
        return p - 1;
      });
      return;
    }

    if (key.length !== 1) return;

    setPos(p => {
      if (p >= text.length) return p;
      const expected = text[p];
      const hit = key === expected;

      // Always record the attempt in key stats
      setKeyStats(ks => {
        const s = ks[expected] || { a: 0, c: 0 };
        return { ...ks, [expected]: { a: s.a + 1, c: s.c + (hit ? 1 : 0) } };
      });

      if (!hit) {
        // Wrong key — mark red but cursor stays on this character
        setTyped(t => { const n = [...t]; n[p] = 'er'; return n; });
        return p;
      }

      // Correct key — mark green only if no prior mistake on this character
      setTyped(t => {
        const n = [...t];
        if (n[p] === null) n[p] = 'ok'; // clean first attempt → green
        // if n[p] === 'er' leave it red — mistake was made
        return n;
      });

      // Track bigram: which key followed which (for transition arrows)
      const prev = lastCorrectChar.current;
      lastCorrectChar.current = expected;
      if (prev !== null) {
        const trKey = `${prev}|${expected}`;
        setTransitions(tr => ({ ...tr, [trKey]: (tr[trKey] || 0) + 1 }));
      }

      const nextPos = p + 1;
      if (nextPos === text.length) {
        clearInterval(timerRef.current);
        setFinished(true);
        setElapsed(Math.round((Date.now() - startTime.current) / 1000));
      }
      return nextPos;
    });
  }, [finished, started, text]);

  // Derived stats
  const correct  = typed.filter(t => t === 'ok').length;
  const total    = typed.filter(t => t !== null).length;
  const mins     = elapsed / 60;
  const wpm      = started && mins > 0 ? Math.round((correct / 5) / mins) : 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

  // Weak keys (accuracy < 85%, at least 2 attempts)
  const weakKeys = Object.entries(keyStats)
    .filter(([, v]) => v.a >= 2 && v.c / v.a < 0.85)
    .sort((a, b) => (a[1].c / a[1].a) - (b[1].c / b[1].a))
    .slice(0, 8)
    .map(([k]) => k);

  return {
    typed, pos, started, finished,
    elapsed, wpm, accuracy, keyStats, weakKeys, transitions,
    handleKey,
  };
}
