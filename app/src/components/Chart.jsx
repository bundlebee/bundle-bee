import React, { Component } from 'react';
import D3StarBurstChart from './data_viz/D3StarBurstChart.jsx';

class Chart extends Component {
  render() {
    return (
      <div className="chart">
        <D3StarBurstChart />
      </div>
    )
  }
};

export default Chart;