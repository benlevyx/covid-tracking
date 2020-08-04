function makeAppTable(parentElem, data) {
  // $('#' + parentElem).bootstrapTable({
  //   pagination: true,
  //   search: true,
  //   columns: data.columns.map(d => {
  //     return {field: d, title: d};
  //   }),
  //   data: data
  // });
  data.forEach(d => {
    d.links = `<a href="${d.links}" target="_blank">${d.links}</a>`;
  });

  var table = d3.select('#' + parentElem)
      .append('table')
      .attr('data-toggle', 'table')
          .attr('class', 'display'),
      thead = table.append('thead'),
      tbody = table.append('tbody');

  thead.append('tr')
      .selectAll('th')
      .data(data.columns)
      .enter()
      .append('th')
      .text(d => var2question[d]);

  tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')
      .selectAll('td')
      .data(d => data.columns.map(c => {return {c: c, value: d[c]}; }))
      .enter()
      .append('td')
      .html(d => d.value);

  makeDataTable(table.node());
}
function makeDataTable(tableNode) {
  $(document).ready(function() {
    $(tableNode).DataTable({
      fixedHeader: true
    });
  });
}