// Loading data
Promise.all([
    d3.csv('data/project-data - all-apps.csv'),
    d3.json('data/countries-50m.json')
]).then(function(data) {
  var appData = data[0],
      countries = data[1];
  var mapVis = new MapVis(
      'map-vis',
      {apps: appData, geo: countries},
      {width: 800, height: 600}
      )
});
