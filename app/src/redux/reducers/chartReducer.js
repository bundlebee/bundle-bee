import * as types from '../actions/actionConstants.js';
import * as chart from '../constants/chartProperties.js';

const initialState = {
  screen: chart.SIZE,
  bundleType: chart.WEBPACK
};

const chartReducer = (state = initialState, action) => {
  console.log("at chartReducer")
  console.log(state)
  let loadBuildingTime = state.screen;

  switch (action.type) {
    case types.DISPLAY_SIZES:
      // const screen = chart.SIZE;
      return {
        ...state,
        screen: chart.SIZE};
    case types.DISPLAY_FACTORY_TIMES:
      return { 
        ...state,
        screen: chart.FACTORY_TIME};
    case types.DISPLAY_BUILDING_TIMES:
      return {
        ...state,
        screen: chart.BUILDING_TIME};

      // set different bundleType
    case types.DISPLAY_WEBPACK:
      return {
        ...state,
        bundleType: chart.WEBPACK};
    case types.DISPLAY_PARCEL:
      if (state.screen === chart.FACTORY_TIME) {
        loadBuildingTime = chart.BUILDING_TIME;
      }
      return {
        ...state,
        bundleType: chart.PARCEL,
        screen: loadBuildingTime};
    case types.DISPLAY_ROLLUP:

      if (state.screen === chart.FACTORY_TIME) {
          loadBuildingTime = chart.BUILDING_TIME;
      }    
      return {
        ...state,
        bundleType: chart.ROLLUP,
        screen: loadBuildingTime};
    case types.DISPLAY_TOTALS:
      return {
        ...state,
        bundleType: chart.TOTALS};


      default:
      return state;
  }

};

export default chartReducer;

