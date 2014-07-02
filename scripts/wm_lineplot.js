var data_dl = {line_data_list : '', 
              lp_data : '', 
              swiss_rolled: ''} // data for line plot
var draw_line_plot = function(country_num_id){

  // nvd3 simple line plot

  // To Add: total in Switzerland to have a reference point
  if (data_dl.line_data_list == ''){
    var line_data_list = line_data_list = d3.nest()
      .key(function(d) {return d.id})
      .key(function(d) {return d.base_disciplin})
      .key(function(d) {return d.date})
      .rollup(function(leaves) {
        return d3.sum(leaves, function(d) {return d.N});
      })
      .entries(data_ts);

    var lp_data = d3.map(); // Key values assocation
    line_data_list.forEach(function(x){
      lp_data.set(x.key, x.values);
    });

    // Reverse the level of Switzerland
    swiss_unrolled = lp_data.get(756);
    swiss_rolled = []
    for (var i = 0; i < swiss_unrolled[0].values.length; ++i){
      swiss_rolled[i] = {
        key: swiss_unrolled[0].values[i].key,
        values: d3.sum(swiss_unrolled, function(d, j) {return d.values[i].values;})
      };
    }
    data_dl.line_data = line_data_list;
    data_dl.lp_data = lp_data;
    data_dl.swiss_rolled = swiss_rolled;
  }

  var country_name = country_num_to_iso3.get(country_num_id);
  d3.select('#wmLinePlot').html('Evolution of Postdocs in ' + country_name);
  console.log(country_name);


  var chart;

  nv.addGraph(function() {
    chart = nv.models.lineChart()
      .options({
        margin: {left: 100, bottom: 100, right : 100},
        x: function(d, i) {
          var dte =  new Date(d.key);
          return dte.getTime();
        },
        y: function(d, i) {return d.values},
        showXAxis: true,
        showYAxis: true,
        transitionDuration: 100
      })
    ;

    // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
    chart.xAxis
      .axisLabel("Time")
      .tickFormat(function(d){
        return d3.time.format("%Y-%m")(new Date(d));
      });

    chart.yAxis
      .axisLabel('Number of Swiss Postdocs')
      .tickFormat(d3.format(',.0f'));

    var lp_data_filter = data_dl.lp_data.get(country_num_id);

    if (lp_data_filter.length > 0){
      lp_data_filter[0].key = 'Social Sciences';
      lp_data_filter[1].key = 'Base Sciences/Engineering';
      lp_data_filter[2].key = 'Biology/Medical Sciences';
      lp_data_filter[3] =  {key :'Switzerland (Total)', 
                            values: data_dl.swiss_rolled, color: "#898989"};
    }
    
    d3.select('#worldMapLinePlot')
      .datum(lp_data_filter)
      .call(chart);

    //TODO: Figure out a good way to do this automatically
    nv.utils.windowResize(chart.update);
    //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

    return chart;
  });

}

setTimeout(function(){
  draw_line_plot(124);
}, 250);
