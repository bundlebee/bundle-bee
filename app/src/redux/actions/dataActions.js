import * as types from './actionConstants.js';
import * as d3 from 'd3';
import {
  parseWebpackOutput,
  parseParcelOutput,
  parseRollupOutput,
} from '../../utils/dataParser.js';

export const retrieveWebpackStats = bundleDir => {
  return function(dispatch) {
    d3.json('../electronUserData/stats.json')
      .then(function(data) {
        console.log(data);

        const parsedData = parseWebpackOutput(data, bundleDir);
        dispatch({ type: types.BUNDLE_WEBPACK_COMPLETE, payload: parsedData });
      })
      .catch(function(error) {
        alert('error:');
        console.log(error);
      });
  };
};

export const retrieveParcelStats = bundleDir => {
  return function(dispatch) {
    d3.json('../electronUserData/parcel-stats.json')
      .then(function(data) {
        console.log(data);

        const parsedData = parseParcelOutput(data, bundleDir);
        dispatch({ type: types.BUNDLE_PARCEL_COMPLETE, payload: parsedData });
      })
      .catch(function(error) {
        alert('error:');
        console.log(error);
      });
  };
};

export const retrieveRollupStats = bundleDir => {
  return function(dispatch) {
    d3.json('../electronUserData/rollupStats.json')
      .then(function(data) {
        console.log(data);
        dispatch({ type: types.BUNDLE_ROLLUP_COMPLETE, payload: data });
      })
      .catch(function(error) {
        alert('error:');
        console.log(error);
      });
  };
};
