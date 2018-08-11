import React from 'react';
import * as d3 from 'd3';

class BrenD3BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var svgWidth = 500;
    var svgHeight = 300;

    var svg = d3
      .select('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
    var barPadding = 5;
    var barWidth = svgWidth / dataset.length;

    var barChart = svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('y', d => svgHeight - d)
      .attr('height', d => d)
      .attr('width', barWidth - barPadding)
      .attr('transform', (d, i) => {
        var translate = [barWidth * i, 0];
        return 'translate(' + translate + ')';
      });

    return (
      <div>
        <h1>bren</h1>
        <svg className="bar-chart" />
      </div>
    );
  }
}

export default BrenD3BarChart;
