// scenes.js

/**
 * Renders a scatter plot with gridlines, animated points, and HTML tooltip.
 *
 * @param {d3.Selection} svg       The <svg> selection.
 * @param {Array} data            Array of data objects.
 * @param {string} xField         Field name for x-values.
 * @param {string} yField         Field name for y-values.
 * @param {string} xLabel         Axis label for x.
 * @param {string} yLabel         Axis label for y.
 */
export function renderScatter(svg, data, xField, yField, xLabel, yLabel) {
  svg.selectAll("*").remove();

  // filter invalid
  const filtered = data.filter(d =>
    !isNaN(d[xField]) && !isNaN(d[yField])
  );

  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const width  = +svg.attr("width")  - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top  - margin.bottom;

  const x = d3.scaleLinear()
    .domain(d3.extent(filtered, d => d[xField])).nice()
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain(d3.extent(filtered, d => d[yField])).nice()
    .range([height, 0]);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // gridlines
  g.append("g")
    .attr("class", "grid x-grid")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
      .tickSize(-height)
      .tickFormat("")
    );

  g.append("g")
    .attr("class", "grid y-grid")
    .call(d3.axisLeft(y)
      .tickSize(-width)
      .tickFormat("")
    );

  // axes
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
  g.append("g")
    .call(d3.axisLeft(y));

  // axis labels
  g.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text(xLabel);

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .text(yLabel);

  // create or select tooltip div
  const tooltip = d3.select("body")
    .selectAll(".tooltip")
    .data([0])
    .join("div")
      .attr("class", "tooltip");

  // animated circles
  g.selectAll("circle")
    .data(filtered)
    .join(enter => enter.append("circle")
      .attr("cx", d => x(d[xField]))
      .attr("cy", d => y(d[yField]))
      .attr("r", 0)
      .attr("fill-opacity", 0)
      .call(enter => enter.transition()
        .duration(800)
        .delay((d,i) => i * 5)
        .attr("r", 5)
        .attr("fill-opacity", 0.8)
      )
    )
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(
          `<strong>${d.country}</strong><br/>
           ${xLabel}: ${d[xField].toFixed(2)}<br/>
           ${yLabel}: ${d[yField].toFixed(2)}`
        );
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left",  (event.pageX + 12) + "px")
        .style("top",   (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
}

// Scene definitions simply call renderScatter()
export function scene1(svg, data, annotation) {
  renderScatter(svg, data, "gdpPerCapita", "labor",
                "GDP per Capita", "Labor Force Participation (%)");
  annotation.text(
    "Countries with higher GDP per capita tend to have higher labor force participation."
  );
}

export function scene2(svg, data, annotation) {
  renderScatter(svg, data, "gdpPerCapita", "fertility",
                "GDP per Capita", "Fertility Rate");
  annotation.text(
    "We observe a negative correlation between GDP per capita and fertility rates."
  );
}

export function scene3(svg, data, annotation) {
  renderScatter(svg, data, "gdpPerCapita", "life",
                "GDP per Capita", "Life Expectancy");
  annotation.text(
    "Higher GDP per capita is generally associated with higher life expectancy."
  );
}
