function drawMap(lat, long, place) {
    const w = 200;
    const h = 200;
    const projection = d3.geoMercator()
        .center([Math.floor(long), Math.floor(lat)])
        .translate([w / 2, h / 2])
        .scale(1000);
    const path = d3.geoPath()
        .projection(projection);
    const color = d3.scaleOrdinal()
        .range(['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9']);
    const svg = d3.select('#map-canvas')
        .append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`)
        .attr('width', w)
        .attr('height', h);
    d3.json('/aust.json').then((json) => {
        console.log("hey we're in json", json);
        svg.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('stroke', 'dimgray')
            .attr('fill', function (d, i) { return color(i); });
        svg.selectAll('text')
            .data(json.features)
            .enter()
            .append('text')
            .attr('fill', 'darkslategray')
            .attr('transform', function (d) { return 'translate(' + path.centroid(d) + ')'; })
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .style('opacity', 0.5)
            .text(function (d) {
            return d.properties.STATE_NAME;
        });
        svg.append('text')
            .attr('x', 100)
            .attr('y', 85)
            .attr('font-size', 16)
            .attr('font-weight', 'bold')
            .attr('font-family', 'FontAwesome')
            .attr('text-anchor', 'middle')
            .classed('fa fa-map-marker', true)
            .text('\uf041');
        svg.append('text')
            .attr('x', 100)
            .attr('y', 100)
            .attr('font-size', 16)
            .attr('font-weight', 'bold')
            .attr('font-family', 'Roboto')
            .attr('text-anchor', 'middle')
            .text(place);
    });
}
globalThis.drawMap = drawMap;
