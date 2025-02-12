import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default LoadingSpinner; 