import React from 'react';
import './Controls.css';

const Controls = ({ isRecording, onToggle }) => {
  return (
    <div className="controls-container">
      <button 
        className={`control-button ${isRecording ? 'recording' : ''}`}
        onClick={onToggle}
      >
        {isRecording ? (
          <>
            <span className="recording-indicator"></span>
            Stop Recording
          </>
        ) : (
          'Start Recording'
        )}
      </button>
    </div>
  );
};

export default Controls;