import React from 'react';

const phaseLabels = [
  "Lexical", "Syntax", "Semantic",
  "Intermediate Code", "Optimization", "Code Generation"
];

const PhaseControls = ({ onRunNext, currentPhase }) => {
  const label = currentPhase >= phaseLabels.length
    ? "✔ Done"
    : `Next: ${phaseLabels[currentPhase]}`;

  return (
    <div style={{ margin: "1rem 0" }}>
      <button onClick={onRunNext} disabled={currentPhase >= phaseLabels.length}>
        {label}
      </button>
    </div>
  );
};

export default PhaseControls;
