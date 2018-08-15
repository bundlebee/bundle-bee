import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import OpenFolderButtons from '../OpenFolderButtons.jsx';


class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.instantiateBarGraph();
  }
  instantiateBarGraph() {

// console.log(mouseleave, mouseover)
    
    var margin = { top: 20, right: 40, bottom: 30, left: 40 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var x0 = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1);
    var x1 = d3.scaleOrdinal();

    var y0 = d3.scaleLinear().range([height, 0]);
    var y1 = d3.scaleLinear().range([height, 0]);

    var color = d3.scaleOrdinal().range(['#98abc5', '#d0743c']);

    var xAxis = d3.axisBottom(x0).ticks(5);

    var yAxisLeft = d3.axisLeft(y0).tickFormat(function(d) {
      return parseInt(d);
    });

    var yAxisRight = d3.axisRight(y1).tickFormat(function(d) {
      return parseInt(d);
    });
    var svg = d3
      .select('.bar-chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    // var data = {
    //   Webpack: { times: 1, sizes: 2 },
    //   Rollup: { times: 3, sizes: 5 },
    //   Parcel: { times: 2, sizes: 4 },
    // };
    var data = {
      Webpack: { times: this.props.webpackData.time, sizes: this.props.webpackData.size },
      Parcel: { times: this.props.parcelData.time, sizes: this.props.parcelData.size },
      Rollup: { times: this.props.rollupData.time, sizes: this.props.rollupData.size },
    };

    const  mouseleave = d => {
      d3.selectAll(".d3_tooltip_bar_chart").remove();

    }
    var x =0;
    const  mouseover = d => {
      d3.selectAll(".d3_tooltip_bar_chart").remove();

      console.log(x)
      var tooltip = d3
        .select(".barchart_inner")
        .append("div")
        .attr("class", "d3_tooltip_bar_chart");
      tooltip.append("span");
      tooltip.append("span").attr("id", "sb_d3_details");

      tooltip
        .style("top", d3.event.layerY + "px")
        .style("left", d3.event.layerX + "px");

      console.log(d3.event.layerY ,  d3.event.layerX )
      console.log(d, "I want the this variable")
      tooltip.select("#sb_d3_details").html(
        `
        <strong>${d.name}:</strong> ${d.value} 
        ${d.name === 'Size' ? 'kb' : 'ms'}<br />
        `
      );
    }
    console.log('TOTALS',data);
    var dataset = [];

    var keyNames = ['times', 'sizes'];

    for (let i = 0; i < Object.keys(data).length; i++) {
      var bundler = Object.keys(data)[i];
      dataset[i] = {
        bundler,
        values: [
          { name: 'Time', value: data[bundler][keyNames[0]] },
          { name: 'Size', value: data[bundler][keyNames[1]]/1000 },
        ],
      };
    }

    x0.domain(
      dataset.map(function(d) {
        return d.bundler;
      })
    );
    x1.domain(['Time', 'Size']).range([0, 20]);

    y0.domain([
      0,
      d3.max(dataset, function(d) {
        return d.values[0].value;
      }),
    ]);
    y1.domain([
      0,
      d3.max(dataset, function(d) {
        return d.values[1].value;
      }),
    ]);

    // Ticks on x-axis and y-axis
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg
      .append('g')
      .attr('class', 'y0 axis')
      .call(yAxisLeft)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .style('fill', '#98abc5')
      .text('Time');

    svg
      .select('.y0.axis')
      .selectAll('.tick')
      .style('fill', '#98abc5');

    svg
      .append('g')
      .attr('class', 'y1 axis')
      .attr('transform', 'translate(' + width + ',0)')
      .call(yAxisRight)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -16)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .style('fill', '#d0743c')
      .text('Size');

    svg
      .select('.y1.axis')
      .selectAll('.tick')
      .style('fill', '#d0743c');
    // End ticks

    var graph = svg
      .selectAll('.date')
      .data(dataset)
      .enter()
      .append('g')
      .attr('class', 'g')
      .attr('transform', function(d) {
        console.log( x0(d.bundler) + 50, "x00000000000000000000")
        return 'translate(' + (x0(d.bundler) + 78) + ',0)';
      });

    graph
      .selectAll('rect')
      .data(function(d) {
        return d.values;
      })
      .enter()
      .append('rect')
      .attr('width', 22 /* x1.bandwidth() */)
      .attr('x', function(d) {
        return x1(d.name)-20;
      })
      .attr('y', function(d) {
        return y0(d.value);
      })
      .attr("height", 0)
        .transition()
        .delay(function (d, i) { return i*100; })
      .attr('height', function(d) {
        return height - y0(d.value);
      })
      .style('fill', function(d) {
        return color(d.name);
      })
      // .on('mouseover', mouseover)
      // 

      graph.selectAll('rect').on('mouseover', mouseover)
      .on('mouseover', mouseover)
      .on('mouseleave', mouseleave)
console.log(graph, "graph")

// console.log(d.name, d.values)
    // Legend
    var legend = svg
      .selectAll('.legend')
      .data(['Time (ms)', 'Size (kb)'].slice())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        return 'translate(-390,' + -(i * 20) + ')';
      });

    legend
      .append('rect')
      .attr('x', width - 48)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', width - 54)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function(d) {
        return d;
      });

 
  }

  render() {
    return (
      <div className="barchart ">
      <h2>Build Comparison</h2><br/> 
      <div className="barchart_inner ">
        <svg className="bar-chart" />
        <OpenFolderButtons dirname={this.props.dirname} />
      </div>

      </div>
    );
  }
}

const mapStateToProps = ({ data }) => ({
  webpackData: {
    size: data.webpackStarBurstData.total.totalBundleSize,
    time: data.webpackStarBurstData.total.totalElapsedTime,
  },
  parcelData: {
    size: data.parcelStarBurstData.total.totalBundleSize,
    time: data.parcelStarBurstData.total.totalElapsedTime,
  },
  rollupData: {
    size: data.rollupStarBurstData.total.totalBundleSize,
    time: data.rollupStarBurstData.total.totalElapsedTime,
  },
});
export default connect(mapStateToProps)(BarChart);
