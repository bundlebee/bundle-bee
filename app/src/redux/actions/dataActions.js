import * as types from './actionConstants.js';
import * as d3 from 'd3';

export const retrieveCompilationStats = () => {
  return function(dispatch) {
    d3.json('../electronUserData/stats.json')
      .then(function(data) {
        console.log(data);
        dispatch({ type: types.BUNDLE_COMPLETE, payload: data });
      })
      .catch(function(error) {
        alert('error:');
        console.log(error);
      });
  };
};
