
// const barData = require('../../../build/data_source/d3_bar_graph.csv');

import React from 'react';
import * as d3 from 'd3';
class D3BarChart extends React.Component {
  componentDidMount() {
    this.instantiateStarburstChart();
  }

  componentDidUpdate() {
    // d3.select(this.svg).selectAll("g").remove();
    this.instantiateStarburstChart();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // only re-render if the data will change
  //   // return !lodash_isEqual(nextProps.data, this.props.data);
  // }

  instantiateStarburstChart() {
    /*
      D3 code 
    */
   var svg = d3.select("#svgBarGraph"),
   margin = {top: 20, right: 20, bottom: 30, left: 40},
   width = +svg.attr("width") - margin.left - margin.right,
   height = +svg.attr("height") - margin.top - margin.bottom,
   g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
   .rangeRound([0, width])
   .paddingInner(0.1);

var x1 = d3.scaleBand()
   .padding(0.05);

var y = d3.scaleLinear()
   .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv(barData,
 function(d, i, columns) {
 console.log(d, "~");
 for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
 return d;
}, function(error, data) {
 if (error) throw error;

 var keys = data.columns.slice(1);
 console.log(keys, "KEYZ")

 x0.domain(data.map(function(d) { return d.Properties; }));
 x1.domain(keys).rangeRound([0, x0.bandwidth()]);
 y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

 g.append("g")
   .selectAll("g")
   .data(data)
   .enter().append("g")
     .attr("transform", function(d) { return "translate(" + x0(d.Properties) + ",0)"; })
   .selectAll("rect")
   .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
   .enter().append("rect")
     .attr("x", function(d) { return x1(d.key); })
     .attr("y", function(d) { return y(d.value); })
     .attr("width", x1.bandwidth())
     .attr("height", function(d) { return height - y(d.value); })
     .attr("fill", function(d) { return z(d.key); });

 g.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x0));

 g.append("g")
     .attr("class", "axis")
     .call(d3.axisLeft(y).ticks(null, "s"))
   .append("text")
     .attr("x", 2)
     .attr("y", y(y.ticks().pop()) + 0.5)
     .attr("dy", "0.32em")
     .attr("fill", "#000")
     .attr("font-weight", "bold")
     .attr("text-anchor", "start")
     // .text("Population");

 var legend = g.append("g")
     .attr("font-family", "sans-serif")
     .attr("font-size", 10)
     .attr("text-anchor", "end")
   .selectAll("g")
   .data(keys.slice().reverse())
   .enter().append("g")
     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

 legend.append("rect")
     .attr("x", width - 19)
     .attr("width", 19)
     .attr("height", 19)
     .attr("fill", z);

 legend.append("text")
     .attr("x", width - 24)
     .attr("y", 9.5)
     .attr("dy", "0.32em")
     .text(function(d) { return d; });
});



  }

  render() {
    return (
      <div>
        <div className="sb_d3_container">
        STARBURST
          <div className="sb_d3_box">
            <svg id="svgBarGraph" width={630} height={500} className="d3_starburst" ref={(elem) => { this.svg = elem; }}>
            </svg>


          </div>
        </div>
      </div>
    );
  }

 

}

export default D3BarChart;