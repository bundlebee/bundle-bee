import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import resultsReducer from './reducers/resultsReducer.js';
import loadingReducer from './reducers/loadingReducer.js';
import modalReducer from './reducers/modalReducer.js';

export default () => {
    const store = createStore(
        combineReducers({
            results: resultsReducer,
            loading: loadingReducer,
            showModal: modalReducer
        }),
        composeWithDevTools(applyMiddleware(thunk))
    );

    return store;
};