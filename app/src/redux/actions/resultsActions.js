import * as types from './actionConstants.js';

export const addResult = res => ({
  type: types.ADD_RESULT,
  payload: res,
});

export const isLoading = payload => ({
  type: types.IS_LOADING,
  payload
});

export const showModal = payload => ({
  type: types.SHOW_MODAL,
  payload
});
