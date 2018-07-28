let x = {
  "name": "Pikachu", "speed": 1000, "children": [{
      "name": "Pikachu",
      "speed": 1000,
      "children": [
          {"name": "X", "size": 1,"speed": 1000}, 
          {"name": "A1", "size": 1,"speed": 1000}, 
          {"name": "A1", "size": 2,"speed": 1000}, 
          {"name": "A1", "size": 4,"speed": 1000}, 
          {"name": "A1", "children": [
              {"name": "A1", "size": 1}, 
              {"name": "A1", "size": 1}, 
              {"name": "A1", "size": 2}, 
              {"name": "A1", "children": [
                  {"name": "A1", "size": 1,"speed": 1000}]}
          ]}, 
          {"name": "A1", "size": 4}, 
          {"name": "A1", "size": 8}, 
          {"name": "A1", "size": 4}, 
          {"name": "A1", "size": 4}, 
          {"name": "A1", "size": 4}, 
          {"name": "A1", "size": 4}, 
          {"name": "A2", "size": 4}]
  }, {
      "name": "Client","speed": 1000,
      "children": [{"name": "Sub B1", "size": 3}, {"name": "Sub B2", "size": 3}, {
          "name": "Sub B3", "size": 3}, {
          "name": "Sub B4", "size": 7}]
  }, {
      "name": "Webpack","speed": 1000,
      "children": [{"name": "Sub A1", "size": 80}, {"name": "Sub A2", 
          "children": [
              {"name": "A1", "size": 1}, 
              {"name": "A1", "size": 1}, 
              {"name": "A1", "size": 2}, 
              {"name": "A1", "size": 4}, 
              {"name": "A1", "children": [
                  {"name": "A1", "size": 1}, 
                  {"name": "A1", "size": 1}, 
                  {"name": "A1", "size": 2}, 
                  {"name": "A1", "children": [
                      {"name": "A1", "size": 1}]}
              ]}, 
              {"name": "A1", "size": 4}, 
              {"name": "A1", "size": 8}, 
              {"name": "A1", "size": 4}, 
              {"name": "A1", "size": 4}, 
              {"name": "A1", "size": 4}, 
              {"name": "A1", "size": 4}, 
              {"name": "A2", "size": 4}]}]
  }]
};
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
   console.log('at renderer')
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
   var g = d3.select('svg')
       .attr('width', width)
       .attr('height', height)
       .append('g')
       .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
       .attr("border",border);
       console.log(g);
       console.log('at d3 starburst');

      
  console.log(g, "G")

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
       var global = d3.hierarchy(x)
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





let ctr =0; // remove later
console.log("after json")
   function mouseover(d) {
        // remove later
    ctr+=1;   
    console.log(ctr)
   
          // Get total size of the tree = value of root node from partition.
        //   totalSize = path.datum().value;
          const totalSize = 20000; // bullshit placeholder
          var percentage = (100 * d.value / totalSize).toPrecision(3);
          var percentageString = percentage + "%";
          if (percentage < 0.1) {
            percentageString = "< 0.1%";
          }


    d3.select("#percentage")
      .text(percentageString);
    //ADDED FILE NAME-
    d3.select("#filename")
      .text(d.data.name)

    //ADDED FILE SIZE
    d3.select("#filesize")
      .text(d.value / 1000)

      //ADDED SPEED
    d3.select("#speed")
      .text(d.data.speed)

    d3.select("#explanation")
      .style("visibility", "");
   }
//    var d1 = document.getElementById('sample-1');
//    d1.insertAdjacentHTML('beforeend', '<div id="two">two</div>');


  }

  render() {
    return (
      <div>
        <div className="container">
        STARBURST
          <div className="box">
            <svg width={630} height={500} className="d3_starburst" ref={(elem) => { this.svg = elem; }}>
            </svg>

         <div id="explanation">
          <span id="filename"></span><br />
          speed:<span id="speed"></span> <br />
          <span id="percentage"></span><br />
          of your bundle
            Size: <span id="filesize"></span> kb <br />
        </div>

          </div>
        </div>
      </div>
    );
  }

 

}

export default D3StarBurstChart;