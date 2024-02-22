// script.js
// Load the data
d3.csv("boardgame_ratings.csv").then(function(data) {
    // Convert date strings to JavaScript Date objects
    data.forEach(function(d) {
        d.date = new Date(d.date);
        d.Catan = +d.Catan;
        d.Dominion = +d.Dominion;
        d.Codenames = +d.Codenames;
        d.Terraforming_Mars = +d["Terraforming Mars"];
        d.Gloomhaven = +d.Gloomhaven;
        d.Magic_The_Gathering = +d["Magic: The Gathering"];
        d.Dixit = +d.Dixit;
        d.Monopoly = +d.Monopoly;
    });

    // Set up SVG dimensions and margins
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 800 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Parse date
    var parseDate = d3.timeParse("%m/%d/%Y");

    // Set up scales
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Define line function
    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); });

    // Create SVG container
    var svg = d3.select("body").selectAll("svg")
        .data(["Catan", "Dominion", "Codenames", "Terraforming_Mars", "Gloomhaven", "Magic_The_Gathering", "Dixit", "Monopoly"])
        .enter().append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Set domain for x and y scales
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d3.max(["Catan", "Dominion", "Codenames", "Terraforming_Mars", "Gloomhaven", "Magic_The_Gathering", "Dixit", "Monopoly"].map(function(key) { return d[key]; })) + 1000; })]);

    // Draw line for each game
    svg.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(data.map(function(e) { return {date: e.date, count: e[d]}; })); })
        .style("stroke", function(d) { return color(d); });

    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Number of Ratings 2016-2020");

    // Add legend
    var legend = svg.selectAll(".legend")
        .data(["Catan", "Dominion", "Codenames", "Terraforming_Mars", "Gloomhaven", "Magic_The_Gathering", "Dixit", "Monopoly"])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
});
