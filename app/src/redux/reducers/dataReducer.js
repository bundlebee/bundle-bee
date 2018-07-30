const initialState = [];
import * as types from '../actions/actionConstants.js';

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_RESULT: {
      return state.slice().concat(action.payload);
    }
    default: {
      return state;
    }
  }
};

export default dataReducer;
