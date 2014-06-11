// Function created by rCharts (issue with using rPubs....)

$(document).ready(function(){
  drawchart29822b5f217f()
});

function drawchart29822b5f217f(){  
  var opts = {
    "dom": "chart29822b5f217f",
    "width":    960,
    "height":    480,
    "x": "project_year",
    "y": "N",
    "group": "base_disc_name",
    "type": "multiBarChart",
    "id": "chart29822b5f217f" 
  },

  data = [
    {
      "project_year": 2008,
      "base_disc_name": "Social Sciences",
      "N": 278 
    },
    {
      "project_year": 2008,
      "base_disc_name": "Base Sciences",
      "N": 128 
    },
    {
      "project_year": 2008,
      "base_disc_name": "Biology_Med",
      "N": 207 
    },
    {
      "project_year": 2009,
      "base_disc_name": "Social Sciences",
      "N": 335 
    },
    {
      "project_year": 2009,
      "base_disc_name": "Base Sciences",
      "N": 151 
    },
    {
      "project_year": 2009,
      "base_disc_name": "Biology_Med",
      "N": 190 
    },
    {
      "project_year": 2010,
      "base_disc_name": "Social Sciences",
      "N": 355 
    },
    {
      "project_year": 2010,
      "base_disc_name": "Base Sciences",
      "N": 163 
    },
    {
      "project_year": 2010,
      "base_disc_name": "Biology_Med",
      "N": 211 
    },
    {
      "project_year": 2011,
      "base_disc_name": "Base Sciences",
      "N": 170 
    },
    {
      "project_year": 2011,
      "base_disc_name": "Biology_Med",
      "N": 275 
    },
    {
      "project_year": 2011,
      "base_disc_name": "Social Sciences",
      "N": 337 
    },
    {
      "project_year": 2012,
      "base_disc_name": "Social Sciences",
      "N": 361 
    },
    {
      "project_year": 2012,
      "base_disc_name": "Base Sciences",
      "N": 226 
    },
    {
      "project_year": 2012,
      "base_disc_name": "Biology_Med",
      "N": 247 
    },
    {
      "project_year": 2013,
      "base_disc_name": "Social Sciences",
      "N": 407 
    },
    {
      "project_year": 2013,
      "base_disc_name": "Base Sciences",
      "N": 209 
    },
    {
      "project_year": 2013,
      "base_disc_name": "Biology_Med",
      "N": 229 
    },
    {
      "project_year": 2014,
      "base_disc_name": "Social Sciences",
      "N": 285 
    },
    {
      "project_year": 2014,
      "base_disc_name": "Base Sciences",
      "N": 123 
    },
    {
      "project_year": 2014,
      "base_disc_name": "Biology_Med",
      "N": 163 
    } 
  ]
  
  if(!(opts.type==="pieChart" || opts.type==="sparklinePlus")) {
    var data = d3.nest()
      .key(function(d){
        //return opts.group === undefined ? 'main' : d[opts.group]
        //instead of main would think a better default is opts.x
        return opts.group === undefined ? opts.y : d[opts.group];
      })
      .entries(data);
  }
  
  if (opts.disabled != undefined){
    data.map(function(d, i){
      d.disabled = opts.disabled[i]
    })
  }
  
  nv.addGraph(function() {
    var chart = nv.models[opts.type]()
      .x(function(d) { return d[opts.x] })
      .y(function(d) { return d[opts.y] })
      .width(opts.width)
      .height(opts.height)
    
    
    d3.select("#barplot")
      .datum(data)
      .transition().duration(500)
      .call(chart);
    
    nv.utils.windowResize(chart.update);
    return chart;
  });
};
