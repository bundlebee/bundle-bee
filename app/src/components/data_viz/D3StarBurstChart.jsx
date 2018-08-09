import React, { Component } from "react";
import * as d3 from "d3";
import { connect } from "react-redux";

import DisplayButton from "./helper_components/DisplayButton.jsx";
import * as chart from "../../redux/constants/chartProperties.js";
import {
  displaySizes,
  displayFactoryTimes,
  displayBuildingTimes
} from "../../redux/actions/chartActions.js";

class D3StarBurstChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.instantiateStarburstChart();
  }

  componentDidUpdate() {
    this.instantiateStarburstChart();
  }
////////////////////////////////////////////////////////////////


  instantiateStarburstChart() {
    // init

    d3.select("#sb_d3_explanation").style("visibility", "hidden");

    // MOUSEOVER EVENTS   
    const mouseover = d => {


      // Get total size of the tree = value of rootData node from partition.
      //   totalSize = path.datum().value;
      var percentage = (
        (100.0 * d.value) /
        this.props.activeData.total[this.props.chart.screen]
      ).toPrecision(3);

      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }

      d3.select("#sb_d3_percentage").text(percentageString);
      //ADDED FILE NAME-
      d3.select("#sb_d3_filename").text(d.data.name);

      //ADDED FILE VALUE
      d3.select("#sb_d3_filevalue").text(d.value / 1000); // units of kb or seconds

      d3.select("#sb_d3_explanation").style("visibility", "");
      console.log("mouseover")
       
      // BREADCRUMBS
      var sequenceArray = d.ancestors().reverse();
      sequenceArray.shift(); // remove root node from the array
      let trickArray = sequenceArray.slice(0);
      // convert path array to a '/' seperated path string. add '/' at the end if it's a directory.
      const path = "./" + trickArray.map(node => node.data.name).join("/") + (trickArray[trickArray.length - 1].children ? "/" : "");
      _self.props.onHover(path);

      for (var i = 1; i < trickArray.length + 1; i++) {
        updateBreadcrumbs(trickArray.slice(0, i), percentageString);
      }
      // Fade all the segments.
      d3.selectAll("#chart").selectAll("path")
        .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis.selectAll("path")
        .filter(function (node) {
          return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);

    };

    // MOUSELEAVE EVENTS

    const mouseleave = d => {
      d3.select("#trail")
      .style("visibility", "hidden");


      d3.select("#sb_d3_explanation").style("visibility", "hidden");
      console.log("mouseleave")
    };

        // Update the breadcrumb trail to show the current sequence and percentage.
        function updateBreadcrumbs(nodeArray, percentageString) {

          // Data join; key function combines name and depth (= position in sequence).
          var trail = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function (d) { return d.data.name + d.depth; });
    
          // Remove exiting nodes.
          trail.exit().remove();
    
          // Add breadcrumb and label for entering nodes.
          var entering = trail.enter().append("svg:g");
    
          entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function (d) { return '#53c79f'; });
    
          entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .text(function (d) { return d.data.name; });
    
          // Now move and update the percentage at the end.
          var nodeAryFlat = '';
    
          for (var i = 0; i < nodeArray.length; i++) {
            nodeAryFlat = nodeAryFlat + ' ' + nodeArray[i].data.name
          }
    
          var nodeAryFlatLength = 0;
          var nodeAryFlatLengthPercentage = 0;
          for (var i = 1; i < nodeArray.length; i++) {
            nodeAryFlatLength = nodeAryFlatLength + b.w + nodeArray[i - 1].data.name.length * 7.5 + b.t
            nodeAryFlatLengthPercentage = nodeAryFlatLength + b.w + nodeArray[i].data.name.length * 7.5 + b.t + 15
          }
    
          entering.attr("transform", function (d, i) {
            if (i === 0) {
              return "translate(0, 0)"
            } else {
              return "translate(" + nodeAryFlatLength + ", 0)";   //POSITIONING OF WORDS
            }
          });
    
          d3.select("#trail").select("#endlabel")
            .attr("x", (nodeAryFlatLengthPercentage))  //CONTROLS WHERE THE PERCENTAGE IS LOCATED
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .text(percentageString);
    
          // Make the breadcrumb trail visible, if it's hidden.
          d3.select("#trail")
            .style("visibility", "");
    
        }

    // remove <g> element from <svg>
    d3.selectAll(".starburstgroup").remove();

    // Dimensions of sunburst
    // TODO: should be dynamic
    var width = 900;
    var height = 900;
    var radius = Math.min(width, height) / 2;
    var color = d3
      .scaleOrdinal()
      .range([
        "#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00"
      ]);

    // Size our <svg> element, add a <g> element, and move translate 0,0 to the center of the element.
    var g = d3
      .select("#svgStarBurst")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "starburstgroup")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create our sunburst data structure and size it.
    var partition = d3.partition().size([2 * Math.PI, radius]);

    // Find the rootData node of our data, and begin sizing process.
    // data sample depends on what bundle is chosen
    var global = d3.hierarchy(this.props.activeData.hierarchicalData).sum(d => {
      return d[this.props.chart.screen];
    });

    // Calculate the sizes of each arc that we'll draw later.
    partition(global);
    var arc = d3
      .arc()
      .startAngle(function(d) {
        return d.x0;
      })
      .endAngle(function(d) {
        return d.x1;
      })
      .innerRadius(function(d) {
        return d.y0;
      })
      .outerRadius(function(d) {
        return d.y1;
      });

    // Add a <g> element for each node in thd data, then append <path> elements and draw lines based on the arc
    // variable calculations. Last, color the lines and the slices.
    g.selectAll("g")
      .data(global.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .append("path")
      .attr("display", function(d) {
        return d.depth ? null : "none";
      })
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) {
        return color((d.children ? d : d.parent).data.name);
      })
      .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select("#starburstgroup").on("mouseleave", mouseleave);
  }

  render() {
    console.log(this.props.activeData, "DATAAAAAA");
    return (
      <div className="d3">
        <p>{this.props.chart.bundleType}</p>
        <div className="sb_d3_container">
          <DisplayButton
            handleClick={this.props.displaySizes}
            isHighligthed={this.props.chart.screen === chart.SIZE}
            isActive={this.props.activeData.total.hasOwnProperty("size")}
          >
            {"Sizes"}
          </DisplayButton>

          <DisplayButton
            handleClick={this.props.displayFactoryTimes}
            isHighligthed={this.props.chart.screen === chart.FACTORY_TIME}
            isActive={this.props.activeData.total.hasOwnProperty("factory")}
          >
            {"Factory Times"}
          </DisplayButton>

          <DisplayButton
            handleClick={this.props.displayBuildingTimes}
            isHighligthed={this.props.chart.screen === chart.BUILDING_TIME}
            isActive={this.props.activeData.total.hasOwnProperty("building")}
          >
            {"Building Times"}
          </DisplayButton>
        </div>
        <div id="sb_d3_explanation">
          <span id="sb_d3_filename" />
          <br />
          <span id="sb_d3_percentage" />
          <br />
          of your bundle
          {this.props.chart.screen === chart.SIZE ? (
            <span>
              Size: <span id="sb_d3_filevalue" /> kb
            </span>
          ) : (
            <span>
              Time: <span id="sb_d3_filevalue" /> s
            </span>
          )}
        </div>
        <div className="sb_d3_box">
        <div id="sequence"></div>
          <svg
            id="svgStarBurst"
            className="d3_starburst"
            ref={elem => {
              this.svg = elem;
            }}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  displaySizes: () => dispatch(displaySizes()),
  displayFactoryTimes: () => dispatch(displayFactoryTimes()),
  displayBuildingTimes: () => dispatch(displayBuildingTimes())
});

const mapStateToProps = state => {
  let activeData;
  if (state.chart.bundleType === chart.WEBPACK) {
    activeData = state.data.webpackStarBurstData;
  } else if (state.chart.bundleType === chart.PARCEL) {
    activeData = state.data.parcelStarBurstData;
  } else if (state.chart.bundleType === chart.ROLLUP) {
    activeData = state.data.rollupStarBurstData;
  }

  return { chart: state.chart, data: state.data, activeData };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(D3StarBurstChart);
