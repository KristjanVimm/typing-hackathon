import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TypingTest from './components/TypingTest.jsx';
import ProgressCharts from './components/ProgressCharts.jsx';
import './App.css';

const FONTS = ['mono', 'sans', 'serif'];

function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [wordList, setWordList]     = useState('common');
  const [highScores, setHighScores] = useState([]);
  const [theme, setTheme]           = useState('dark');
  const [fontIndex, setFontIndex]   = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Apply theme to root so CSS variables cascade everywhere
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keep fullscreen state in sync with the browser
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleTheme      = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const cycleFont        = () => setFontIndex(i => (i + 1) % FONTS.length);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleSettingsChange = ({ difficulty: d, wordList: w }) => {
    if (d !== undefined) setDifficulty(d);
    if (w !== undefined) setWordList(w);
  };

  const handleResult = ({ wpm, accuracy, elapsed, keyStats }) => {
    const mode = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    setHighScores(prev =>
      [...prev, { wpm, accuracy, mode }]
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 5)
    );
    // Build error map from keyStats for ProgressCharts
    const errors = {};
    Object.entries(keyStats || {}).forEach(([ch, s]) => {
      const wrong = s.a - s.c;
      if (wrong > 0) errors[ch] = wrong;
    });
    setSessionHistory(prev => [
      ...prev,
      {
        session:    prev.length + 1,
        wpm,
        accuracy,
        duration:   elapsed,
        errors,
        letterPool: Object.keys(keyStats || {}),
      },
    ]);
  };

  return (
    <div className="app-layout">
      <Sidebar
        highScores={highScores}
        difficulty={difficulty}
        wordList={wordList}
        onSettingsChange={handleSettingsChange}
      />
      <div className="right-panel">
        <TypingTest
          difficulty={difficulty}
          wordList={wordList}
          font={FONTS[fontIndex]}
          theme={theme}
          isFullscreen={isFullscreen}
          onResult={handleResult}
          onToggleTheme={toggleTheme}
          onCycleFont={cycleFont}
          onToggleFullscreen={toggleFullscreen}
        />
        <div className="charts-section">
          <ProgressCharts sessionHistory={sessionHistory} />
        </div>
      </div>
    </div>
  );
}

export default App;
