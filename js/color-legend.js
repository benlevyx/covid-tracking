function ColorLegend(_parentElem, _data, _config) {
  var vis = this;

  initVis(vis);
  vis.initVis();
}
ColorLegend.prototype.initVis = function() {
  var vis = this;

  vis.y = d3.scaleLinear()
      .range([0, vis.height]);

  vis.wrangleData();
};
ColorLegend.prototype.wrangleData = function() {
  var vis = this;
};
ColorLegend.prototype.updateVis = function() {

};
ColorLegend.prototype.selectionChanged = function(newSelVar) {

};