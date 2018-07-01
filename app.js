// Initial Params
var chosenXAxis = "foreignBornPopulationEstimate";

var svgWidth = 600;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 20
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

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8, d3.max(data, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);
  return xLinearScale;
};

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
};

// function used for updating circles group with a transition to
// new circles
function renderCircles(circle, newXScale, chosenXaxis) {

  circle.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]));

  return circle;
};

// Retrieve data from the CSV file and execute everything below
d3.csv("resources/data.csv", function (err, data) {
  if (err) throw err;
  // console.log(data.abbr);

  // Parse Data
  data.forEach(function (d) {
    d.foreignBornPopulationEstimate = +d.foreignBornPopulationEstimate;
    d.checkupNever = +d.checkupNever;
    d.moreThenFive = +d.moreThenFive;
    d.withinFive = +d.withinFive;
    d.withinTwo = +d.withinTwo;
    d.withinOne = +d.withinOne
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // crete y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.checkupNever)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circle = chartGroup.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr('transform', function(d, i) {
        return "translate("
          + xLinearScale(d[chosenXAxis])
          + "," 
          + yLinearScale(d.checkupNever)
          + ")"
      })
      
  circle.append("circle")
    .attr("r", "16")
    .attr("fill", "steelblue")
    .attr("opacity", ".5");

  circle.append("text")
      .attr("dy", ".35em")
      .attr("dx", "-12")
      .text(function(d) { return d.abbr; });

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var foreignBornPopulationEstimateLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "foreignBornPopulationEstimate") // value to grab for event listener
    .classed("active", true)
    .text("Foreign Born Population Estimate");

  var moreThenFiveLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "moreThenFive") // value to grab for event listener
    .classed("inactive", true)
    .text("More Then Five");

  // Append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("checkupNever");

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value != chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis == "moreThenFive") {
          moreThenFiveLabel
            .classed("active", true)
            .classed("inactive", false);
          foreignBornPopulationEstimateLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          moreThenFiveLabel
            .classed("active", false)
            .classed("inactive", true);
          foreignBornPopulationEstimateLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});