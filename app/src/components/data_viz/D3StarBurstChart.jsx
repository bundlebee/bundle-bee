
const starBurstData = require('../../../build/data_source/d3_webpack_starburst.json');

import React from 'react';
import * as d3 from 'd3';
class D3StarBurstChart extends React.Component {
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
  //  console.log('at renderer')
   var border=1;
   var bordercolor='black';


   // Dimensions of sunburst
   var width = 900;
   var height = 900;
   var radius = Math.min(width, height) / 2;
   var color = d3.scaleOrdinal()
   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

   //d3.scaleOrdinal(); // d3.category10()

   // Size our <svg> element, add a <g> element, and move translate 0,0 to the center of the element.
   var g = d3.select('#svgStarBurst')
       .attr('width', width)
       .attr('height', height)
       .append('g')
       .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
       .attr("border",border);
      //  console.log(g);
      //  console.log('at d3 starburst');

      
  // console.log(g, "G")

       // Create our sunburst data structure and size it.
   var partition = d3.partition()
       .size([2 * Math.PI, radius]);

   // Get the data from our JSON file
   console.log("before data")
  //  d3.json("http://clarizmariano.com/d3_webpack_starburst.json", function(error, nodeData) {
  //   console.log(nodeData, "at Node Data");
  //    console.log("after data")
  //   // d3.json("./json/stats.json", function(error, nodeData) {
  //       if (error) throw error;

       // Find the root node of our data, and begin sizing process.
       var global = d3.hierarchy(starBurstData)
           .sum(function (d) { return d.size});

    // console.log(nodeData[0].chunks[0].modules)
       // Calculate the sizes of each arc that we'll draw later.
       partition(global);
       var arc = d3.arc()
           .startAngle(function (d) { return d.x0 })
           .endAngle(function (d) { return d.x1 })
           .innerRadius(function (d) { return d.y0 })
           .outerRadius(function (d) { return d.y1 });


       // Add a <g> element for each node in thd data, then append <path> elements and draw lines based on the arc
       // variable calculations. Last, color the lines and the slices.
       g.selectAll('g')
           .data(global.descendants())
           .enter().append('g').attr("class", "node").append('path')
           .attr("display", function (d) { return d.depth ? null : "none"; })
           .attr("d", arc)
           .style('stroke', '#fff')
           .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); })
           .on("mouseover", mouseover);





// console.log("after json")
   function mouseover(d) {
        // remove later
   
          // Get total size of the tree = value of root node from partition.
        //   totalSize = path.datum().value;
          const totalSize = 20000; // bullshit placeholder
          var percentage = (100 * d.value / totalSize).toPrecision(3);
          var percentageString = percentage + "%";
          if (percentage < 0.1) {
            percentageString = "< 0.1%";
          }


    d3.select("#sb_d3_percentage")
      .text(percentageString);
    //ADDED FILE NAME-
    d3.select("#sb_d3_filename")
      .text(d.data.name)

    //ADDED FILE SIZE
    d3.select("#sb_d3_filesize")
      .text(d.value / 1000)

      //ADDED SPEED
    d3.select("#sb_d3_speed")
      .text(d.data.speed)

    d3.select("#sb_d3_explanation")
      .style("visibility", "");
   }
//    var d1 = document.getElementById('sample-1');
//    d1.insertAdjacentHTML('beforeend', '<div id="two">two</div>');


  }

  render() {
    return (
      <div>
        <div className="sb_d3_container">
        STARBURST
          <div className="sb_d3_box">
            <svg id ="svgStarBurst" width={630} height={500} className="d3_starburst" ref={(elem) => { this.svg = elem; }}>
            </svg>

         <div id="sb_d3_explanation">
          <span id="sb_d3_filename"></span><br />
          speed:<span id="sb_d3_speed"></span> <br />
          <span id="sb_d3_percentage"></span><br />
          of your bundle
            Size: <span id="sb_d3_filesize"></span> kb 
        </div>
          </div>
        </div>
      </div>
    );
  }

 

}

export default D3StarBurstChart;