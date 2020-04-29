// Loading data
var mapVis;


Promise.all([
    d3.csv('data/project-data - all-apps.csv'),
    d3.json('data/countries-50m.json')
]).then(function(data) {
  var appData = data[0],
      countries = data[1];
  appData.forEach(d => {
    d.data_persistence_days = +d.data_persistence_days;
  });
  var config = {
    height: 600,
    selectedVar: 'data_type'
  };
  mapVis = new MapVis(
      'map-vis',
      {apps: appData, geo: countries},
      config)
});
