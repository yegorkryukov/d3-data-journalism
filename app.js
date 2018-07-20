// Initial Params
var dataLabels = {
  'blue_collar':'Construction and Transportation',
  'service_sales':'Service, Sales and Office',
  'management': 'Management, business, science, and arts',
  'depression':'Depression',
  'skin_cancer':'Skin Cancer',
  'kidney_disease':'Kidney Disease'
};

var chosenXAxis = "blue_collar";
var chosenYAxis = "depression";

var margin = {top: 60, right: 30, bottom: 100, left: 100}
  , width = parseInt(d3.select('body').style('width'), 10)
  , width = width - margin.left - margin.right
  , chartRatio = .5
  , height = width * chartRatio;

// Create an SVG wrapper, append an SVG group that will hold the chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// functions used for updating x- and y-scales var upon click on axes labels
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis])*0.8, 
    d3.max(data, d => d[chosenXAxis])*1.1])
    .range([0, width]);
  return xLinearScale;
};

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.max(data, d => d[chosenYAxis]), d3.min(data, d => d[chosenYAxis])])
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
function renderCircles(circle, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circle.transition()
    .duration(1000)
    .attr('transform', function (d, i) {
      return "translate("
        + newXScale(d[chosenXAxis])
        + ","
        + newYScale(d[chosenYAxis])
        + ")"
    })

  return circle;
};

// Retrieve data from the CSV file and execute everything below
d3.csv("resources/data2.csv", function (err, data) {
  if (err) throw err;
  // console.log(data);

  // Parse Data
  data.forEach(function (d) {
    d.blue_collar = +d.blue_collar;
    d.depression = +d.depression;
    d.service_sales = +d.service_sales;
    d.management = +d.management;
    d.skin_cancer = +d.skin_cancer;
    d.kidney_disease = +d.kidney_disease;
    // console.log(d[chosenXAxis])
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

  // instantiate tooltip object
  var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) { 
      return `<strong>${d.state}</strong>`
      +'<br>'
      +`${dataLabels[chosenXAxis]}: ${d[chosenXAxis]}`
      +'<br>'
      +`${dataLabels[chosenYAxis]}: ${d[chosenYAxis]}`
    });
  chartGroup.call(tool_tip);

  // append initial circles
  // append g group that would hold the circles and labels
  var circle = chartGroup.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr('transform', function (d) {
      return "translate("
        + xLinearScale(d[chosenXAxis])
        + ","
        + yLinearScale(d[chosenYAxis])
        + ")"
    })
    .on('mouseover', tool_tip.show)
    .on('mouseout', tool_tip.hide);

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
    .attr("value", "blue_collar") // value to grab for event listener
    .classed("active", true)
    .text(dataLabels['blue_collar']);

  var xLabel2 = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "service_sales") // value to grab for event listener
    .classed("inactive", true)
    .text(dataLabels['service_sales']);

  var xLabel3 = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "management") // value to grab for event listener
    .classed("inactive", true)
    .text(dataLabels['management']);

  // add labels for y axes
  var yLabels = chartGroup.append("g")
    .attr("transform", `translate(0, ${height / 2})`);

  var yLabel1 = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("dy", "-40")
    .attr("value", "depression") // value to grab for event listener
    .classed("active", true)
    .text(dataLabels['depression']);

  var yLabel2 = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -60)
    .attr("value", "skin_cancer") // value to grab for event listener
    .classed("inactive", true)
    .text(dataLabels['skin_cancer']);

  var yLabel3 = yLabels.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", -80)
    .attr("value", "kidney_disease") // value to grab for event listener
    .classed("inactive", true)
    .text(dataLabels['kidney_disease']);

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
        if (chosenXAxis == "blue_collar") {
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
        else if (chosenXAxis == "service_sales") {
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
        if (chosenYAxis == "depression") {
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
        else if (chosenYAxis == "skin_cancer") {
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