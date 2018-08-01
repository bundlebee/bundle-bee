const mockStarBurstData = require('../../components/data_viz/compilation-stats.json');
const initialState = {starBurstData: mockStarBurstData};

import * as types from '../actions/actionConstants.js';

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.BUNDLE_COMPLETE: {
      return {starBurstData: action.payload};
    }
    default: {
      return state;
    }
  }
};

export default dataReducer;

