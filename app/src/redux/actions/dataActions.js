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

        const parsedData = parseWebpackOutput(data, bundleDir);
        dispatch({ type: types.BUNDLE_WEBPACK_COMPLETE, payload: parsedData });
      })
      .catch(function(error) {
        alert('error:');
      });
  };
};

export const retrieveParcelStats = bundleDir => {
  return function(dispatch) {
    d3.json('../electronUserData/parcel-stats.json')
      .then(function(data) {

        const parsedData = parseParcelOutput(data, bundleDir);
        dispatch({ type: types.BUNDLE_PARCEL_COMPLETE, payload: parsedData });
      })
      .catch(function(error) {
        alert('error:');
      });
  };
};

export const retrieveRollupStats = bundleDir => {
  return function(dispatch) {
    Promise.all(
      ['../electronUserData/rollup-stats.json', '../electronUserData/rollup-totals-stats.json'].map(
        x => d3.json(x)
      )
    )
      .then(function(dataArray) {
        const data = {
          files: dataArray[0],
          totalElapsedTime: dataArray[1].totalElapsedTime,
          totalBundleSize: dataArray[1].totalBundleSize,
        };


        const parsedData = parseRollupOutput(data);

        dispatch({ type: types.BUNDLE_ROLLUP_COMPLETE, payload: parsedData });
      })
      .catch(function(error) {
        alert('error:');
      });
  };
};
