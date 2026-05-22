function Results({ wpm, accuracy }) {
  return (
    <div className="results">
      <p>WPM: {wpm}</p>
      <p>Accuracy: {accuracy}%</p>
    </div>
  );
}

export default Results;
