// Loading data
var mapVis,
    colorLegend,
    timelineVis;

Promise.all([
    d3.csv('data/all-apps.csv'),
    d3.csv('data/apps_scored.csv'),
    d3.json('data/countries-110m.json'),
    d3.csv('data/variables.csv'),
    d3.csv('data/events.csv')
]).then(function(data) {
  let appData, appScores, countries, variables, eventData;
  [appData, appScores, countries, variables, eventData] = data;

  appData.forEach(d => {
    d.data_persistence_days = +d.data_persistence_days;
    ['date_proposed', 'date_dev', 'date_released', 'date_cancelled'].forEach(c => {
      d[c] = d[c] === "" ? null : new Date(d[c]);
    })
  });

  appScores.forEach(d => {
    for (var e in question2var) {
      var varName = question2var[e];
      var f = replaceFuncs[varName] || replaceFuncs.other;
      d[varName] = f(d[e]);
      delete d[e];
    }
  });
  appScores.columns = Object.keys(var2question);
  console.log(appScores);

  mapVis = new MapVis(
      'map-vis',
      {apps: appScores, geo: countries},
      {height: 400, selectedVar: 'decentralized_matching'});

  colorLegend = new ColorLegend('color-legend', variables, {});

  // timelineVis = new TimelineVis(
  //     'timeline-vis',
  //     {apps: appData, events: eventData, variables: variables},
  //     {
  //       height: 300,
  //       startDate: new Date('2019-12-30'),
  //       endDate: new Date('2020-06-30'),
  //       selectedVar: 'data_type'
  //     })

  makeAppTable('app-table', appData);
});

const replaceFuncs = {
  other: x => otherReplace[x] || x,
  storage_time_limited: x => x === 'no' || x === 'unknown' ? x : 'yes',
  only_contacts: x => x === 'na' ? 'unknown' : (x === 'yes' ? x : 'no'),
  ble_only: function(x) {
    if (x === 'ble') {
      return 'yes'
    } else if (x.match(/ble/) || x === 'unknown') {
      return 'unknown'
    } else {
      return 'no'
    }
  },
  verify_test: x => x === 'na' || x === 'unknown' ? 'unknown' : (x === 'yes' ? x : 'no')
}
const otherReplace = {
  'na': 'unknown',
  'no (WOM vouchers)': 'no',
  'maybe': 'unknown',
  'no (public spaces)': 'no',
  'maybe (blockchain)': 'unknown',
  'both': 'yes',
  'android only': 'yes',
  'iOS only': 'no',
}