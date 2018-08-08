import * as types from './actionConstants.js';

export const resetHome = () => ({
  type: types.RESET_HOME
});

export const loadModal = () => ({
  type: types.LOAD_MODAL
});

// will eventually need to take payload
export const showModal = () => ({
  type: types.SHOW_MODAL
});

export const loadBundle = () => ({
  type: types.LOAD_BUNDLE
});

// will eventually need to take payload
export const bundleComplete = () => ({
  type: types.BUNDLE_COMPLETE
});

// will eventually need to take payload
export const bundleWebpackComplete = () => ({
  type: types.BUNDLE_WEBPACK_COMPLETE
});

// will eventually need to take payload
export const bundleParcelComplete = () => ({
  type: types.BUNDLE_PARCEL_COMPLETE
});

// will eventually need to take payload
export const bundleRollupComplete = () => ({
  type: types.BUNDLE_ROLLUP_COMPLETE
});

