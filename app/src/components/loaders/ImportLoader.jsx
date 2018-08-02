import React from 'react';

export default () => {
  return (
    <div id="loading-circle">
      <svg width="150" height="150" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-ripple">
        <circle cx="50" cy="50" r="39.3" fill="none" stroke-width="8" stroke="#93dbe9">
          <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1" keySplines="0 0.2 0.8 1" begin="-0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" calcMode="spline" values="2
          ;0" keyTimes="0;1" dur="1" keySplines="0.2 0 0.8 1" begin="-0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="23.4" fill="none" stroke-width="8" stroke="#689cc5">
          <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite" />
          <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1" keySplines="0.2 0 0.8 1" begin="0s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
};
