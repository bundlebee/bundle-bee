import * as types from '../actions/actionConstants.js';
import * as chart from '../constants/chartProperties.js';

const initialState = {
  screen: chart.SIZE
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DISPLAY_SIZES:
      return {screen: chart.SIZE};
    case types.DISPLAY_FACTORY_TIMES:
      return {screen: chart.FACTORY_TIME};
    case types.DISPLAY_BUILDING_TIMES:
      return {screen: chart.BUILDING_TIME};
    default:
      return state;
  }
};

export default homeReducer;

