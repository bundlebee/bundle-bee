import React, { Component } from 'react';
import './main.sass';
import D3StarBurstChart from './data_viz/D3StarBurstChart.jsx';
import D3BarChart from './data_viz/D3BarChart.jsx';

//Does this need to be a class component?
export class Chart extends Component {
  render() {
    return (
      <div className="chart">
        <D3StarBurstChart />
        {/* <D3BarChart /> */}
      </div>
    )
  }
};

//Seems to be two export statements?
export default Chart;