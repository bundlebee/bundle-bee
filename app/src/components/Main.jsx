import React, { Component } from 'react';
import DropZone from './DropZone.jsx';
import './main.sass';
import Chart from './Chart.jsx';

export class Main extends Component { 
  render() {
    return (
      <div>
        <DropZone>
          <div>
            <h1>Drop your entry file anywhere to get started</h1>
          </div>
        </DropZone>

        <Chart />
            </div>
    )
  }
};

export default Main;