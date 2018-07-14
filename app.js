// Initial Params
var chosenXAxis = "foreignBornPopulationEstimate";
var chosenYAxis = "checkupNever";

var svgWidth = 600;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "container mx-auto");

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// functions used for updating x- and y-scales var upon click on axes labels
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8, d3.max(data, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);
  return xLinearScale;
};

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(data, d => d[chosenYAxis]) * 1.2, d3.min(data, d => d[chosenYAxis]) * 0.8])
    .range([0, height]);
  return yLinearScale;
};

// function used for updating axes var upon click on axes label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
};

function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
};

// function used for updating circles group with a transition to
// new circles
function renderCircles(circle, newXScale, chosenXaxis, newYScale, chosenYAxis) {

  circle.transition()
    .duration(1000)
    .attr('transform', function (d, i) {
      return "translate("
        + newXScale(d[chosenXaxis])
        + ","
        + newYScale(d[chosenYAxis])
        + ")"
    })

  return circle;
};

// Retrieve data from the CSV file and execute everything below
d3.csv("resources/data.csv", function (err, data) {
  if (err) throw err;
  console.log(data);

  // Parse Data
  data.forEach(function (d) {
    d.foreignBornPopulationEstimate = +d.foreignBornPopulationEstimate;
    d.checkupNever = +d.checkupNever;
    d.moreThenFive = +d.moreThenFive;
    d.withinFive = +d.withinFive;
    d.withinTwo = +d.withinTwo;
    d.withinOne = +d.withinOne;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // create y scale function
  var yLinearScale = yScale(data, chosenYAxis);;

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "axisC")
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("class", "axisC")
    .call(leftAxis);

  // append initial circles
  // append g group that would hold the circles and labels
  var circle = chartGroup.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr('transform', function (d, i) {
      return "translate("
        + xLinearScale(d[chosenXAxis])
        + ","
        + yLinearScale(d[chosenYAxis])
        + ")"
    })

  // append circles
  circle.append("circle")
    .attr("r", "16")
    .attr("fill", "steelblue")
    .attr("opacity", ".5");

  // append text labels to circles
  circle.append("text")
    .attr("dy", ".35em")
    .attr("dx", "-11")
    .classed("state-text",true)
    .text(function (d) { return d.abbr; });

  // add labels for x axes
  var xLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var xLabel1 = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "foreignBornPopulationEstimate") // value to grab for event listener
    .classed("active", true)
    .text("Foreign Born Population Estimate");

  var xLabel2 = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "moreThenFive") // value to grab for event listener
    .classed("inactive", true)
    .text("More Then Five");

  var xLabel3 = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "withinFive") // value to grab for event listener
    .classed("inactive", true)
    .text("Within Five");

  // add labels for y axes
  var yLabels = chartGroup.append("g")
    .attr("transform", `translate(0, ${height / 2})`);

  var yLabel1 = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("dy", "-40")
    .attr("value", "checkupNever") // value to grab for event listener
    .classed("active", true)
    .text("Never CheckedUp");

  var yLabel2 = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -60)
    .attr("value", "withinTwo") // value to grab for event listener
    .classed("inactive", true)
    .text("Within Two Years");

  var yLabel3 = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -80)
    .attr("value", "withinOne") // value to grab for event listener
    .classed("inactive", true)
    .text("Within One Year");

  // x axis labels event listener
  xLabels.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value != chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new x values
        circle = renderCircles(circle, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to highlight chosen axis
        if (chosenXAxis == "foreignBornPopulationEstimate") {
          xLabel1
            .classed("active", true)
            .classed("inactive", false);
          xLabel2
            .classed("active", false)
            .classed("inactive", true);
          xLabel3
            .classed("active", false)
            .classed("inactive", true)
        }
        else if (chosenXAxis == "moreThenFive") {
          xLabel1
            .classed("active", false)
            .classed("inactive", true);
          xLabel2
            .classed("active", true)
            .classed("inactive", false);
          xLabel3
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          xLabel1
            .classed("active", false)
            .classed("inactive", true);
          xLabel2
            .classed("active", false)
            .classed("inactive", true);
          xLabel3
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  //y axes event listener
  yLabels.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value != chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new x values
        circle = renderCircles(circle, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to highlight chosen axis
        if (chosenYAxis == "checkupNever") {
          yLabel1
            .classed("active", true)
            .classed("inactive", false);
          yLabel2
            .classed("active", false)
            .classed("inactive", true);
          yLabel3
            .classed("active", false)
            .classed("inactive", true)
        }
        else if (chosenYAxis == "withinTwo") {
          yLabel1
            .classed("active", false)
            .classed("inactive", true);
          yLabel2
            .classed("active", true)
            .classed("inactive", false);
          yLabel3
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          yLabel1
            .classed("active", false)
            .classed("inactive", true);
          yLabel2
            .classed("active", false)
            .classed("inactive", true);
          yLabel3
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});