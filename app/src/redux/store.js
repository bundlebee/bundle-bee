import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import homeReducer from './reducers/homeReducer.js';

export default () => {
    const store = createStore(
        combineReducers({
            home: homeReducer
        }),
        composeWithDevTools(applyMiddleware(thunk))
    );

    return store;
};