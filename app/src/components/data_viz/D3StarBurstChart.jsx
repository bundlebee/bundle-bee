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
import OpenFolderOfOneButton from "../OpenFolderOfOneButton";

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

  // D3 Starburst init
  instantiateStarburstChart() {

    // hidden until mouseover-ed
    d3.select(".d3_tooltip").style("visibility", "hidden");
    d3.select("#sb_d3_explanation").style("visibility", "hidden");

    // show total size and speed
    d3.selectAll("#totals_display").remove();

    var totals_display = d3
      .select(".sb_d3_box")
      .append("div")
      .attr("class", "totals_display");
    totals_display.append("span").attr("id", "totals_display");

    // specify totals according to data type
    console.log(this.props.activeData.total, "TOTALS")
    let totals_display_html;
    if (this.props.chart.screen === chart.SIZE) {
      totals_display_html = `<strong>Total Size:</strong> ${this.props.activeData.total.totalBundleSize/1000} kb<br />
    `
    }     else if (this.props.chart.screen === chart.BUILDING_TIME) {
      totals_display_html = `<strong>Total Building Time:</strong> ${this.props.activeData.total.totalElapsedTime} milliseconds<br />
    `
    }  else if (this.props.chart.screen === chart.FACTORY_TIME) {
      totals_display_html = `<strong>Total Factory Time:</strong> ${this.props.activeData.total.factory} milliseconds<br />
    `
    }   

    totals_display.select("#totals_display").html(totals_display_html);

    // MOUSEOVER EVENTS
    const mouseover = d => {
      var percentage = (
        (100.0 * d.value) /
        this.props.activeData.total[this.props.chart.screen]
      ).toPrecision(3);

      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }
      // set tooltip position and content
      var tooltip = d3
        .select(".sb_d3_box")
        .append("div")
        .attr("class", "d3_tooltip");
      tooltip.append("span");
      tooltip.append("span").attr("id", "sb_d3_details");

      tooltip
        .style("top", d3.event.layerY + "px")
        .style("left", d3.event.layerX + 30+ "px");

      tooltip.select("#sb_d3_details").html(
        `
        <strong>Filename: </strong>${d.data.name}<br />
        <strong>Size: </strong>${d.value / 1000}  kb <br />
        <strong>Percentage: </strong>${percentageString} <br />
        `
      );

      var percent = 10;

      tooltip.style("display", "block");

      tooltip.style("position", "absolute");

      // show slice information on hover
      // d3.select("#sb_d3_percentage").text(percentageString);
      // //ADDED FILE NAME-
      // d3.select("#sb_d3_filename").text(d.data.name);
      // //ADDED FILE VALUE
      // d3.select("#sb_d3_filevalue").text(d.value / 1000); // units of kb or seconds

      // // makes everything inside #sb_d3_explanation visible
      // d3.select("#sb_d3_explanation").style("visibility", "");
      console.log("mouseover");

      // BREADCRUMBS info
      var sequenceArray = d.ancestors().reverse();
      console.log(sequenceArray, "BREADCRUMBS");
      sequenceArray.shift(); // remove root node from the array
      let trickArray = sequenceArray.slice(0);

      // convert path array to a '/' seperated path string. add '/' at the end if it's a directory.
      const path =
        "./" +
        trickArray.map(node => node.data.name).join("/") +
        (trickArray[trickArray.length - 1].children ? "/" : "");

      console.log(path, "PATH");
      for (var i = 1; i < trickArray.length + 1; i++) {
        updateBreadcrumbs(trickArray.slice(0, i), percentageString);
      }

      // Fade all the segments.
      d3.selectAll("#chart")
        .selectAll("path")
        .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis
        .selectAll("path")
        .filter(function(node) {
          return sequenceArray.indexOf(node) >= 0;
        })
        .style("opacity", 1);
    };

    // MOUSELEAVE EVENTS

    const mouseleave = d => {
      d3.select(".d3_tooltip").style("visibility", "hidden");
      d3.select("#trail").style("visibility", "hidden");
      d3.select("#sb_d3_explanation").style("visibility", "hidden");
      d3.select("#sb_d3_explanation").style("visibility", "hidden");
      d3.selectAll("#chart")
        .selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function() {
          d3.select(this).on("mouseover", mouseover);
        });
      d3.selectAll(".d3_tooltip").remove();

      console.log("mouseleave");
    };

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      var trail = d3
        .select("#sequence")
        .append("svg:svg")
        .attr("width", width + 500)
        .attr("height", 50)
        .attr("id", "trail");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + d.data.name.length * 7.5 + ",0"); //CONTROLS THE SHAPE OF THE POLYGON
      points.push(b.w + d.data.name.length * 7.5 + b.t + "," + b.h / 2);
      points.push(b.w + d.data.name.length * 7.5 + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) {
        // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + b.h / 2);
      }
      return points.join(" ");
    }
    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {
      // Data join; key function combines name and depth (= position in sequence).
      var trail = d3
        .select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) {
          return d.data.name + d.depth;
        });

      // Remove exiting nodes.
      trail.exit().remove();

      // Add breadcrumb and label for entering nodes.
      var entering = trail.enter().append("svg:g");

      entering
        .append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function(d) {
          return "#53c79f";
        });

      entering
        .append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d) {
          return d.data.name;
        });

      // Now move and update the percentage at the end.
      var nodeAryFlat = "";

      for (var i = 0; i < nodeArray.length; i++) {
        nodeAryFlat = nodeAryFlat + " " + nodeArray[i].data.name;
      }

      var nodeAryFlatLength = 0;
      var nodeAryFlatLengthPercentage = 0;
      for (var i = 1; i < nodeArray.length; i++) {
        nodeAryFlatLength =
          nodeAryFlatLength +
          b.w +
          nodeArray[i - 1].data.name.length * 7.5 +
          b.t;
        nodeAryFlatLengthPercentage =
          nodeAryFlatLength +
          b.w +
          nodeArray[i].data.name.length * 7.5 +
          b.t +
          15;
      }

      entering.attr("transform", function(d, i) {
        if (i === 0) {
          return "translate(0, 0)";
        } else {
          return "translate(" + nodeAryFlatLength + ", 0)"; //POSITIONING OF WORDS
        }
      });

      d3.select("#trail")
        .select("#endlabel")
        .attr("x", nodeAryFlatLengthPercentage) //CONTROLS WHERE THE PERCENTAGE IS LOCATED
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail").style("visibility", "");
    }

    // remove <g> element from <svg>
    d3.selectAll(".starburstgroup").remove();

    // Dimensions of sunburst
    // TODO: should be dynamic
    var width = 650;
    var height = 650;
    var _self = this;
    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
      w: 75,
      h: 30,
      s: 3,
      t: 15
    };
    var vis = d3
      .select(this.svg)
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("id", "container")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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
    initializeBreadcrumbTrail();

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
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);
  }

  render() {
    
    console.log(this.props.chart.bundleType, this.props.activeData, "DATAAAAAA");
    return (
      <div>
        {/* <h1 className="d3_title">{this.props.chart.bundleType.toUpperCase()}</h1> */}
        <div className="sb_d3_button_container">
          <div className="flexbuttons">
          <nav className="tabs1" id="d3_data_type">            

          <DisplayButton
            handleClick={this.props.displaySizes}
            isHighligthed={this.props.chart.screen === chart.SIZE}
            isActive={this.props.activeData.total.hasOwnProperty("size")}
            >
            {"Sizes"}
          </DisplayButton>

          <DisplayButton
            handleClick={this.props.displayBuildingTimes}
            isHighligthed={this.props.chart.screen === chart.BUILDING_TIME}
            isActive={this.props.activeData.total.hasOwnProperty("building")}
            >
            {"Building Times"}
          </DisplayButton>

          <DisplayButton
            handleClick={this.props.displayFactoryTimes}
            isHighligthed={this.props.chart.screen === chart.FACTORY_TIME}
            isActive={this.props.activeData.total.hasOwnProperty("factory")}
            >
            {"Factory Times"}
          </DisplayButton>
            </nav>
            <nav className="tabs1" id="d3_data_type">  
            
            <OpenFolderOfOneButton bundleType={this.props.chart.bundleType}
             dirname={this.props.dirname}
            isActive={true}
            >
            View Configuration 

          </OpenFolderOfOneButton>
            </nav>
            </div>
        </div>
        {/* Breadcrumbz */}
        <div id="sequence" />
        <div className="sb_d3_box">
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
