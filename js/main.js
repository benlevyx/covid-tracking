// Loading data
var mapVis,
    colorLegend;


Promise.all([
    d3.csv('data/project-data - all-apps.csv'),
    d3.json('data/countries-110m.json'),
    d3.csv('data/project-data - variables.csv')
]).then(function(data) {
  var appData = data[0],
      countries = data[1];
  appData.forEach(d => {
    d.data_persistence_days = +d.data_persistence_days;
  });
  var config = {
    height: 400,
    selectedVar: 'data_type'
  };
  mapVis = new MapVis(
      'map-vis',
      {apps: appData, geo: countries},
      config);

  colorLegend = new ColorLegend('color-legend', data[2], {});
  makeAppTable('app-table', appData);
});
