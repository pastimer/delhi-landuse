function getUseZones() {
  var aUseZones = [
     ['A', 'Green Belt', '#66ff66'],
     ['C', 'Commercial', '#ff0033'],
     ['G', 'Government', '#b87333'],
     ['M', 'Industrial', 'purple'],
     ['P', 'Recreational', 'green'],
     ['PS', 'Institutional', '#3333cc'],
     ['R', 'Residential)', '#ffff33'],
     ['T', 'Transportation', '#000000'],
     ['U', 'Utility', 'pink']
  ];

  return aUseZones;
}

function getPlanningZones() {
  var aZones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K-I', 'K-II', 'L', 'M', 'N', 'O', 'P-I', 'P-II'];

  return aZones;
}

function loadOverview(divId) {
  $('#' + divId).load('overview.html');
}

function loadCLUData() {
  var tbl = '<div class="table-responsive"><table class="table table-striped"><thead><tr><th>SO No.</th><th>Date</th><th>Item no.</th><th>Location</th><th>Zone</th><th>Area (in Ha)</th><th>From</th><th>To</th></tr></thead><tbody>';
  for (var i = 0; i < dataCLU.length; i++) {
    tbl += '<tr><td>' + dataCLU[i].SO + '</td><td>' + dataCLU[i].date + '</td><td>' + dataCLU[i].Sl + '</td><td>' + dataCLU[i].location + '</td><td>' + dataCLU[i].zone + '</td><td>' + dataCLU[i].area + '</td><td>' + dataCLU[i].from.useZone + dataCLU[i].from.subCode + '</td><td>' + dataCLU[i].to.useZone + dataCLU[i].to.subCode + '</td></tr>';
  }
  tbl += '</tbody></table></div>';
  $('#main').html(tbl);
}

function loadAnalysisByUse() {
}

function loadAnalysisByZone() {
}

function loadChartByUse(divId) {
  if (!gvLoaded) {
    alert('Wait for Google Visualization to load');
    return;
  }

  var d = {'A': 0, 'C': 0, 'G': 0, 'M': 0, 'P': 0, 'PS': 0, 'R': 0, 'T': 0, 'U': 0};
  for (var i = 0; i < dataCLU.length; i++) {
    if (dataCLU[i].area > 0) {
      d[dataCLU[i].from.useZone] -= dataCLU[i].area;
      d[dataCLU[i].to.useZone] += dataCLU[i].area;
    }
  }

  var dataForGraph = [
     ['Use Zone (as per MPD-2021)', 'Area gained (in Ha)', { role: 'style' }, { role: 'annotation' } ],
     ['A (Green Belt)', d.A, '#66ff66', 'A' ],
     ['C (Commercial)', d.C, '#ff0033', 'C' ],
     ['G (Government)', d.G, '#b87333', 'G' ],
     ['M (Industrial)', d.M, 'purple', 'M' ],
     ['P (Recreational)', d.P, 'green', 'P' ],
     ['PS (Institutional)', d.PS, '#3333cc', 'PS' ],
     ['R (Residential)', d.R, '#ffff33', 'R' ],
     ['T (Transportation)', d.T, '#000000', 'T' ],
     ['U (Utility)', d.U, 'pink', 'U' ]
  ];

  var data = google.visualization.arrayToDataTable(dataForGraph);

  var options = {
    height: 550,
    chartArea: {left: 60, top: 30, width: '80%', height: '80%'},
    title: 'Zone-wise net addition of land (in Ha) since MPD-2021',
    titleTextStyle: {
      fontSize: 16, color: 'black',
      bold: true, italic: false
    },
    legend: {position: 'none'},
    focusTarget: 'category',
    hAxis: {
      title: dataForGraph[0][0],
      textStyle: {
        fontSize: 12, color: 'black',
        bold: false, italic: false
      },
      titleTextStyle: {
        fontSize: 14, color: 'black',
        bold: false, italic: true
      },
      slantedText: true,
      slantedTextAngle: 30
    },
    vAxis: {
      title: dataForGraph[0][1],
      textStyle: {
        fontSize: 12, color: 'black',
        bold: false, italic: false
      },
      titleTextStyle: {
        fontSize: 14, color: 'black',
        bold: false, italic: true
      },
    },
    viewWindowMode: 'pretty',
    minValue: -310, maxValue: 210,
    animation: {startup: true, duration: 1000}
  };

  var chart = new google.visualization.ColumnChart(document.getElementById(divId));
  chart.draw(data, options);
}

function loadChartByZone(divId) {
  if (!gvLoaded) {
    alert('Wait for Google Visualization to load');
    return;
  }

  var d = {};
  for (var i = 0; i < dataCLU.length; i++) {
    if (dataCLU[i].area > 0) {
      d[dataCLU[i].zone] = d[dataCLU[i].zone] ? d[dataCLU[i].zone] + dataCLU[i].area : dataCLU[i].area;
    }
  }

  var arrZones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K-I', 'K-II', 'L', 'M', 'N', 'O', 'P-I', 'P-II'];
  var dataZone = arrZones.map(function(val) {
    var area = d[val] ? d[val] : 0;
    return [val, area, val];
  });

  var dataHead = ['Planning Zone', 'Area (in Ha) changed to a different use', {role: 'annotation'}];
  dataZone.splice(0, 0, dataHead);

  var data = google.visualization.arrayToDataTable(dataZone);

  var options = {
    height: 550,
    chartArea: {left: 60, top: 30, width: '80%', height: '80%'},
    title: 'Zone-wise CLU (in Ha) since MPD-2021',
    titleTextStyle: {
      fontSize: 16, color: 'black',
      bold: true, italic: false
    },
    legend: {position: 'none'},
    focusTarget: 'category',
    hAxis: {
      title: dataHead[0],
      textStyle: {
        fontSize: 12, color: 'black',
        bold: false, italic: false
      },
      titleTextStyle: {
        fontSize: 14, color: 'black',
        bold: false, italic: true
      }
    },
    vAxis: {
      title: dataHead[1],
      textStyle: {
        fontSize: 12, color: 'black',
        bold: false, italic: false
      },
      titleTextStyle: {
        fontSize: 14, color: 'black',
        bold: false, italic: true
      },
    },
    viewWindowMode: 'pretty',
    minValue: -310, maxValue: 210,
    animation: {startup: true, duration: 1000}
  };

  var chart = new google.visualization.ColumnChart(document.getElementById(divId));
  chart.draw(data, options);
}

/////////////////////////////////////
function loadNvd3ChartByZone(divId) {
  var divChartId = "chartIVGFYjbhjbvhf";
  $('#'+divId).html('<div id="' + divChartId + '" class="with-3d-shadow with-transitions" style="padding: 5px; height: 600px;"><svg></svg></div>');

  var dAreas = d3.nest()
    .key(function(d) { return d.zone; })
    .key(function(d) { return d.from.useZone; })
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return parseFloat(d.area);})})
    .map(dataCLU);

  var aUseZones = getUseZones();
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

//  console.log('td', graphData);

  var opts = {
    duration: 500,
    rotateLabels: 0,
    margin: {bottom: 100, left: 70},
    xAxisLabel: 'Use Zone (as per MPD-2021)',
    yAxisLabel: 'Area (in Ha) changed to a different use'
  };

  //TODO: annotation with totals in stacked view
  var chart;
  nv.addGraph(function() {
    chart = nv.models.multiBarChart()
//      .barColor(d3.scale.category20().range())
      .duration(opts.duration)
      .margin(opts.margin)
      .rotateLabels(opts.rotateLabels)
      .groupSpacing(0.1)
    ;

    chart.reduceXTicks(false).staggerLabels(false);

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
      .call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) {
      nv.log('New State:', JSON.stringify(e));
    });
    chart.state.dispatch.on('change', function(state){
      nv.log('state', JSON.stringify(state));
    });

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
