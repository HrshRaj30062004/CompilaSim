import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ currentPhase }) => {
  const phases = [
    'Lexical',
    'Syntax',
    'Semantic',
    'Intermediate',
    'Optimization',
    'CodeGen'
  ];

  return (
    <div className="progress-tracker">
      <div className="tracker-header">
        <h3>Compilation Progress</h3>
        <span>{currentPhase + 1}/{phases.length}</span>
      </div>
      <div className="phase-indicators">
        {phases.map((phase, index) => (
          <div 
            key={phase}
            className={`phase-indicator ${index <= currentPhase ? 'completed' : ''}`}
          >
            <div className="indicator-circle">
              {index < currentPhase ? '✓' : index + 1}
            </div>
            <div className="indicator-label">{phase}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;