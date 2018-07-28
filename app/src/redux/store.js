import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import resultsReducer from './reducers/resultsReducer.js';

export default () => {
  const store = createStore(
    combineReducers({ results: resultsReducer }),
    composeWithDevTools(applyMiddleware(thunk))
  );

  return store;
};
