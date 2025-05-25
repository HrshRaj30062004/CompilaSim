import React from 'react';

const phaseLabels = [
  "Lexical", "Syntax", "Semantic",
  "Intermediate Code", "Optimization", "Code Generation"
];

const PhaseControls = ({ onRunNext, currentPhase, onReset }) => {
  const label = currentPhase >= phaseLabels.length
    ? "✔ Done"
    : `Next: ${phaseLabels[currentPhase]}`;

  return (
    <div style={{ margin: "1rem 0" }}>
      <button
        onClick={onRunNext}
        disabled={currentPhase >= phaseLabels.length}
        style={{
          marginRight: '1rem',
          padding: '0.6rem 1.2rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {label}
      </button>

      <button
        onClick={onReset}
        style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: '#ff5555',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        🔄 Reset All
      </button>
    </div>
  );
};

export default PhaseControls;
