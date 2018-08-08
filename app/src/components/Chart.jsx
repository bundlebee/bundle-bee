import React, { Component } from "react";
import D3StarBurstChart from "./data_viz/D3StarBurstChart.jsx";
import { connect } from "react-redux";

import {
  displayWebpack,
  displayParcel,
  displayRollup
} from "../redux/actions/chartActions.js";
import DisplayButton from "./data_viz/helper_components/DisplayButton.jsx";

import * as chart from "../redux/constants/chartProperties.js";

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="chart">
        <DisplayButton
          handleClick={this.props.displayWebpack}
          isHighligthed={this.props.chart.bundleType === chart.WEBPACK}
          isActive={this.props.data.webpackStarBurstData}
        >
          {"Webpack"}
        </DisplayButton>
        <DisplayButton
          handleClick={this.props.displayParcel}
          isHighligthed={this.props.chart.bundleType === chart.PARCEL}
          isActive={this.props.data.parcelStarBurstData}
        >
          {"Parcel"}
        </DisplayButton>
        <DisplayButton
          handleClick={this.props.displayRollup}
          isHighligthed={this.props.chart.bundleType === chart.ROLLUP}
          isActive={this.props.data.rollupStarBurstData}
        >
          {"Rollup"}
        </DisplayButton>

        <D3StarBurstChart />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  displayWebpack: () => dispatch(displayWebpack()),
  displayParcel: () => dispatch(displayParcel()),
  displayRollup: () => dispatch(displayRollup())
});

const mapStateToProps = state => ({ chart: state.chart, data: state.data});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart);
