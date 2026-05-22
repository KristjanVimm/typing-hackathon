import { useState, useEffect, useRef, useCallback } from 'react';
import { useTypingTest } from '../hooks/useTypingTest.js';
import { generateText } from '../utils/textGenerator.js';
import { fetchRandomWords, submitResult } from '../services/api.js';
import Keyboard from './Keyboard.jsx';
import Results from './Results.jsx';

const WORD_COUNT_BY_DIFFICULTY = { easy: 5, medium: 10, hard: 15 };
const LENGTH_BY_DIFFICULTY = {
  easy:   { minLength: 2, maxLength: 4 },
  medium: { minLength: 5, maxLength: 7 },
  hard:   { minLength: 8 },
};

function buildResultPayload({ text, typed, keyStats, wpm, accuracy, elapsed }) {
  const totalCharacters     = Object.values(keyStats).reduce((sum, s) => sum + s.a, 0);
  const correctCharacters   = Object.values(keyStats).reduce((sum, s) => sum + s.c, 0);
  const incorrectCharacters = totalCharacters - correctCharacters;
  const durationMs          = elapsed * 1000;
  const mins                = elapsed / 60;
  const rawWpm = mins > 0 ? Math.round((totalCharacters / 5) / mins) : 0;

  const words = text.split(/\s+/).filter(Boolean);
  let cursor = 0;
  let correctWords = 0;
  for (const w of words) {
    const start = text.indexOf(w, cursor);
    const end = start + w.length;
    cursor = end;
    let ok = true;
    for (let i = start; i < end; i++) {
      if (typed[i] !== 'ok') { ok = false; break; }
    }
    if (ok) correctWords++;
  }
  const totalWords     = words.length;
  const incorrectWords = totalWords - correctWords;

  const keyErrors = Object.entries(keyStats)
    .filter(([ch, s]) => ch.trim().length > 0 && s.a - s.c > 0)
    .map(([ch, s]) => ({ expectedChar: ch, typedChar: null, count: s.a - s.c }));

  return {
    wpm, rawWpm, accuracy, durationMs,
    totalCharacters, correctCharacters, incorrectCharacters,
    totalWords, correctWords, incorrectWords,
    wordAttempts: [],
    keyErrors,
  };
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function TypingTest({
  difficulty = 'medium', wordList = 'common', font = 'mono',
  theme = 'dark', isFullscreen = false,
  onResult, onResultSaved, onToggleTheme, onCycleFont, onToggleFullscreen,
}) {
  const [text, setText]           = useState('');
  const [loading, setLoading]     = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pressedKey, setPressedKey] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  const {
    typed, pos, started, finished,
    elapsed, wpm, accuracy, keyStats, weakKeys, transitions,
    handleKey,
  } = useTypingTest(text);

  // Load text whenever difficulty, wordList, or refreshKey changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setShowResults(false);

    (async () => {
      try {
        const count = WORD_COUNT_BY_DIFFICULTY[difficulty] ?? 25;
        const lengthRange = LENGTH_BY_DIFFICULTY[difficulty] ?? {};
        const t = await fetchRandomWords(count, lengthRange);
        if (!cancelled && t?.trim()) {
          setText(t.trim());
        } else {
          throw new Error('empty');
        }
      } catch {
        if (!cancelled) setText(generateText(difficulty));
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [difficulty, wordList, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show results, submit analytics and notify parent when test finishes
  useEffect(() => {
    if (!finished) return;
    setShowResults(true);
    const payload = buildResultPayload({ text, typed, keyStats, wpm, accuracy, elapsed });
    onResult?.({ wpm, accuracy, elapsed, keyStats, payload });
    submitResult(payload)
      .then(saved => onResultSaved?.(saved))
      .catch(() => {});
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback((e) => {
    if (finished && e.key === 'Enter') {
      e.preventDefault();
      setRefreshKey(k => k + 1);
      return;
    }
    if (e.key === 'Tab') { e.preventDefault(); return; }
    // Prevent spacebar page-scroll and backspace browser-back
    if (e.key === ' ' || e.key === 'Backspace') e.preventDefault();
    handleKey(e.key);
    if (e.key.length === 1 || e.key === 'Backspace') {
      setPressedKey(e.key);
      setTimeout(() => setPressedKey(null), 90);
    }
  }, [handleKey, finished]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="header">
        <div className="logo">type<span>test</span></div>
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value">{wpm}</div>
            <div className="stat-label">WPM</div>
          </div>
          <div className="stat-item acc">
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item time">
            <div className="stat-value">{formatTime(elapsed)}</div>
            <div className="stat-label">Time</div>
          </div>
        </div>
        <div className="header-controls">
          <button className="ctrl-btn" onClick={onCycleFont} onMouseDown={e => e.preventDefault()} title="Change font">
            Aa
          </button>
          <button className="ctrl-btn" onClick={onToggleTheme} onMouseDown={e => e.preventDefault()} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="ctrl-btn" onClick={onToggleFullscreen} onMouseDown={e => e.preventDefault()} title="Fullscreen">
            ⛶
          </button>
        </div>
      </header>

      {/* ── Fullscreen exit button ── */}
      {isFullscreen && (
        <button className="fullscreen-exit" onClick={onToggleFullscreen} title="Exit fullscreen">
          ✕
        </button>
      )}

      {/* ── Main ── */}
      <main className="main">
        <div className="toolbar">
          <span className="toolbar-mode">
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} · {wordList}
          </span>
          <button className="btn btn-ghost" onClick={() => setRefreshKey(k => k + 1)} onMouseDown={e => e.preventDefault()}>
            ↺ New text
          </button>
        </div>

        {/* ── Text display ── */}
        <div className={`text-display tf-${font}`} onClick={focusInput}>
          {loading ? (
            <span className="start-hint">Loading…</span>
          ) : (
            <>
              {text.split('').map((ch, i) => {
                let cls = 'ch ';
                if (i < pos) {
                  cls += typed[i] === 'ok' ? 'ch-correct' : 'ch-incorrect';
                } else if (i === pos) {
                  cls += typed[i] === 'er'
                    ? 'ch-incorrect ch-cursor'
                    : 'ch-pending ch-cursor';
                } else {
                  cls += 'ch-pending';
                }
                return (
                  <span key={i} className={cls}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                );
              })}
              {!started && (
                <span className="start-hint">Click here and start typing…</span>
              )}
            </>
          )}
        </div>

        <input
          ref={inputRef}
          className="hidden-input"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          readOnly
        />

        <Keyboard keyStats={keyStats} transitions={transitions} pressedKey={pressedKey} />
      </main>

      {/* ── Results overlay ── */}
      <Results
        show={showResults}
        wpm={wpm}
        accuracy={accuracy}
        elapsed={elapsed}
        weakKeys={weakKeys}
        onClose={() => setShowResults(false)}
        onRetry={() => setRefreshKey(k => k + 1)}
      />
    </div>
  );
}

export default TypingTest;
