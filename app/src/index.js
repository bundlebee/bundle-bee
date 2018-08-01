import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';
import { Provider } from 'react-redux';
import configureStore from './redux/store.js';

import { ipcRenderer } from 'electron';
import { retrieveCompilationStats } from './redux/actions/dataActions';


import './global.css';

const store = configureStore();
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

// run store.dispatch() upon electron event
ipcRenderer.on('webpack-stats-results-json', (event) => {
  console.log('webpack results event:');
  console.log(event);
  store.dispatch(retrieveCompilationStats());
});

