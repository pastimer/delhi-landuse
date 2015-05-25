var forHtml = {
  aTables: [
      {label: 'Date-wise CLU', href: "javascript:loadCLUByDate('#main');"},
      {label: 'Use-wise (From) CLU', href: "javascript:loadCLUByUse('#main', 'from');"},
      {label: 'Use-wise (To) CLU', href: "javascript:loadCLUByUse('#main', 'to');"},
      {label: 'Zone-wise CLU', href: "javascript:loadCLUByZone('#main');"}
  ],

  aGraphs: [
      {label: 'Chart by Use (Net)', href: "javascript:loadChartByUse('#main','both');"},
      {label: 'Chart by Use (From)', href: "javascript:loadChartByUse('#main','from');"},
      {label: 'Chart by Use (To)', href: "javascript:loadChartByUse('#main','to');"},
      {label: 'Chart by Zone', href: "javascript:loadChartByZone('#main');"},
      {label: 'Chart by Zone & Use (From)', href: "javascript:loadNvd3ChartByZone('#main', 'from');"},
      {label: 'Chart by Zone & Use (To)', href: "javascript:loadNvd3ChartByZone('#main', 'to');"}
  ],

  createTablesMenu: function() {
    var sMenu = this.aTables.map(function(d) {
      return '<li><a href="' + d.href + '">' + d.label + '</a></li>';
    }).join('');

    $('#topMenuTables').html(sMenu);
    $('#leftMenuTables').html(sMenu);
  },

  createChartsMenu: function() {
    var sMenu = this.aGraphs.map(function(d) {
      return '<li><a href="' + d.href + '">' + d.label + '</a></li>';
    }).join('');

    $('#topMenuCharts').html(sMenu);
    $('#leftMenuCharts').html(sMenu);
  },

  loadOverview: function(selector) {
    $(selector).load('overview.html');
  }
}

function flattenCluData(aCLU) {
  var aa = aCLU.map(function(a) {
    var z = a.changes.map(function(c) {
      c.SO = a.SO;
      c.date = a.date;
      c.file = a.file;
      return c;
    });
    return z;
  });
  return d3.merge(aa);
}

var gUseZones = {
  aUseZones: {
     'A': ['A', 'Green Belt', '#66ff66'],
     'C': ['C', 'Commercial', '#ff0033'],
     'G': ['G', 'Government', '#b87333'],
     'M': ['M', 'Industrial', 'purple'],
     'P': ['P', 'Recreational', 'green'],
     'PS': ['PS', 'Institutional', '#3333cc'],
     'R': ['R', 'Residential)', '#ffff33'],
     'T': ['T', 'Transportation', '#000000'],
     'U': ['U', 'Utility', 'pink']
  },

  getArray: function() {
    return d3.values(this.aUseZones);
  },

  getKeyValuePairs: function() {
    return this.aUseZones;
  }
};

function getPlanningZones() {
  var aZones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K-I', 'K-II', 'L', 'M', 'N', 'O', 'P-I', 'P-II'];

  return aZones;
}

function createTableHtml(aData) {
  var tbl = '<div class="table-responsive"><table class="table table-striped"><thead><tr><th>SO No.</th><th>Date</th><th>Item no.</th><th>Location</th><th>Zone</th><th>Area (in Ha)</th><th>From</th><th>To</th><th>Notification</th></tr></thead><tbody>';

  tbl += aData.map(function(d) {
    var filename = d.date + '-' + d.SO + '.pdf';
    return '<tr><td>' + d.SO + '</td><td>' + d.date + '</td><td>' + d.Sl + '</td><td>' + d.location + '</td><td>' + d.zone + '</td><td>' + d.area + '</td><td>' + d.from.useZone + d.from.subCode + '</td><td>' + d.to.useZone + d.to.subCode + '</td><td><a target="_blank" href="https://github.com/pastimer/delhi-landuse/blob/master/notifications-clu/' + filename + '">' + filename + '</a></td></tr>';
  }).join('');

  tbl += '</tbody></table></div>';

  return tbl;
}

function loadCLUByDate(selector) {
  var tbl = '<h3>Change of Land Use details -- Date-wise</h3>';
  tbl += createTableHtml(dataCLU);
  $(selector).html(tbl);
}

function loadCLUByUse(selector, direction) {
  var aData = d3.nest()
    .key(function(d) {
      if (direction == 'from') return d.from.useZone;
      if (direction == 'to') return d.to.useZone;
    })
    .sortKeys(d3.ascending)
    .entries(dataCLU);

  var aUses = gUseZones.getKeyValuePairs();

  var text = aData.map(function(a) {
    if (!aUses[a.key]) return '';

    var tbl = '<a name="use' + a.key + '"></a><h3>';
    if (direction == 'from') tbl += 'From Use: ';
    if (direction == 'to') tbl += 'To Use: ';

    tbl += a.key + ' ' + '(' + aUses[a.key][1] + ')</h3>';

    tbl += createTableHtml(a.values);
    return tbl;
  }).join('');

  $(selector).html(text);
}

function loadCLUByZone(selector) {
  var aData = d3.nest()
    .key(function(d) { return d.zone; })
    .sortKeys(d3.ascending)
    .entries(dataCLU);

  var text = aData.map(function(a) {
    var tbl = '<a name="zone' + a.key + '"></a><h3>Zone: ' + a.key + '</h3>';
    tbl += createTableHtml(a.values);
    return tbl;
  }).join('');

  $(selector).html(text);
}

function loadChartByUse(selector, direction) {
  var divChartId = "chartIVGFYjbhjbvhf";
  $(selector).html('<div id="' + divChartId + '" class="with-3d-shadow with-transitions" style="padding: 5px; height: 600px;"><svg></svg></div>');

  var dFrom = d3.nest()
    .key(function(d) { return d.from.useZone; })
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(d.area);})})
    .map(dataCLU);

  var dTo = d3.nest()
    .key(function(d) { return d.to.useZone; })
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(d.area);})})
    .map(dataCLU);

  var dataUse = gUseZones.getArray().map(function(u) {
    var area = 0;
    if (direction == 'both' || direction == 'from')
      area -= parseFloat(dFrom[u[0]]);
    if (direction == 'both' || direction == 'to')
      area += parseFloat(dTo[u[0]]);

    return {'label': u[0] + ' (' + u[1] + ')', 'value': area};
  });

  var graphData = [{key: 'Zone-wise net addition of land (in Ha) since MPD-2021', values: dataUse}];

  var opts = {
    chartContainer: '#' + divChartId + ' svg',
    duration: 500,
    rotateLabels: 0,
    margin: {bottom: 100, left: 70},
    xAxisLabel: 'Use Zone (as per MPD-2021)',
    yAxisLabel: 'Area gained (in Ha)',
    colours: gUseZones.getArray().map(function(u) { return u[2]; })
  };

  var chart;
  nv.addGraph(function() {
    chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
//      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
//      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .color(opts.colours)
    ;

    chart.xAxis
      .axisLabel(opts.xAxisLabel)
    ;

    chart.yAxis
      .axisLabel(opts.yAxisLabel)
      .axisLabelDistance(-5)
      .tickFormat(d3.format(',.01f'))
    ;

    d3.select(opts.chartContainer)
      .datum(graphData)
      .transition().duration(opts.duration)
      .call(chart);

    chart.discretebar.dispatch.on('elementDblClick', function(e) {
      //alert('New State:' + JSON.stringify(e));
      if (direction == 'both') return;
      loadCLUByUse(selector, direction);
      window.location = '#use' + e.point.label.split(' ')[0];
    });

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

function loadChartByZone(selector) {
  var divChartId = "chartIVGFYjbhjbvhf";
  $(selector).html('<div id="' + divChartId + '" class="with-3d-shadow with-transitions" style="padding: 5px; height: 600px;"><svg></svg></div>');

  var dAreas = d3.nest()
    .key(function(d) { return d.zone; })
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(d.area);})})
    .map(dataCLU);

  var dataZone = getPlanningZones().map(function(zone) {
    return {'label': zone, 'value': parseFloat(dAreas[zone]?dAreas[zone]:0)};
  });

  var graphData = [{key: 'Zone-wise CLU (in Ha) since MPD-2021', values: dataZone}];

  var opts = {
    chartContainer: '#' + divChartId + ' svg',
    duration: 500,
    rotateLabels: 0,
    margin: {bottom: 100, left: 70},
    xAxisLabel: 'Planning Zone',
    yAxisLabel: 'Area (in Ha) changed to a different use',
    colours: gUseZones.getArray().map(function(u) { return '#3333cc'; })
  };

  var chart;
  nv.addGraph(function() {
    chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
//      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
//      .tooltips(false)        //Don't show tooltips
      .showValues(true)       //...instead, show the bar value right on top of each bar.
//      .transitionDuration(350) //fails
      .color(opts.colours)
    ;

    chart.xAxis
      .axisLabel(opts.xAxisLabel)
    ;

    chart.yAxis
      .axisLabel(opts.yAxisLabel)
      .axisLabelDistance(-5)
      .tickFormat(d3.format(',.01f'))
    ;

    d3.select(opts.chartContainer)
      .datum(graphData)
      .transition().duration(opts.duration)
      .call(chart);

    chart.discretebar.dispatch.on('elementDblClick', function(e) {
      //alert('New State:' + JSON.stringify(e));
      loadCLUByZone('#main');
      window.location = '#zone' + e.point.label;
    });

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

/////////////////////////////////////
function loadNvd3ChartByZone(selector, direction) {
  var divChartId = "chartIVGFYjbhjbvhf";
  $(selector).html('<div id="' + divChartId + '" class="with-3d-shadow with-transitions" style="padding: 5px; height: 600px;"><svg></svg></div>');

  var dAreas = d3.nest()
    .key(function(d) { return d.zone; })
    .key(function(d) {
      if (direction == 'from') return d.from.useZone;
      if (direction == 'to') return d.to.useZone;
    })
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(d.area);})})
    .map(dataCLU);

  var aUseZones = gUseZones.getArray();
  var aPZones = getPlanningZones();

  var graphData = aUseZones.map(function(d,i) {
    return {
      key: d[0] + ' (' + d[1] + ')',
      color: d[2],
      values: aPZones.map( function(f, j) {
        return { x: f, y: dAreas[f] ? (dAreas[f][d[0]] ? dAreas[f][d[0]] : 0) : 0 } 
      })
    };
  });

  var opts = {
    duration: 500,
    rotateLabels: 0,
    margin: {bottom: 100, left: 70},
    xAxisLabel: 'Planning Zone (as per MPD-2021)',
    yAxisLabel: 'Area (in Ha) changed to a different use'
  };

  //TODO: annotation with totals in stacked view
  var chart;
  nv.addGraph(function() {
    chart = nv.models.multiBarChart()
      //.barColor(d3.scale.category20().range())
      .duration(opts.duration)
      .margin(opts.margin)
      .rotateLabels(opts.rotateLabels)
      .groupSpacing(0.1)
      .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
      .tooltips(true)        // show tooltips
      //.showValues(true)       //fails ...instead, show the bar value right on top of each bar.
      .stacked(true)
    ;

    chart.reduceXTicks(false);

    chart.xAxis
      .axisLabel(opts.xAxisLabel)
      .axisLabelDistance(35)
      .showMaxMin(false)
    ;

    chart.yAxis
      .axisLabel(opts.yAxisLabel)
      .axisLabelDistance(-5)
      .tickFormat(d3.format(',.01f'))
    ;

    chart.dispatch.on('renderEnd', function(){
      nv.log('Render Complete');
    });

    d3.select('#' + divChartId + ' svg')
      .datum(graphData)
      .transition().duration(opts.duration)
      .call(chart);

    nv.utils.windowResize(chart.update);

    chart.multibar.dispatch.on('elementDblClick', function(e) {
      //alert('New State:' + JSON.stringify(e));
      loadCLUByZone('#main');
      window.location = '#zone' + e.point.x;
    });

    //chart.multibar.dispatch.on('elementMouseover', function(e) {
      //alert('New State:' + JSON.stringify(e));
      //loadCLUByZone('#main');
      //window.location = '#zone' + e.point.x;
    //});

    return chart;
  });
}

//function as an example of creating multiBarChart with different data structure
function aabb(divId) {
  var divChartId = "chart3";
  $('#'+divId).html('<div id="chart3" class="nvd3" style="height: 500px;"></div>');

var opts = {
 "dom": "chart3",
"width":    900,
"height":    400,
"x": "Hair",
"y": "Freq",
"group": "Eye",
"type": "multiBarChart",
"id": "chart3" 
},
        data = [
 {"Hair": "Black", "Eye": "Brown", "Sex": "Male", "Freq":     32 },
{ "Hair": "Brown","Eye": "Brown","Sex": "Male","Freq":     53 },
{ "Hair": "Red","Eye": "Brown","Sex": "Male","Freq":     10 },
{ "Hair": "Blond","Eye": "Brown","Sex": "Male","Freq":      3 },
{ "Hair": "Black","Eye": "Blue","Sex": "Male","Freq":     11 },
{ "Hair": "Brown","Eye": "Blue","Sex": "Male","Freq":     50 },
{ "Hair": "Red","Eye": "Blue","Sex": "Male","Freq":     10 },
{ "Hair": "Blond","Eye": "Blue","Sex": "Male","Freq":     30 },
{ "Hair": "Black","Eye": "Green","Sex": "Male","Freq":      3 },
{ "Hair": "Brown","Eye": "Green","Sex": "Male","Freq":     15 },
{ "Hair": "Red","Eye": "Green","Sex": "Male","Freq":      7 },
{ "Hair": "Blond","Eye": "Green","Sex": "Male","Freq":      8 } 
]
  
      var data = d3.nest()
        .key(function(d){
          return opts.group === undefined ? 'main' : d[opts.group]
        })
        .entries(data)
      
      nv.addGraph(function() {
        var chart = nv.models[opts.type]()
          .x(function(d) { return d[opts.x] })
          .y(function(d) { return d[opts.y] })
          .width(opts.width)
          .height(opts.height)
         
       d3.select("#" + opts.id)
        .append('svg')
        .datum(data)
        .transition().duration(500)
        .call(chart);

       nv.utils.windowResize(chart.update);
       return chart;
      });
}
