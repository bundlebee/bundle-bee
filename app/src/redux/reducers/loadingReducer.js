const initialState = false;
import * as types from '../actions/actionConstants.js';

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.IS_LOADING: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default loadingReducer;
