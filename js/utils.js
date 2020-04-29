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
