function TimelineVis(_parentElem, _data, _config) {
  this.parentElement = _parentElem;
  this.data = _data;
  this.displayData = null;
  this.config = _config;



  this.initVis();
}

TimelineVis.prototype.initVis = function() {
  var vis = this;

  initVis(vis);

  vis.selected = vis.config.selectedVar;
  const statuses = [
      "proposed",
      "development",
      "released",
      "cancelled"
  ];
  // Setting up dates object
  var dateLookup = {};
  var dates = d3.timeDay
      .range(vis.config.startDate, vis.config.endDate)
      .map((d, i) => {
        dateLookup[d] = i;
        return {date: d, apps: []};
      });
  vis.data.apps.forEach(app => {
    var appDates = [];
    statuses.forEach(status => {
      var d = app[`date_${status}`];
      if (d) {
        appDates.push({date: d, status: status});
      }
    });

    for (var i = 0; i < appDates.length; i++) {
      var d1 = appDates[i].date,
          status = appDates[i].status,
          appCopy = Object.assign({}, app);
      appCopy.status = status;

      let d2;
      if (i === appDates.length - 1) {
        d2 = new Date(vis.config.endDate);
      } else {
        d2 = new Date(appDates[i + 1].date);
      }
      d2.setDate(d2.getDate() - 1);

      d3.timeDay.range(d1, d2).forEach((d => {
        dates[dateLookup[d]].apps.push(appCopy);
      }))
    }
  });

  console.log(dates);
  vis.data.dates = dates;

  vis.x = d3.scaleTime()
      .domain([vis.config.startDate, vis.config.endDate])
      .range([0, vis.width]);
  vis.y = d3.scaleLinear()
      .range([vis.height, 0])

  vis.stack = d3.stack();
  vis.area = d3.area()
      .x((d) => vis.x(d.data.date));

  // Setting up groups for visual elements
  vis.gArea = vis.svg.append('g').attr('class', 'area');
  vis.gAxes = vis.svg.append('g').attr('class', 'axes');

  vis.wrangleData();
};

TimelineVis.prototype.wrangleData = function() {
  var vis = this;


  vis.selectedLevels = vis.data.variables
      .filter(d => d.name === vis.selected)
      .map(d => d.level);
  vis.displayData = vis.data.dates.map((d, i) => {
    let res = {};
    vis.selectedLevels.forEach(level => {
      res[level] = 0;
    });
    d.apps.forEach(app => {
      res[app[vis.selected]]++;
    })
    return {date: d.date, values: res};
  })

  vis.stack.keys(vis.selectedLevels)
      .value((d, key) => d.values[key])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);
  vis.updateVis();
};

TimelineVis.prototype.updateVis = function() {
  var vis = this;

  // Update the scales
  var maxNum = d3.max(vis.displayData, d => sumValues(d.values));
  console.log(maxNum);
  vis.y.domain([0, maxNum])

  vis.area
      .y0(d => vis.y(d[0]))
      .y1(d => vis.y(d[1]))

  var stacked = vis.stack(vis.displayData);
  console.log(stacked);

  var areas = vis.gArea
      .selectAll('path.area')
      .data(stacked)

  areas.enter()
      .append('path')
      .attr('class', 'area')
      .attr('d', vis.area)
      .style('fill', d => vis.fillColor(d, vis));
};

TimelineVis.prototype.fillColor = function(d, vis) {
  if (vis.selected != null) {
    return colorScales[vis.selected](d.key);
  } else {
    return 'var(--other)';
  }
}