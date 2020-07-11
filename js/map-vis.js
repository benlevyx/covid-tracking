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
  vis.baseRadius = vis.config.baseRadius || 10;

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

  // Radius scale for markers
  vis.radius = d3.scaleSqrt()
      .range([3, 10]);


  // Tooltip
  vis.tooltip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return `<p class="label">${d.country}</p>` +
               `<br/>` +
               `<p class="description">${d.names.join('<br/>')}</p>`
      });
  vis.svg.call(vis.tooltip);

  vis.wrangleData();
};
MapVis.prototype.wrangleData = function() {
  var vis = this;

  var nested = d3.nest()
      .key(d => d.country)
      .key(d => d[vis.selectedVar])
      .rollup(v => {
        return {
          count: v.length,
          names: v.map(d => d.name)
        }
      })
      .entries(vis.data.apps);

  vis.grouped = [];
  nested.forEach(d => {
    d.values.forEach((e, i) => {
      vis.grouped.push({
        country: d.key,
        count: e.value.count,
        names: e.value.names,
        idx: i,
        value: e.key
      })
    })
  });
  console.log(vis.grouped);

  vis.nPerCountry = d3.nest()
      .key(d => d.country)
      .rollup(v => v.length)
      .entries(vis.grouped);


  vis.updateVis();
};
MapVis.prototype.updateVis = function() {
  var vis = this;

  vis.radius.domain([1, d3.max(vis.grouped, d => d.count)]);

  var countries = vis.svg.selectAll('path.country')
      .data(vis.countries);

  countries.enter()
      .append('path')
      .attr('class', 'country')
      .merge(countries)
      .attr('d', vis.geoPath);

  var markers = vis.svg.selectAll('circle.marker')
      .data(vis.grouped);

  markers.enter()
      .append('circle')
      .attr('class', 'marker')
      .merge(markers)
      .attr('cx', d => position(d, vis, 0))
      .attr('cy', d => position(d, vis, 1))
      .style('fill', d => fillColor(d, vis))
      .style('r', d => vis.radius(d.count))
      .style('stroke', d => fillColor(d, vis))
      .on('mouseover', function(e) { vis.mouseover(e, vis) })
      .on('mouseout', function(e) { vis.mouseout(e, vis) });
  markers.exit().remove();

  // Drawing legend
  var max = d3.max(vis.grouped, d => d.count),
      legendVals = d3.range(1, max, 2);

  console.log(legendVals);

  var gLegendSize = vis.svg.append('g')
      .attr('class', 'legend-size')
      .attr('transform', `translate(${0.1 * vis.width}, ${0.8 * vis.height})`);

  var sizeMarkers = gLegendSize.append('g')
      .attr('class', 'size-markers')
      .selectAll('circle.marker')
      .data(legendVals);

  sizeMarkers.enter()
      .append('circle')
      .attr('class', 'marker')
      .merge(sizeMarkers)
      .attr('cx', 0)
      .attr('cy', (d, i) => i * 20)
      .style('r', d => vis.radius(d))
      .style('fill', 'var(--bluetooth)')
      .style('stroke', 'var(--bluetooth)');
  sizeMarkers.exit().remove();

  var sizeLabs = gLegendSize.append('g')
      .attr('class', 'size-labs')
      .attr('transform', 'translate(17, 6)')
      .selectAll('text.label')
      .data(legendVals);

  sizeLabs.enter()
      .append('text')
      .attr('class', 'label')
      .merge(sizeLabs)
      .attr('x', 0)
      .attr('y', (d, i) => i * 20)
      .text(d => d);
  sizeLabs.exit().remove();

  gLegendSize.append('text')
      .attr('class', 'title')
      .text('Number of apps')
      .attr('transform', 'translate(-25, -15)');

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

function position(d, vis, xy) {
  var country,
      offset = 0;
  if (specialCentroids[d.country]) {
    country = specialCentroids[d.country].anchor || d.country;
    offset = specialCentroids[d.country].offset[xy] || offset;
  } else {
    country = d.country;
  }
  var countryGeo = vis.centroids.find(e => e.country === country);
  if (countryGeo != null) {
    nApps = vis.nPerCountry.find(e => e.key === d.country).value;
    var pos = countryGeo.centroid[xy];
    if (nApps > 1) {
      // Add offset
      // pos = pos + (Math.random() - .5) * vis.noise;
      var [rows, cols] = getRowsCols(nApps),
          rowcol;
      if (xy === 0) {
        rowcol = d.idx % cols - (cols - 1) / 2;
      } else {
        rowcol = Math.floor((d.idx) / rows) - (rows - 1) / 2;
        // rowcol = 0;
      }
      var jitter = rowcol * vis.baseRadius;
      pos = pos + jitter;
    }
    return pos + offset;
  } else {
  }
}

function fillColor(d, vis) {
  if (vis.selectedVar != null) {
    return colorScales[vis.selectedVar](d.value);
  } else {
    return 'var(--other)';
  }
}

const specialCentroids = {
  'United States': {
    offset: [50, 25]
  },
  'Canada': {
    offset: [0, 25]
  },
  'Hong Kong': {
    anchor: 'Viet Nam',
    offset: [5, -5]
  },
  'Singapore': {
    anchor: 'Malaysia',
    offset: [-10, 5]
  },
  'Bahrain': {
    anchor: 'Saudi Arabia',
    offset: [12, -1]
  }
};