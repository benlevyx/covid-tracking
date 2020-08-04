/**
 * makeSvg - initialize the SVG element for this vis. Assumes that the vis
 *           already has attributes `height`, `width`, and `margin` set.
 * @param vis -- The visualization object
 * @returns {*|jQuery} -- A d3 selection to the `g` element within the SVG
 *                        (following the d3 margin convention)
 */
function makeSvg(vis) {
  return d3.select('#' + vis.parentElement)
      .append('div')
      .attr('class', 'svg-container ')
      .append('svg')
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .append('g')
      .attr('transform', 'translate(' + vis.margin.left + ',' + vis.margin.top + ')');
}

/**]
 * initVis - Unpack the `config` attribute, set height and width, call makeSvg.
 * @param vis -- The visualization object.
 */
function initVis(vis) {
  vis.margin = vis.config.margin || {'top': 10, 'bottom': 40, 'left': 40, 'right': 10};

  var $parentElem = $('#' + vis.parentElement);
  vis.width = vis.config.width || $parentElem.width() - vis.margin.left - vis.margin.right;
  vis.height = vis.config.height || $parentElem.height() - vis.margin.top - vis.margin.bottom;

  vis.svg = makeSvg(vis)
}

/**
 * wrap - Utility function to wrap long pieces of text into a fixed width.
 *        Note: converts text into an array of `tspan` objects, which might
 *        be harder to position.
 * @param text  -- A d3 selector to the text annotation
 * @param width -- The number of pixels to limit the width to.
 */
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr('x'),
        y = text.attr("y"),
        dy = 0,
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

/**
 * Utility function for cutting of a number if it is outside a specified range.
 * @param n   -- The number to be clamped
 * @param min -- Floor
 * @param max -- Ceiling
 * @returns {number}
 */
function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

/**
 * Utility function to capitalize the first letter of a string.
 * @param s -- String to be capitalized
 * @returns {string}
 */
function capitalizeFirstLetter(s) {
  return s.replace(/^\w/, c => c.toUpperCase());
}

/**
 * Determine the number of rows and columns to compactly lay out `n` points
 * @param n
 */
function getRowsCols(n) {
  let m = 1,
      r = 1,
      c = 1,
      i = 0;
  while (n > m) {
    if (i % 2 === 1) {
      // Add a row
      r++;
    } else {
      c++;
    }
    m = r * c;
    i++;
  }
  return [r, c];
}

/**
 * Return the sum of all values in an object
 * @param obj
 * @returns {number}
 */
function sumValues( obj ) {
  var sum = 0;
  for( var el in obj ) {
    if( obj.hasOwnProperty( el ) ) {
      sum += parseFloat( obj[el] );
    }
  }
  return sum;
}


// Initializing color scales
var dataTypeColors = d3.schemeRdYlBu[3];
dataTypeColors.push('var(--unknown)');

const colorScales = {
  central_id_storage: d3.scaleOrdinal()
      .domain(["no", "yes"])
      .range(['var(--decentralized)', 'var(--centralized)'])
      .unknown('var(--unknown)'),
  data_persistence_days: d3.scaleSequential()
      .domain([0, 30])
      .interpolator(d3.interpolateOrRd),
  data_type: d3.scaleOrdinal()
      .domain(['gps', 'gps + bluetooth', 'bluetooth', ''])
      .range(['var(--gps)', 'var(--gps-bluetooth)', 'var(--bluetooth)', 'var(--other)'])
      .unknown('var(--unknown)'),
  government: d3.scaleOrdinal()
      .domain(['no', 'yes'])
      .range(['var(--no-government)', 'var(--government)'])
      .unknown('var(--unknown)'),
  opt_in: d3.scaleOrdinal()
      .domain(['no', 'yes'])
      .range(['var(--no-opt-in)', 'var(--opt-in)'])
      .unknown('var(--unknown)'),
  protocol: d3.scaleOrdinal()
      .domain(['OpenTrace', 'Whisper', 'SafePaths', 'PEPP-PT', 'ROBERT', 'DP3T', 'TCN', 'Apple/Google', 'Safe2'])
      .range(['var(--opentrace)', 'var(--whisper)', 'var(--safepaths)', 'var(--pepppt)', 'var(--pepppt)', 'var(--dp3t)', 'var(--tcn)', 'var(--applegoogle)', 'var(--safe2)'])
      .unknown('var(--unknown)'),
  status: d => `var(--${d})`
};

const colors = {
  policy: null,
  government: null
}
const defaultColorScale = d3.scaleOrdinal()
    .domain(['no', 'unknown', 'yes'])
    .range(['var(--no)', 'var(--unknown)', 'var(--yes)'])
    .unknown('var(--unknown)')


function swap(obj){
  var ret = {};
  for(var key in obj){
    ret[obj[key]] = key;
  }
  return ret;
}