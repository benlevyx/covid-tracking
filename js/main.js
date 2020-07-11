// Loading data
var mapVis,
    colorLegend,
    timelineVis;

Promise.all([
    d3.csv('data/all-apps.csv'),
    d3.json('data/countries-110m.json'),
    d3.csv('data/variables.csv'),
    d3.csv('data/events.csv')
]).then(function(data) {
  var appData = data[0],
      countries = data[1],
      variables = data[2],
      eventData = data[3];
  appData.forEach(d => {
    d.data_persistence_days = +d.data_persistence_days;
    ['date_proposed', 'date_dev', 'date_released', 'date_cancelled'].forEach(c => {
      d[c] = d[c] === "" ? null : new Date(d[c]);
    })
  });

  mapVis = new MapVis(
      'map-vis',
      {apps: appData, geo: countries},
      {height: 400, selectedVar: 'data_type'});

  colorLegend = new ColorLegend('color-legend', variables, {});

  timelineVis = new TimelineVis(
      'timeline-vis',
      {apps: appData, events: eventData, variables: variables},
      {
        height: 300,
        startDate: new Date('2019-12-30'),
        endDate: new Date('2020-06-30'),
        selectedVar: 'data_type'
      })

  makeAppTable('app-table', appData);
});
