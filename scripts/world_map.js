// A little bit to long code
// Next time create an global object/dictionnary myplot with all the elements 
// (scales, color, data, ...) inside it in order to share with accross functions.
// Note: learn how to create a module in js.

var width = 960,
height = 480,
height_slider = 80;
//===============================================================================

var date_format = d3.time.format("%Y-%m-%d");
var dte = {'date' : date_format.parse('2008-01-01')}; // First Date

var data_ts;
var data_nest;
var world_data;
var count_by_date = d3.map();
var country_num_to_iso3 = d3.map(); // numcode to name of the country

//===============================================================================
// Color scaler

function createQuantize(){

  var quantize = d3.scale.quantize()
    .domain([0, 6])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));  // Color

  return quantize;
}

//===============================================================================
// Brush 

function createBrush(){

  var animation_features = {'value': 2008}; // For animation
  var refreshIntervalId; // Function for stopping the animation
  
  var play_button = d3.select('#worldMapButton') // Button to click to launch the animation
    .on("click", animate_map);

  var svg_slider = d3.select('#worldMapSlider').append('g')
    .attr("transform",  "translate(" + 40 + "," + 40 + ")")

  var x = d3.scale.linear()
    .domain([2008, 2014])
    .range([0, width-60])
    .clamp(true);

  var brush = d3.svg.brush()
    .x(x)
    .extent([2008, 2008])
    .on("brush", updateBrush);

  var value = brush.extent()[0];
  var month = Math.floor((value - Math.floor(value))*100/12) + 1;
  var this_date;

  function updateBrush(){
    var value = brush.extent()[0];
    var month = Math.floor((value - Math.floor(value))*100/12) + 1;
    var new_date = new Date(value, month, 1, 0, 0, 0, 0);
    
    dte.date = new_date;

    if (d3.event.sourceEvent) { // not a programmatic event
      value = x.invert(d3.mouse(this)[0]);
      brush.extent([value, value]);
    }
    
    handle.attr("cx", x(value));      
    
    // Here for doing the animation
    if (this_date != new_date){
      updateMap(new_date);
      this_date = new_date;
      d3.select('#worldDate').text(new_date.toString().substring(4,15)); // Update da
    }    
  }

  svg_slider.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0 " + 0 + ")")
    .attr("z-index", "10")
    .attr("fill", "black")
    .call(d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickValues([2008, 2009, 2010, 2011, 2012, 2013, 2014])
          .tickFormat(function(d) { return d; })
          .tickSize(0)
          .tickPadding(4)
          //.attr("dy", "1em")
          // .text("Speed of creation")
         )
    .append("text")
    .attr("x", x(2008))
    .attr("dy", "-1.5em")
    .style("text-anchor", "end")
    .text("Date")
    .select(".domain")
    .select(function() { 
      return this.parentNode.appendChild(this.cloneNode(true)); 
    })
    .attr("class", "halo")
    .on("click", function(){
      clearInterval(refreshIntervalId);
    });;

  var slider = svg_slider.append("g")
    .attr("class", "slider")
    .call(brush);

  slider.selectAll(".extent,.resize")
    .remove();

  slider.select(".background")
    .attr("height", height_slider);

  var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + 0  + ")")
    .attr("r", 9)
    .on("click", function(){
      clearInterval(refreshIntervalId);
    });

  //=============================================================================
  // Animation on play button
  function update_animation(features){
    
    function toDateFromValue(value){  
      var month = Math.floor((value - Math.floor(value))*100/12) + 1;
      var new_date = new Date(value, month, 1, 0, 0, 0, 0);
      return new_date;
    }

    function stop_animation(value){
      clearInterval(refreshIntervalId);
      dte.date = toDateFromValue(value);
      createWorldMap();
    }
    //Hack to stop the animation
    if (brush.extent()[0] !== features.value || features.value > 2014) {
      stop_animation(features.value);
      return;
    }
    
    features.value += 1/12;

    var value = features.value;
    var new_date = toDateFromValue(value);

    brush.extent([value, value])
    handle.attr("cx", x(value));       
    updateMap(new_date);
    d3.select('#worldDate').text(new_date.toString().substring(4,15)); // Update date
  }

  function animate_map(){ 

    // First value of the year # Should work on scale.domain maybe
    var value = brush.extent()[0]; 

    animation_features = {'value': value};  

    clearInterval(refreshIntervalId); // Stop previous animation

    refreshIntervalId = setInterval(
      function() {
        update_animation(animation_features);
      }, 100);

  }
}

createBrush();

//===============================================================================
// World map

// Make sure there are not two worlds
function keepOneWorld(){
  var svg =  d3.selectAll('#worldMap g');
  if (svg[0].length < 2) {
    return;
  }

  for (var i=0; i<svg[0].length-1; ++i){
    svg[0][i].remove();
  }
}

// Return which boxes are checked

function filterByCheckbox(){
  var cb = d3.selectAll('.filter_checkbox');
  cb =  cb[0].filter(function(d){
    return d.checked;
  });
  return cb.map(function(d) {return d.value.toString();});
}


function createWorldMap(){

  //d3.geo.azimuthalEqualArea()
  var projection = d3.geo.mercator() 
    .scale((width + 1) / 1.65 / Math.PI)
    .translate([width / 2 - 25, height / 2 + 80])
    .precision(.1);

  var path = d3.geo.path()
    .projection(projection);

  var graticule = d3.geo.graticule();

  var quantize = d3.scale.quantize()
    .domain([0, 6])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));  // Color

  // Zoom hack
  var zoom = d3.behavior.zoom()
    .scaleExtent([0.5, 10])
    .on("zoom", zoomed);

  d3.select('#worldMap')
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);
  
  var svg =  d3.select('#worldMap').append("g");

  // var city_radius = 5;

  function zoomed() {
    var d3_scale = d3.event.scale;
    svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3_scale + ")");
    // svg.selectAll(".city")
    //   .attr("r", city_radius/Math.sqrt(d3_scale))
    //   .style("stroke-width", 2/Math.sqrt(d3_scale) + 'px');
  }
  // End of Zoom

  svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

  queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.csv, "data/dat_ly_ts.csv", function(d){
      return {
        N: +d.N,
        date: date_format.parse(d.date),
        id: d.numcode,
        base_disciplin: d.base_disciplin //Mistake/Typo in the csv file...
      }
    })
    .defer(d3.csv, "data/country.csv", function(d){
      country_num_to_iso3.set(d.numcode, d.name);
    })
    .await(createMap);
  
  // In order to refresh the map so that the move in the world map stays fluid.
  var svg_old_worldmap = d3.select('#worldMap_g');
  svg_old_worldmap
    .transition()
    .duration(1000)
    .ease(Math.sqrt)
    .style('opacity', 1e-16)
    .remove();
  svg.attr("id", 'worldMap_g');


  function createMap(error, world, data) {
    data_ts = data;
    world_data = world;
    // console.log(data[0]);
    
    data_nest = d3.nest()
      .key(function(d) {return d.date})
      .key(function(d) {return d.id})
      .key(function(d) {return d.base_disciplin})
      .rollup(function(leaves) {
        return d3.sum(leaves, function(d) {return d.N});
      })
      .entries(data);

    for (var i=0; i<data_nest.length; ++i){
      var count_by_country = d3.map();
      var country_count = data_nest[i].values;    
      
      for (var j=0; j<country_count.length;  ++j){        
        count_by_country.set(country_count[j].key, 
                             country_count[j].values);
      }

      count_by_date.set(data_nest[i].key, count_by_country);
    }

    if (!count_by_date.has(dte.date)){
      return;
    }
    
    var disciplins = filterByCheckbox();

    var countries = svg.selectAll(".country")  
      .data(topojson.feature(world, world.objects.countries).features)
      .enter().insert("path", ".graticule")
      .attr("class", function(d) {
        var n = count_by_date.get(dte.date).get(String(d.id));
        n = n !== undefined ? d3.sum(n, function(d) {return (disciplins.indexOf(d.key) > -1) ? d.values : 0;}) : 0; // Sum the element of the arrays such that the keys are in disciplins;
        return quantize(Math.log(n+1));})
      .attr("d", path)
      .on("click", function(d, i){
        draw_line_plot(d.id); // Redraw the svg line_plot #worldMapLinePlot
      });

    // var borders = svg.insert("path", ".graticule")
    //   .datum(topojson.mesh(world_data, world_data.objects.countries, function(a, b) { return a !== b; }))
    //   .attr("class", "boundary")
    //   .attr("d", path);

    // Tooltip for the countries
    d3.select('#tooltip_worldmap').remove();
    var tooltip = d3.select("body")
	    .append("div")
      .attr("class", "d3-tip worldMapTip")
      .attr('id', 'tooltip_worldmap')
	    .style("position", "absolute")
	    .style("z-index", "10")
	    .style("visibility", "hidden");
    
    addToolTip(countries, tooltip, htmlInsideTooltipFn);    
    keepOneWorld(); // Make sure there is only one world displayed
  }
}

function updateMap(new_date){

  keepOneWorld(); // Make sure there is only one world displayed

  var projection = d3.geo.mercator() 
    .scale((width + 1) / 1.65 / Math.PI)
    .translate([width / 2 - 25, height / 2 + 80])
    .precision(.1);

  var path = d3.geo.path()
    .projection(projection);

  var quantize = createQuantize();

  var svg =  d3.select('#worldMap_g');
  
  if (!count_by_date.has(new_date)){
    return;
  }

  var disciplins = filterByCheckbox();
  
  var countries = svg.selectAll(".country")  
    .data(topojson.feature(world_data, world_data.objects.countries).features)
    .enter().insert("path", ".graticule")
    .attr("class", function(d) {
      var n = count_by_date.get(new_date).get(String(d.id));
      n = n !== undefined ? d3.sum(n, function(d) {return (disciplins.indexOf(d.key) > -1) ? d.values : 0;}) : 0; // Sum the element of the arrays such that the keys are in disciplins;
      return quantize(Math.log(n+1));})
    .attr("d", path)      
    .on("click", function(d, i){
        draw_line_plot(d.id); // Redraw the svg line_plot #worldMapLinePlot
      });
  
  var tooltip = d3.select('#tooltip_worldmap');  
  addToolTip(countries, tooltip, htmlInsideTooltipFn);

}

createWorldMap();

// Make sure there is always at least one world
setInterval(function(){
  var svg =  d3.selectAll('#worldMap g');
  if (svg[0].length < 1) {
    createWorldMap()
  }
}, 100)

//==============================================================================
// The axis mapping color and the number
function createKeyLegend(){
  
  var quantize = createQuantize();

  var x = d3.scale.linear()
    .domain([0, 6])
    .range([0, width*0.4]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(9)
    .tickFormat(d3.format(".1f"));

  var key = d3.select('#worldMapKey').append("g")
    .attr("class", "key Oranges")
    .attr("transform", "translate(10, 10)");
  //      .attr("transform", "translate(" + (width - 40) + "," + (height - 30) + ")rotate(-90)");
  
  key.append("rect")
    .attr("x", -10)
    .attr("y", -10)
    .attr("width", width*0.44)
    .attr("height", 40)
    .style("fill", "grey")
    .style("fill-opacity", 0.2);

  key.selectAll("g")
    .data(d3.pairs(x.ticks(9)))
    .enter().append("rect")
    .attr("class", function(d) { return quantize(d[0]); })
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); });
  
  key.call(xAxis);
  key.selectAll("text")
    .text(function(d) {return Math.round(Math.exp(d));});
}

createKeyLegend();

//==============================================================================
// Tooltip functions

function htmlInsideTooltipFn(d, i){
  
  var n = count_by_date.get(dte.date).get(String(d.id)); // n is an array with key : base_disiplin and value the number of project]
  n = n !== undefined ? n : [0, 0, 0];

  htmlText = "<div align='center'>";
  htmlText += '<font color="red">' + country_num_to_iso3.get(d.id) + "</font> ";
  htmlText += '<br><br>';
  htmlText += "<table style='text-align:left'>";
  
  var insert_tag = function(s, tag){
    return '<' + tag + '>' + s + '</' + tag + '>';
  }
  
  var safe_get = function(obj, prop, return_val){
    var val = obj[prop];
    return_val = return_val !== undefined ? return_val : 0;
    return val !== undefined ? val : return_val;
  }
  
  var base_disciplin = ['Social Sciences', 'Base Sciences', 'Biology/Medecine']
  
  for (var i=0; i < 3; ++i){
    row_text = insert_tag(base_disciplin[i] + ' :', 'td') +  
      insert_tag(safe_get(n[i], 'values', 0), 'td');    
    htmlText += insert_tag(row_text, 'tr');
  }
  
  htmlText +='</table>'
  htmlText += '</div>';
  // Add something here (Such as descriptions or date of tripe)  
  return htmlText;
}


function addToolTip(g, tooltip, htmlInsideTooltipFn){
  g.on("mouseover", function(d, i){
    tooltip
      .html(htmlInsideTooltipFn(d,i))
      .style("visibility", "visible")
    return true;})
	  .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
	  .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
}


//==============================================================================
// Filtering/ Facetting/ Checkboxes
function updateCheckBox(){

  var checkboxes = d3.selectAll('.filter_checkbox')  
    .on("change",  function(d){
      setTimeout(createWorldMap(), 500);
      return;
    }); 
  // Redraw the entire plot # not optimal but not too bad;
}

updateCheckBox();

function checkAll() {
  checkboxes.property('checked', true);
}

function unCheckAll() {
  checkboxes.property('checked', false);
}

//==============================================================================
// Misc

function get_translate(s){
  if (s == undefined){
    return [0, 0]
  }
  var s = s.split(' ')[0];
  s = s.substring(11, s.length-1);
  var res = s.split(',').map(function(d) {return +d;});
  return res;
}

function get_scale(s){
  if (s == undefined){
    return 1;
  }
  var s = s.split(' ')[1];
  s = +s.substring(6, s.length-1);
  return s;
}

//===============================================================================

d3.select(self.frameElement).style("height", height + "px");  // I don't know what it is, but we need...


