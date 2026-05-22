import { useState, useEffect, useRef, useCallback } from 'react';
import { useTypingTest } from '../hooks/useTypingTest.js';
import { generateText } from '../utils/textGenerator.js';
import { fetchPracticeText, submitResult } from '../services/api.js';
import Keyboard from './Keyboard.jsx';
import Results from './Results.jsx';

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function TypingTest({
  difficulty = 'medium', wordList = 'common', font = 'mono',
  theme = 'dark', isFullscreen = false,
  onResult, onToggleTheme, onCycleFont, onToggleFullscreen,
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
        const t = await fetchPracticeText();
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
    onResult?.({ wpm, accuracy, difficulty });
    submitResult({ wpm, accuracy, elapsed, keyStats, weakKeys })
      .catch(() => {});
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') { e.preventDefault(); return; }
    if (e.key === 'Backspace') e.preventDefault();
    handleKey(e.key);
    if (e.key.length === 1 || e.key === 'Backspace') {
      setPressedKey(e.key);
      setTimeout(() => setPressedKey(null), 90);
    }
  }, [handleKey]);

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
          <button className="ctrl-btn" onClick={onCycleFont} title="Change font">
            Aa
          </button>
          <button className="ctrl-btn" onClick={onToggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="ctrl-btn" onClick={onToggleFullscreen} title="Fullscreen">
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
          <button className="btn btn-ghost" onClick={() => setRefreshKey(k => k + 1)}>
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
