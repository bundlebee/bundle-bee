import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import homeReducer from './reducers/homeReducer.js';
import chartReducer from './reducers/chartReducer.js';
import dataReducer from './reducers/dataReducer.js';


export default () => {
    const store = createStore(
        combineReducers({
            home: homeReducer,
            chart: chartReducer,
            data: dataReducer,
        }),
        composeWithDevTools(applyMiddleware(thunk))
    );

    return store;
};

