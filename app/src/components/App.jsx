import React from 'react'
import Main from './Main.jsx';
import D3StarBurstChart from './data_viz/D3StarBurstChart.jsx';

export default () => {
  console.log('at app')
  return (
    <div className="testapp">
      app
      <D3StarBurstChart />
      <Main />
    </div>
  )

};
