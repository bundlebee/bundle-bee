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
      console.log('bundle webpack complete');
      return { ... state, webpackStarBurstData: action.payload };
   }
    case types.BUNDLE_PARCEL_COMPLETE: {
      console.log('bundle parcel complete');
      return {... state,  parcelStarBurstData: action.payload };
 }   
    case types.BUNDLE_ROLLUP_COMPLETE: {
      console.log('bundle rollup complete');
      console.log(action.payload);
       return {... state,  rollupStarBurstData: action.payload };
}   
    default: {
      return state;
    }
  }
};

export default dataReducer;
