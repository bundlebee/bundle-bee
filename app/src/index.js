import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';
import { Provider } from 'react-redux';
import configureStore from './redux/store.js';


import './global.css';

const store = configureStore();



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

