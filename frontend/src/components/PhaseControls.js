import React from 'react';
import './PhaseControls.css';

const PhaseControls = ({ onRunNext, currentPhase, onReset }) => {
  const phases = [
    { name: "Lexical", icon: "🔤", color: "#4361ee" },
    { name: "Syntax", icon: "🌲", color: "#4895ef" },
    { name: "Semantic", icon: "📚", color: "#4cc9f0" },
    { name: "IR Gen", icon: "🔧", color: "#7209b7" },
    { name: "Optimize", icon: "⚡", color: "#f72585" },
    { name: "Codegen", icon: "⚙️", color: "#3a0ca3" }
  ];

  return (
    <div className="phase-controls-container">
      <div className="phase-progress">
        {phases.map((phase, idx) => (
          <React.Fragment key={idx}>
            <div 
              className={`phase-step ${idx < currentPhase ? 'completed' : ''} ${idx === currentPhase ? 'active' : ''}`}
              style={{ '--phase-color': phase.color }}
            >
              <div className="phase-icon">{phase.icon}</div>
              <div className="phase-name">{phase.name}</div>
            </div>
            {idx < phases.length - 1 && (
              <div className={`progress-connector ${idx < currentPhase ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="action-buttons">
        <button
          onClick={onRunNext}
          disabled={currentPhase >= phases.length}
          className="next-button"
        >
          {currentPhase >= phases.length ? 'Compilation Complete!' : `Run ${phases[currentPhase].name}`}
          <span className="button-icon">→</span>
        </button>
        
        <button
          onClick={onReset}
          className="reset-button"
        >
          Reset
          <span className="button-icon">↻</span>
        </button>
      </div>
    </div>
  );
};

export default PhaseControls;