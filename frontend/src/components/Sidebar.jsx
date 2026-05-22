import { useState } from 'react';

function Sidebar({ highScores = [], difficulty, wordList, onSettingsChange }) {
  const [tab, setTab]         = useState('signin');
  const [signin, setSignin]   = useState({ email: '', password: '' });
  const [signup, setSignup]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [signupError, setSignupError] = useState('');
  const [duration, setDuration] = useState(60);
  const [sound, setSound]       = useState(true);
  const [liveWpm, setLiveWpm]   = useState(true);

  const handleSignIn = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/signin
    console.log('sign in', signin);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setSignupError('');
    if (signup.password !== signup.confirm) {
      setSignupError('Passwords do not match.');
      return;
    }
    // TODO: POST /api/auth/signup
    console.log('sign up', signup);
  };

  return (
    <aside className="sidebar">

      {/* ── Brand ── */}
      <div className="sb-brand">
        <div className="sb-logo">T</div>
        <h1 className="sb-title">TypeQuest</h1>
      </div>

      {/* ── Auth panel ── */}
      <section className="sb-section">
        <div className="sb-tabs">
          <button
            className={`sb-tab${tab === 'signin' ? ' active' : ''}`}
            onClick={() => setTab('signin')}
          >Sign In</button>
          <button
            className={`sb-tab${tab === 'signup' ? ' active' : ''}`}
            onClick={() => setTab('signup')}
          >Sign Up</button>
        </div>

        {tab === 'signin' ? (
          <form className="sb-form" onSubmit={handleSignIn}>
            <label className="sb-label">Email
              <input
                type="email" className="sb-input" required
                placeholder="you@example.com"
                value={signin.email}
                onChange={e => setSignin(p => ({ ...p, email: e.target.value }))}
              />
            </label>
            <label className="sb-label">Password
              <input
                type="password" className="sb-input" required
                placeholder="••••••••"
                value={signin.password}
                onChange={e => setSignin(p => ({ ...p, password: e.target.value }))}
              />
            </label>
            <button type="submit" className="sb-btn">Sign In</button>
          </form>
        ) : (
          <form className="sb-form" onSubmit={handleSignUp}>
            <label className="sb-label">Name
              <input
                type="text" className="sb-input" required
                placeholder="Your name"
                value={signup.name}
                onChange={e => setSignup(p => ({ ...p, name: e.target.value }))}
              />
            </label>
            <label className="sb-label">Email
              <input
                type="email" className="sb-input" required
                placeholder="you@example.com"
                value={signup.email}
                onChange={e => setSignup(p => ({ ...p, email: e.target.value }))}
              />
            </label>
            <label className="sb-label">Password
              <input
                type="password" className="sb-input" required minLength={6}
                placeholder="At least 6 characters"
                value={signup.password}
                onChange={e => setSignup(p => ({ ...p, password: e.target.value }))}
              />
            </label>
            <label className="sb-label">Confirm Password
              <input
                type="password" className="sb-input" required
                placeholder="Repeat your password"
                value={signup.confirm}
                onChange={e => setSignup(p => ({ ...p, confirm: e.target.value }))}
              />
            </label>
            {signupError && <p className="sb-error">{signupError}</p>}
            <button type="submit" className="sb-btn">Create Account</button>
          </form>
        )}
      </section>

      {/* ── High Scores ── */}
      <section className="sb-section">
        <h2 className="sb-section-title">Your High Scores</h2>
        <ul className="sb-scores">
          {highScores.length === 0 ? (
            <li className="sb-no-scores">No scores yet — play a round!</li>
          ) : (
            highScores.map((score, i) => (
              <li key={i} className="sb-score-item">
                <span className="sb-score-left">
                  <span className="sb-score-rank">{i + 1}.</span>
                  <span>{score.mode}</span>
                </span>
                <span>
                  <span className="sb-score-wpm">{score.wpm}</span>
                  <span className="sb-score-unit"> wpm</span>
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* ── Game Settings ── */}
      <section className="sb-section">
        <h2 className="sb-section-title">Game Settings</h2>

        {/* Difficulty */}
        <div className="sb-setting">
          <label className="sb-setting-label">Difficulty</label>
          <div className="sb-difficulty">
            {['Easy', 'Medium', 'Hard'].map(level => (
              <button
                key={level}
                className={`sb-diff-btn${difficulty === level.toLowerCase() ? ' active' : ''}`}
                onClick={() => onSettingsChange({ difficulty: level.toLowerCase() })}
              >{level}</button>
            ))}
          </div>
        </div>

        {/* Word List */}
        <div className="sb-setting">
          <label className="sb-setting-label">Word List</label>
          <select
            className="sb-select"
            value={wordList}
            onChange={e => onSettingsChange({ wordList: e.target.value })}
          >
            <option value="common">Common English</option>
            <option value="programming">Programming Terms</option>
            <option value="quotes">Famous Quotes</option>
            <option value="numbers">Numbers &amp; Symbols</option>
          </select>
        </div>

        {/* Duration */}
        <div className="sb-setting">
          <label className="sb-setting-label">
            <span>Round Duration</span>
            <span className="sb-duration-val">{duration}s</span>
          </label>
          <input
            type="range" min="15" max="120" step="15"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="sb-range"
          />
        </div>

        {/* Toggles */}
        <label className="sb-toggle">
          <span>Sound effects</span>
          <input
            type="checkbox" className="sb-checkbox"
            checked={sound}
            onChange={e => setSound(e.target.checked)}
          />
        </label>
        <label className="sb-toggle">
          <span>Show live WPM</span>
          <input
            type="checkbox" className="sb-checkbox"
            checked={liveWpm}
            onChange={e => setLiveWpm(e.target.checked)}
          />
        </label>
      </section>

    </aside>
  );
}

export default Sidebar;
