var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read the data
d3.csv("resources/data.csv", function(err, data) {
  if (err) throw err;
  // console.log(data.abbr);
  // Step 1: Parse Data/Cast as numbers
  // ==============================
  data.forEach(function (d) {
    d.foreignBornPopulationEstimate = +d.foreignBornPopulationEstimate;
    d.checkupNever = +d.checkupNever;
    // d.abbr = d.abbr;
    // console.log(d.abbr);
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(data, d => d.foreignBornPopulationEstimate)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.checkupNever)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.foreignBornPopulationEstimate))
  .attr("cy", d => yLinearScale(d.checkupNever))
  .attr("r", "15")
  .attr("fill", "pink")
  .attr("opacity", ".5")
  
  chartGroup.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr("x", d => xLinearScale(d.foreignBornPopulationEstimate))
    .attr("y", d => yLinearScale(d.checkupNever))
    .attr("class", "text-muted")
    .text(function(d){return d.abbr});



  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("checkupNever");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("foreignBornPopulationEstimate");
  
  });