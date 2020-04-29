/**
 * RadialVis -- Object constructor function
 * @param _parentElem
 * @param _data
 * @param _config
 * @constructor
 */
function RadialVis(_parentElem, _data, _config) {
  var vis = this;

  vis.parentElem = _parentElem;
  vis.data = _data;
  vis.config = _config;

  initVis(vis);
  vis.initVis();
}
RadialVis.prototype.initVis = function() {
  // Set up different axes

};
RadialVis.prototype.updateVis = function() {

};