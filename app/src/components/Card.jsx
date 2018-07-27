import React from 'react';
import '../styles.css';

export default () => {
  return (
    <div>
      <div className="container">
        <div className="card-container">
          <figure className="front">
            <h1>WEBPACK</h1>
            <p>Click to customize</p>
          </figure>
          <figure className="back">
            <h1>Custom Settings</h1>
            <button>Source Maps</button>
            <button>Tree Shaking</button>
            <button>Code Splitting</button>
            <button>Additional Plugins</button>
          </figure>
        </div>
      </div>
    </div>
  )
};
