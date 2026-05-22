function Results({ show, wpm, accuracy, elapsed, weakKeys = [], onClose, onRetry }) {
  if (!show) return null;

  const m = Math.floor(elapsed / 60);
  const s = String(elapsed % 60).padStart(2, '0');
  const timeStr = `${m}:${s}`;

  return (
    <div className="overlay">
      <div className="results-card">
        <div className="results-title">🎉 Test complete</div>

        <div className="results-grid">
          <div className="res-item">
            <div className="res-val">{wpm}</div>
            <div className="res-lbl">WPM</div>
          </div>
          <div className="res-item">
            <div className="res-val g">{accuracy}%</div>
            <div className="res-lbl">Accuracy</div>
          </div>
          <div className="res-item">
            <div className="res-val p">{timeStr}</div>
            <div className="res-lbl">Time</div>
          </div>
        </div>

        {weakKeys.length > 0 && (
          <div className="weak-section">
            <div className="weak-title">Keys to practise</div>
            <div className="weak-list">
              {weakKeys.map((k, i) => (
                <span key={i} className="weak-badge">
                  {k === ' ' ? 'Space' : k}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="results-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onRetry}>Try again</button>
        </div>
      </div>
    </div>
  );
}

export default Results;
