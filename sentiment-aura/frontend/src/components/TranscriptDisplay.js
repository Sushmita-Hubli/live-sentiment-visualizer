import React, { useEffect, useRef } from 'react';
import './TranscriptDisplay.css';

const TranscriptDisplay = ({ transcript }) => {
  const transcriptRef = useRef(null);
  
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);
  
  return (
    <div className="transcript-container">
      <h3>Live Transcript</h3>
      <div className="transcript-content" ref={transcriptRef}>
        {transcript || "Waiting for speech..."}
      </div>
    </div>
  );
};

export default TranscriptDisplay;