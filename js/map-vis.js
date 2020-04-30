/**
 * MapVis -- Object constructor function
 * @param _parentElem
 * @param _data
 * @param _config
 * @constructor
 */
function MapVis(_parentElem, _data, _config) {
  var vis = this;
  vis.parentElement = _parentElem;
  vis.data = _data;
  vis.config = _config;
  vis.selectedVar = vis.config.selectedVar || null;
  vis.noise = vis.config.noise || 20;

  initVis(vis);
  vis.initVis();
}
MapVis.prototype.initVis = function() {
  var vis = this;

  vis.projection = d3.geoMercator()
      .translate([vis.width / 2, vis.height * 2 / 3])
      .scale(vis.width / (2 * Math.PI));
  vis.geoPath = d3.geoPath().projection(vis.projection);
  vis.zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (d) => vis.zoomed(vis));
  d3.select('#' + vis.parentElement).call(vis.zoom);
  vis.countries = topojson.feature(vis.data.geo, vis.data.geo.objects.countries).features;
  vis.centroids = vis.countries.map(d => {
    return {country: d.properties.name, centroid: vis.geoPath.centroid(d)};
  });

  // Initializing color scales
  var dataTypeColors = d3.schemeRdYlBu[3];
  dataTypeColors.push('var(--other)');

  vis.colorScales = {
    central_id_storage: d3.scaleOrdinal()
        .domain(["no", "yes"])
        .range(['var(--decentralized)', 'var(--centralized)']),
    data_persistence_days: d3.scaleSequential()
        .domain([0, d3.max(vis.data.apps, d => d.data_persistence_days)])
        .interpolator(d3.interpolateOrRd),
    data_type: d3.scaleOrdinal()
        .domain(['gps', 'gps + bluetooth', 'bluetooth'])
        .range(['var(--gps)', 'var(--gps-bluetooth)', 'var(--bluetooth)', 'var(--other)']),
    government: d3.scaleOrdinal()
        .domain(['no', 'yes'])
        .range(['var(--no-government)', 'var(--government)']),
    open_source: d3.scaleOrdinal()
        .domain(['no', 'yes'])
        .range(['var(--no)', 'var(--open-source)']),
    opt_in: d3.scaleOrdinal()
        .domain(['no', 'yes'])
        .range(['var(--no)', 'var(--opt-in)']),
    protocol: d3.scaleOrdinal()
        .domain(['BlueTrace', 'p2pkit', 'SafePaths', 'PEPP-PT', 'D3PT', 'TCN', 'Apple/Google', 'other'])
  };

  // Tooltip
  vis.tooltip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        console.log(d);
        return `<p class="label">${d.name}</p>` +
               `<br/>` +
               `<p class="description">${d.country}</p>` +
               `<p class="description">${d.protocol}</p>`;
      });
  vis.svg.call(vis.tooltip);

  vis.wrangleData();
};
MapVis.prototype.wrangleData = function() {
  var vis = this;
  vis.nPerCountry = d3.nest()
      .key(d => d.country)
      .rollup(v => v.length)
      .entries(vis.data.apps);

  vis.updateVis();
};
MapVis.prototype.updateVis = function() {
  var vis = this;

  var countries = vis.svg.selectAll('path.country')
      .data(vis.countries);

  countries.enter()
      .append('path')
      .attr('class', 'country')
      .merge(countries)
      .attr('d', vis.geoPath);

  // Drawing markers for apps
  var markers = vis.svg.selectAll('circle.marker')
      .data(vis.data.apps);

  markers.enter()
      .append('circle')
      .attr('class', 'marker')
      .attr('cx', d => position(d, vis, 0))
      .attr('cy', d => position(d, vis, 1))
      .merge(markers)
      .style('fill', d => fillColor(d, vis))
      .style('stroke', d => fillColor(d, vis))
      .on('mouseover', function(e) { vis.mouseover(e, vis) })
      .on('mouseout', function(e) { vis.mouseout(e, vis) });
};
MapVis.prototype.zoomed = function(vis) {
  vis.svg.selectAll('path.country')
      .attr('transform', d3.event.transform);
  vis.svg.selectAll('circle.marker')
      .attr('transform', d3.event.transform);
};
MapVis.prototype.selectionChanged = function(newSelVar) {
  var vis = this;

  vis.selectedVar = newSelVar;
  vis.wrangleData();
};
MapVis.prototype.mouseover = function(elem, vis) {
  vis.tooltip.show(elem);
  colorLegend.highlight(elem[vis.selectedVar]);
};
MapVis.prototype.mouseout = function(elem, vis) {
  vis.tooltip.hide();
  colorLegend.highlightClear();
};

function fillColor(d, vis) {
  if (vis.selectedVar != null) {
    var col = vis.colorScales[vis.selectedVar](d[vis.selectedVar]);
    console.log(col);
    return col;
  } else {
    return 'black';
  }
}
function position(d, vis, xy) {
  var countryGeo = vis.centroids.find(e => e.country === d.country);
  if (countryGeo != null) {
    nApps = vis.nPerCountry.find(e => e.key === d.country).value;
    var pos = countryGeo.centroid[xy];
    if (nApps > 1) {
      // Add noise
      pos = pos + (Math.random() - .5) * vis.noise;
    }
    return pos;
  } else {
    console.log(d.country)
  }
}