const initialState = false;
import * as types from '../actions/actionConstants.js';

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_MODAL: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default modalReducer;
