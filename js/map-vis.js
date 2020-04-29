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

  initVis(vis);
  vis.initVis();
}
MapVis.prototype.initVis = function() {
  var vis = this;

  vis.projection = d3.geoEqualEarth();
  vis.geoPath = d3.geoPath().projection(vis.projection);
  vis.countries = topojson.feature(vis.data.geo, vis.data.geo.objects.countries).features;
  vis.wrangleData();
};
MapVis.prototype.wrangleData = function() {
  var vis = this;


  vis.updateVis();
};
MapVis.prototype.updateVis = function() {
  var vis = this;

  vis.svg.selectAll('path.country')
      .data(vis.countries)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', vis.geoPath);
};