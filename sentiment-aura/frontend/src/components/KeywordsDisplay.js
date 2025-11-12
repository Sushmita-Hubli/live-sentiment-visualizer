import React, { useState, useEffect } from 'react';
import './KeywordsDisplay.css';

const KeywordsDisplay = ({ keywords }) => {
  const [visibleKeywords, setVisibleKeywords] = useState([]);
  
  useEffect(() => {
    setVisibleKeywords([]);
    keywords.forEach((keyword, index) => {
      setTimeout(() => {
        setVisibleKeywords(prev => [...prev, keyword]);
      }, index * 300);
    });
  }, [keywords]);
  
  return (
    <div className="keywords-container">
      <h3>Keywords</h3>
      <div className="keywords-list">
        {visibleKeywords.map((keyword, index) => (
          <span key={index} className="keyword-tag">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeywordsDisplay;