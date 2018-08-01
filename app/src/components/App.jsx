import React from 'react'
import Main from './Main.jsx';

import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

const App = () => {
    return (
        <div className="testapp">
            <Main />
        </div>
    )
};


export default App;
