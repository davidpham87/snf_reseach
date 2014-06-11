$(function(){
  var width = Math.min(innerWidth*0.75, 960), 
      height = Math.min(innerHeight*0.75, 500);

  var path = d3.geo.path()
    .projection(null);

  var centroid = d3.geo.centroid;

  var rateByName = d3.map();

  //Color scale
  var color = d3.scale.quantile()
    .range(d3.range(10).map(function(i) { j = i; return "q" + j + "-10"; }))
    .domain([30, 70]);

  //Voronoi tessleation
  var voronoi = d3.geom.voronoi()
    .clipExtent([[0,0], [width, height]]);

  // Zoom hack
  var zoom = d3.behavior.zoom()
    .scaleExtent([0.5, 10])
    .on("zoom", zoomed);
  
  var svg = d3.select('#svgZhVotes')
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

  var map = svg.append("g");

  // End of Zoom
  function zoomed() {
    map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    //contour.style("stroke-width", 0.5 / d3.event.scale);
  }


  // The axis mapping color and the number
  function createKeyLegend(){

    var x = d3.scale.linear()
      .domain([30, 70])
      .range([0, height*0.8]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(13)
      .tickFormat(d3.format(".0f"));

    var key = svg.append("g")
      .attr("class", "key RdYlGn")
      .attr("transform", "translate(" + (width - 100) + "," + (height - 30) + ")rotate(-90)");
    
    key.append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", height*0.85)
      .attr("height", 40)
      .style("fill", "white")
      .style("fill-opacity", 0.5)

    key.selectAll("g")
      .data(d3.pairs(x.ticks(11)))
      .enter().append("rect")
      .attr("class", function(d) { return color(d[0]); })
      .attr("height", 8)
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); });
    
    key.call(xAxis);
    svg.selectAll("g .tick text")
      .attr("transform", 'translate(22, 22)rotate(90)');
  }

  createKeyLegend();

  var gem;
  var municipalities;
  var mesh_municipality;
  var polygons;
  var positions = [];

  //a dictionary like structure
  var voteById = d3.map();

  queue()
    .defer(d3.json, "data/zh-municipalities.json")
    .defer(d3.csv, "data/zhVotes.csv", function(d) {voteById.set(+d.id, {'rateYes': +d.rateYes, 'n': +d.n})})
    .await(CreateMap);

  // d3.json("zh-municipalities.json", CreateMap)
  // d3.json("ch.json", CreateMap)

  function translate_by(x, y){
    return "translate(" + x + "," + y + ")";
  }

  function CreateMap(error, zh){

    municipalities = topojson.feature(zh, zh.objects.municipalities);
    mesh_municipality = topojson.mesh(zh, zh.objects.municipalities, 
                                      function(a, b) {return a!==b;});

    //gem = zh; // Debugging purpose

    //Add the borders of the municipalities
    map.append("path")
      .datum(municipalities)
      .attr("class", "country")
      .attr("d", path);

    //Add the color inside the municipalities
    map.append("g")
      .attr("class", "RdYlGn")
      .selectAll("path")
      .data(municipalities.features)
      .enter().append("path")
      .attr("class", function(d) {return color(voteById.get(d.id).rateYes);})
      .attr("d", path);

    //Add a circle in the middle of the municipalities
    // svg.append("g")
    //   .attr("class", "RdYlGn")
    //   .selectAll("circle")
    //   .data(municipalities.features)
    //   .enter().append("circle")
    //   .attr("class", function(d) {return color(Math.random());})
    // // .attr("d", path)
    //   .attr('r', 4)
    //   .attr("cx", function(d) {return path.centroid(d)[0];})
    //   .attr("cy", function(d) {return path.centroid(d)[1];});

    map.append("path")
      .datum(mesh_municipality)
      .attr("class", "municipality-boundaries")
      .attr("d", path)
      .attr("stroke", "red")
      .attr("fill", 'none')
      .attr("stroke-width", 2);

    municipalities.features.forEach(function(d){
      positions.push(path.centroid(d));
    });
    
    //Creates a voronois tesselation
    function polygon(d) {
      return "M" + d.join("L") + "Z";
    }

    polygons = d3.geom.voronoi(positions);

    var voronoiArea = map.append("g")
      .attr("class", "municipality-voronoi")
      .selectAll("path")
      .data(polygons, polygon) //apply the polygon function to the dat polygon
      .enter().append("path")
      .attr("d", polygon)
      .attr("stroke-width", "0")
    
    var tooltip = d3.select("body")
	    .append("div")
      .attr("class", "d3-tip narrow")
	    .style("position", "absolute")
	    .style("z-index", "10")
	    .style("visibility", "hidden");

    function htmlInsideTooltipFn(d, i){
      d = municipalities.features[i];
      dat = voteById.get(d.id);
      htmlText = '<font color="red">' + d.properties.name + "</font>";
      htmlText += "<table>";             
      htmlText += "<tr> <td> Number of voters: </td> <td> </td> <td>" + d3.format(",")(dat.n)+ "</td> </tr>";
      htmlText += "<tr> <td> Proportion of yes: </td> <td> </td> <td>" + dat.rateYes + "</td> </tr>";
      htmlText += "</table>";
      return htmlText;}

    function addToolTip(g, tooltip, htmlInsideTooltipFn){
      g.on("mouseover", function(d, i){
        tooltip
          .html(htmlInsideTooltipFn(d,i))
          .style("visibility", "visible")
        return true;})
	      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
	      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
    }

    addToolTip(voronoiArea, tooltip, htmlInsideTooltipFn);    

  };
})
