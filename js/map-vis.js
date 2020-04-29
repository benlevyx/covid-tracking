/**
 * MapVis -- Object constructor function
 * @param _parentElem
 * @param _data
 * @param _config
 * @constructor
 */
function MapVis(_parentElem, _data, _config) {
  var vis = this;
  vis.parentElem = _parentElem;
  vis.data = _data;
  vis.config = _config;

  initVis(vis);
  vis.initVis();
}
MapVis.prototype.initVis = function() {

};
MapVis.prototype.wrangleData = function() {

};
MapVis.prototype.updateVis = function() {

};