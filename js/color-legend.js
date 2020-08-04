function ColorLegend(_parentElem, _data, _config) {
  var vis = this;

  vis.parentElement = _parentElem;
  vis.data = _data;
  vis.config = _config;
  vis.displayData = _data;

  vis.initVis();
}
ColorLegend.prototype.initVis = function() {
  var vis = this;

  vis.selected = $('#variable-choice').val();
  vis.tbody = d3.select('#' + vis.parentElement)
      .append('table')
      .attr('id', 'legend')
      .append('tbody');
  vis.wrangleData();
};
ColorLegend.prototype.wrangleData = function() {
  var vis = this;

  vis.displayData = vis.data.filter(d => d.name === vis.selected);
  console.log(vis.displayData);
  if (!(vis.displayData.map(d => d.level).includes('other'))) {
    vis.displayData.push({
      name: vis.selected,
      level: 'other',
      levelName: 'Other',
      description: 'Other or unknown'
    });
  }

  vis.updateVis()
};
ColorLegend.prototype.updateVis = function() {
  var vis = this;

  var rows = vis.tbody.selectAll('tr')
      .data(vis.displayData);
  rows.enter()
      .append('tr')
      .merge(rows)
      .call(makeRow, vis);
  rows.exit().remove();
};
ColorLegend.prototype.selectionChanged = function(newSelVar) {
  var vis = this;
  vis.selected = newSelVar;
  vis.wrangleData();
};
ColorLegend.prototype.highlight = function(d) {
  var vis = this;

  console.log(d)
  vis.tbody.selectAll('tr')
      .data(vis.displayData)
      .style('opacity', e => e.level === d ? 1 : .2);
};
ColorLegend.prototype.highlightClear = function() {
  var vis = this;

  vis.tbody.selectAll('tr').style('opacity', 1);
};

function makeRow(elem, vis) {
  elem.html("");
  elem.append('td')
      .attr('class', 'color-dot')
      .append('span')
      .attr('class', 'dot')
      .style('background-color', function(d) {
        var colorScale = colorScales[vis.selected] || defaultColorScale;
        return colorScale(d.level);
      });
  var textCell = elem.append('td');
  textCell.append('p')
      .text(d => d.displayLevel)
      .attr('class', 'label');
  textCell.append('p')
      .text(d => d.description)
      .attr('class', 'description');
}