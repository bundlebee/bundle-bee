import React, { Component } from 'react';
import D3StarBurstChart from './data_viz/D3StarBurstChart.jsx';
import D3BarChart from './data_viz/D3BarChart.jsx';

class Chart extends Component {
  render() {
    return (
      <div className="chart">
        <D3StarBurstChart />
        {/* <D3BarChart /> */}
      </div>
    )
  }
};

export default Chart;