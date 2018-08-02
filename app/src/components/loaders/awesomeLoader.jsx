import React from 'react';

export default () => {
  const c1 = 'fill: none; stroke-width: 8; stroke: #93dbe9;';
  const c2 = 'fill: none; stroke-width: 8; stroke: #689cc5;';
  const styles = {
    content: {
      left: 40,
      position: 'absolute',
      top: 40
    }
  }

  return (
    <div id="loading-circle" style={styles}>
      <svg xmlns="http://www.w3.org/2000/svg"
        width="50" height="60"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className="lds-ripple"
        background="none">
        <circle cx="50" cy="50" r="39.3" ng-attr-stroke="{{config.c1}}" ng-attr-stroke-width="{{config.width}}" style={c1}>
          <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1" keySplines="0 0.2 0.8 1" begin="-0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1" keySplines="0.2 0 0.8 1" begin="-0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="23.4" ng-attr-stroke="{{config.c2}}" ng-attr-stroke-width="{{config.width}}" style={}>
          <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite" />
          <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1" keySplines="0.2 0 0.8 1" begin="0s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
};
