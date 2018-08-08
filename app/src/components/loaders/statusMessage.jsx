
import React from 'react';

export default (props) => {
  return (
    <div className="loader">
      <div className="load">{props.loadingMessage}</div>
      <div className="progress">
        <span className="loading"></span>
      </div>
    </div>
  )
};
