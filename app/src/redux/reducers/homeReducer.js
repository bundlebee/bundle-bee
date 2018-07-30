import * as types from '../actions/actionConstants.js';
import * as home from '../constants/homeConstants.js';

const initialState = {
  screen: home.DIRECTORY_PENDING
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RESET_HOME:
      return {screen: home.DIRECTORY_PENDING};
    case types.LOAD_MODAL:
      return {screen: home.LOADING_MODAL};
    case types.SHOW_MODAL:
      return {screen: home.SHOW_MODAL};
    case types.LOAD_BUNDLE:
      return {screen: home.LOADING_BUNDLE};
    case types.BUNDLE_COMPLETE:
      return {screen: home.BUNDLE_COMPLETE};
    default:
      return state;
  }
};

export default homeReducer;

