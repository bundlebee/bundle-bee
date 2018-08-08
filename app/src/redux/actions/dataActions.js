import * as types from './actionConstants.js';
import * as d3 from 'd3';
import { parseWebpackOutput, parseParcelOutput, parseRollupOutput } from '../../utils/jsonParser.js';

export const retrieveWebpackStats = () => {
  return function(dispatch) {
    d3.json('../electronUserData/webpackStats.json')
      .then(function(data) {
        console.log(data);

        // TODO do parsing here!
         const hierarchicalData = parseWebpackOutput(data);
         console.log(hierarchicalData, "PARSED");

        dispatch({ type: types.BUNDLE_COMPLETE, payload: data }); //
      })
      .catch(function(error) {
        alert('error:');
        console.log(error);
      });
  };
};



export const retrieveParcelStats = () => {
  return function(dispatch) {
    d3.json('../electronUserData/parcelStats.json')
    .then(function(data) {
      console.log(data);
      dispatch({ type: types.BUNDLE_PARCEL_COMPLETE, payload: data });
    })
    .catch(function(error) {
      alert('error:');
      console.log(error);
    });
  };
};

export const retrieveRollupStats = () => {
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

// export const retrieveCompilationStats = () => {
//   return function(dispatch) {
//     d3.json('../electronUserData/stats.json')
//       .then(function(data) {
//         console.log(data);
//         dispatch({ type: types.BUNDLE_COMPLETE, payload: data });
//       })
//       .catch(function(error) {
//         alert('error:');
//         console.log(error);
//       });
//   };
// };
