import * as d3 from 'd3';
import dataCSV from '../../data/combine-hour-zip-code-data.csv';

const DIV_CONTAINER_ID = "#james-vis";
const WIDTH = 1000;
const HEIGHT = 800;
const MARGIN = 70;

const OPTIONS = ["All", "$", "$$", "$$$", "$$$$"];
let selected = "All";

const svgContainer = d3.select(DIV_CONTAINER_ID)
  .append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT);
const xScale = d3.scaleLinear()
  .domain([0, 0])
  .range([MARGIN, MARGIN]);
const xAxis = d3.axisBottom(xScale);

svgContainer.append('g')
  .attr("class", "myXaxis")
  .attr('transform', `translate(0, ${HEIGHT - MARGIN})`)
  .call(xAxis)
  .attr("opacity", "0");

const yScale = d3.scaleLinear()
  .domain([0, 9500])
  .range([HEIGHT - MARGIN, 0 + MARGIN]);
const yAxis = d3.axisLeft(yScale);

// draw axes

svgContainer.append('g')
  .attr('transform', `translate(${MARGIN}, 0)`)
  .call(yAxis);

const main = async () => {
  const data = await d3.csv(dataCSV);

  svgContainer.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d.review_count); })
    .attr("cy", function (d) { return yScale(d.distance); })
    .attr("r", 3)
    .style("fill", "#69b3a2")

  xScale.domain([0, 3000])
    .range([MARGIN, 800 - MARGIN]);

  svgContainer.select(".myXaxis")
    .attr("opacity", "1")
    .call(d3.axisBottom(xScale));

  svgContainer.selectAll("circle")
    .transition()
    .delay(function (d, i) { return (i * 3) })
    .duration(2000)
    .attr("cx", function (d) { return xScale(d.review_count); })
    .attr("cy", function (d) { return yScale(d.distance); })

  let dropDown = d3.select("body").append("select").attr("class", "selector")

  dropDown
    .selectAll('myOptions')
    .data(OPTIONS)
    .enter()
    .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) { return d; });
  dropDown.on("change", function () {
    selected = d3.select(this).property("value");
    if (selected == "All") {
      svgContainer.selectAll("circle")
        .transition().duration(1000)
        .style("opacity", 1);
    } else if (selected != "All") {
      svgContainer.selectAll("circle")
        .filter(function (d) {
          return selected != d.price;
        })
        .transition()
        .duration(1000)
        .style("opacity", 0);
      svgContainer.selectAll("circle")
        .filter(function (d) {
          return selected == d.price;
        })
        .transition()
        .duration(1000)
        .style("opacity", 1);;
    }
  });

}

svgContainer.append('text')
  .attr('x', 800 / 2)
  .attr('y', MARGIN - MARGIN / 6)
  .style('font-size', '40px')
  .style('font-family', 'Arial')
  .style('text-anchor', 'middle')
  .text('Distance vs. Review Counts');

svgContainer.append('text')
  .attr('x', 800 / 2)
  .attr('y', HEIGHT - MARGIN / 3)
  .style('font-size', '20px')
  .style('font-family', 'Arial')
  .style('text-anchor', 'middle')
  .text('Review Counts');

svgContainer.append('text')
  .attr('transform', `translate(${MARGIN / 3}, ${800 / 2}) rotate(-90)`)
  .style('font-size', '20px')
  .style('font-family', 'Arial')
  .style('text-anchor', 'middle')
  .text('Distance')


main();

