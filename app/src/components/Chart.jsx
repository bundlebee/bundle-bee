import React, { Component } from 'react';
import D3StarBurstChart from './data_viz/D3StarBurstChart.jsx';
import BarChart from './data_viz/BarChart.jsx';
import { connect } from 'react-redux';

import {
  displayWebpack,
  displayParcel,
  displayRollup,
  displayTotals,
} from '../redux/actions/chartActions.js';
import DisplayButton from './data_viz/helper_components/DisplayButton.jsx';

import * as chart from '../redux/constants/chartProperties.js';

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('props: ', this.props);
    return (
      <div className="">
        <nav className="tabs1" id="d3_bundle_type">
          <DisplayButton
            handleClick={this.props.displayWebpack}
            isHighligthed={this.props.chart.bundleType === chart.WEBPACK}
            isActive={this.props.data.webpackStarBurstData}
          >
            <img className="btn_icon" src="./assets/webpack_icon.png" />
            {"Webpack"}
          </DisplayButton>

          <DisplayButton
            handleClick={this.props.displayParcel}
            isHighligthed={this.props.chart.bundleType === chart.PARCEL}
            isActive={this.props.data.parcelStarBurstData}
          >
            <img className="btn_icon" src="./assets/parcel_icon.png" />
            {"Parcel"}
          </DisplayButton>

          <DisplayButton
            handleClick={this.props.displayRollup}
            isHighligthed={this.props.chart.bundleType === chart.ROLLUP}
            isActive={this.props.data.rollupStarBurstData}
          >
            <img className="btn_icon" src="./assets/rollup_icon.png" />
            {"Rollup"}
          </DisplayButton>
          <DisplayButton
          handleClick={this.props.displayTotals}
          isHighligthed={this.props.chart.bundleType === chart.TOTALS}
          isActive={this.props.dirname}
        >
           <img className="btn_icon" src="./assets/compare_all.png" />

          {'Totals'}
        </DisplayButton>
        </nav>

     {this.props.chart.bundleType === chart.TOTALS ? (
          <div>
            <BarChart dirname={this.props.dirname}
            bundleType={this.props.chart.bundleType} />
          </div>
        ) : (
          <div>
            <D3StarBurstChart dirname={this.props.dirname} />
            
            {/* && <OpenFolderButtons dirname={this.props.dirname} /> */}
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  displayWebpack: () => dispatch(displayWebpack()),
  displayParcel: () => dispatch(displayParcel()),
  displayRollup: () => dispatch(displayRollup()),
  displayTotals: () => dispatch(displayTotals()),
});

const mapStateToProps = state => ({ chart: state.chart, data: state.data });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart);
