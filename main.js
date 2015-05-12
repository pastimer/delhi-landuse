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

 var data = google.visualization.arrayToDataTable([
     ['Use Zone', 'Area gained (in Ha)', { role: 'style' }, { role: 'annotation' } ],
     ['A (Green Belt)', d.A, '#66ff66', 'A' ],
     ['C (Commercial)', d.C, '#ff0033', 'C' ],
     ['G (Government)', d.G, '#b87333', 'G' ],
     ['M (Industrial)', d.M, 'purple', 'M' ],
     ['P (Recreational)', d.P, 'green', 'P' ],
     ['PS (Institutional)', d.PS, '#3333cc', 'PS' ],
     ['R (Residential)', d.R, '#ffff33', 'R' ],
     ['T (Transportation)', d.T, '#000000', 'T' ],
     ['U (Utility)', d.U, 'pink', 'U' ]
  ]);

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
      title: 'Use Zone (as per MPD-2021)',
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
      title: 'Area gained (in Ha)',
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

  var d = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0, 'J': 0, 'K-I': 0, 'K-II': 0, 'L': 0, 'M': 0, 'N': 0, 'O': 0, 'P-I': 0, 'P-II': 0};
  for (var i = 0; i < dataCLU.length; i++) {
    if (dataCLU[i].area > 0) {
      d[dataCLU[i].zone] += dataCLU[i].area;
    }
  }

  var arrZones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K-I', 'K-II', 'L', 'M', 'N', 'O', 'P-I', 'P-II'];

  var dataZone = [ ['Planning Zone', 'Area notified under CLU (in Ha)', {role: 'annotation'} ] ];
  for (var i = 0; i < arrZones.length; i++) {
    dataZone.push([arrZones[i], d[arrZones[i]], arrZones[i]]);
  }

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
      title: 'Planning Zone',
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
      title: 'Area notified under CLU (in Ha)',
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

