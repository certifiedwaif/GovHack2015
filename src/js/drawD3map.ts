console.log('hey');


function drawMap(lat, long) {
  console.log("Lol you wrote this:", lat)
  console.log(long)

//Width and height
var w = 200;
var h = 200;

//Define map projection
var projection = d3.geoMercator()
  .center([ Math.floor(long), Math.floor(lat)])
  .translate([w / 2, h / 2])
  .scale(1000);


//Define path generator
var path = d3.geoPath()
  .projection(projection);

var color = d3.scaleOrdinal()
  .range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9']);

//Create SVG
var svg = d3.select("#map-canvas")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

//Load in GeoJSON data
d3.json("aust.json").then( (json :any) => {

  console.log("hey we're in json", json);

  //Bind data and create one path per GeoJSON feature
  svg.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "dimgray") // @ts-ignore @types/d3 is missing this overload.
    .attr("fill", function (d, i) { return color(i) }); 

  //States
  svg.selectAll("text")
    .data(json.features)
    .enter()
    .append("text")
    .attr("fill", "darkslategray")
    .attr("transform", function (d :any) { return "translate(" + path.centroid(d) + ")"; })
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text(function (d :any) {
      return d.properties.STATE_NAME;
    });

  //Append the name
  svg.append("text")
    .attr("x", 446)
    .attr("y", 340)
    .attr("font-size", 90)
    .attr("font-weight", "bold")
    .attr("font-family", "Roboto")
    .attr("text-anchor", "middle")
    .attr("opacity", 0.10)
    .text("AUSTRALIA");

});



}

globalThis.drawMap = drawMap
