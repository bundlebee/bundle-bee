const initialState = { 
  webpackStarBurstData: null,
  parcelStarBurstData: null,
  rollupStarBurstData: null
};

import * as types from '../actions/actionConstants.js';

const dataReducer = (state = initialState, action) => {
  // console.log(state, "SB DATA~~~~")
  switch (action.type) {
    case types.BUNDLE_WEBPACK_COMPLETE: {
      return { ... state, webpackStarBurstData: action.payload };
   }
    case types.BUNDLE_PARCEL_COMPLETE: {
      console.log('bundle parcel complete');
      console.log(action.payload);
      return {... state,  parcelStarBurstData: action.payload };
 }   
    case types.BUNDLE_ROLLUP_COMPLETE: {
       return {... state,  rollupStarBurstData: action.payload };
}   
    default: {
      return state;
    }
  }
};

export default dataReducer;
