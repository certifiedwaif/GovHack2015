console.log('hey');
function drawMap(lat, long, place) {
    console.log("Lol you wrote this:", lat);
    console.log(long);
    var w = 200;
    var h = 200;
    var projection = d3.geoMercator()
        .center([Math.floor(long), Math.floor(lat)])
        .translate([w / 2, h / 2])
        .scale(1000);
    var path = d3.geoPath()
        .projection(projection);
    var color = d3.scaleOrdinal()
        .range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9']);
    var svg = d3.select("#map-canvas")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    d3.json("aust.json").then((json) => {
        console.log("hey we're in json", json);
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "dimgray")
            .attr("fill", function (d, i) { return color(i); });
        svg.selectAll("text")
            .data(json.features)
            .enter()
            .append("text")
            .attr("fill", "darkslategray")
            .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(function (d) {
            return d.properties.STATE_NAME;
        });
        svg.append("text")
            .attr("x", 100)
            .attr("y", 100)
            .attr("font-size", 16)
            .attr("font-weight", "bold")
            .attr("font-family", "FontAwesome")
            .attr("text-anchor", "middle")
            .classed("fa fa-map-marker", true)
            .html('x');
        svg.append("text")
            .attr("x", 100)
            .attr("y", 110)
            .attr("font-size", 16)
            .attr("font-weight", "bold")
            .attr("font-family", "Roboto")
            .attr("text-anchor", "middle")
            .text(place);
    });
}
globalThis.drawMap = drawMap;
