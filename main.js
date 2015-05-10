function loadOverview(divId) {
  $('#' + divId).load('overview.html');
}

function loadCLUData() {
  var tbl = '<div class="table-responsive"><table class="table table-striped"><thead><tr><th>SO No.</th><th>Date</th><th>Item no.</th><th>Location</th><th>Zone</th><th>Area (in Ha)</th><th>From</th><th>To</th></tr></thead><tbody>';
  for (var i = 0; i < dataCLU.length; i++) {
    tbl += '<tr><td>' + dataCLU[i]['SO'] + '</td><td>' + dataCLU[i]['Date'] + '</td><td>' + dataCLU[i]['Sl'] + '</td><td>' + dataCLU[i]['Location'] + '</td><td>' + dataCLU[i]['Zone'] + '</td><td>' + dataCLU[i]['Area'] + '</td><td>' + dataCLU[i]['F-Use'] + dataCLU[i]['F-SubCode'] + '</td><td>' + dataCLU[i]['T-Use'] + dataCLU[i]['T-SubCode'] + '</td></tr>';
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
    if (dataCLU[i]['Area'] > 0) {
      d[dataCLU[i]['F-Use']] -= dataCLU[i]['Area'];
      d[dataCLU[i]['T-Use']] += dataCLU[i]['Area'];
    }
  }

 var data = google.visualization.arrayToDataTable([
     ['Use Zone', 'Area gained (in Ha)', { role: 'style' }, { role: 'annotation' } ],
     ['A (Green Belt)', d.A, '#00ff00', 'A' ],
     ['C (Commercial)', d.C, 'red', 'C' ],
     ['G (Government)', d.G, '#b87333', 'G' ],
     ['M (Industrial)', d.M, 'purple', 'M' ],
     ['P (Recreational)', d.P, 'green', 'P' ],
     ['PS (Institutional)', d.PS, 'blue', 'PS' ],
     ['R (Residential)', d.R, 'yellow', 'R' ],
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

