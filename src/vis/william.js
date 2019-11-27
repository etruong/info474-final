import * as d3 from 'd3';
import dataCSV from '../../data/combine-hour-zip-code-data.csv';

const DIV_CONTAINER_ID = "#william-vis";
const WIDTH = 800;
const HEIGHT = 800;
const VALUES_TO_SHOW = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const COLORS = VALUES_TO_SHOW.map(value => `rgb(${255 - (value / 5) * 255}, ${(value / 5) * 255}, 0)`);
const MARGIN = 70;
const STROKE = 'black';
const STROKE_WIDTH = 2;

const TOOLTIP_WIDTH = 500;
const TOOLTIP_HEIGHT = 500;
const TOOLTIP_MARGIN = 80;

/**
 * Gets the maximum of the group provided
 * @param {{[idx: string]: number}} obj 
 */
const getMaximumOfGroup = (obj) => {
	return Object.keys(obj).reduce((acc, key) => {
		let curr = obj[key];
		return acc < curr ? curr : acc;
	}, 0);
}

/**
 * Sets up the tooltip container opacity
 */
const buildTooltip = () => {
	return d3.select("#william-tooltip")
		.style('opacity', 0);
}

/**
 * generate a random color
 */
const generateRandomColor = () => {
	return `rgb(${
		Math.random() * 256
		}, ${
		Math.random() * 256
		}, ${
		Math.random() * 256
		})`;
}

const fillTooltip = (tooltip, counts) => {
	// reset container
	tooltip.select('svg').remove();

	// prepare keys to draw
	let keys = [];
	Object.keys(counts).forEach(key => {
		if (key !== "NA") {
			keys.push(key);
		}
	});
	keys.sort();
	keys.unshift("NA");

	// get maximum count
	const maxCounts = getMaximumOfGroup(counts);
	const countsAsArray = keys.map((type, i) => {
		return {
			type,
			count: counts[type],
			color: generateRandomColor()
		}
	});

	// build svg
	const tooltipSVG = tooltip
		.append('svg')
		.attr('width', TOOLTIP_WIDTH)
		.attr('height', TOOLTIP_HEIGHT);

	// set domain and range
	const xScale = d3.scaleBand()
		.domain(keys)
		.rangeRound([TOOLTIP_MARGIN, TOOLTIP_WIDTH - TOOLTIP_MARGIN])
		.padding(0.1);
	const yScale = d3.scaleLinear()
		.domain([0, maxCounts])
		.range([TOOLTIP_HEIGHT - TOOLTIP_MARGIN, 0 + TOOLTIP_MARGIN]);
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	// draw axes
	tooltipSVG.append('g')
		.attr('transform', `translate(0, ${TOOLTIP_WIDTH - TOOLTIP_MARGIN})`)
		.call(xAxis)
		.selectAll('text')
		.style('text-anchor', 'end')
		.attr('dx', '-0.8em')
		.attr('dy', '-0.55em')
		.attr('transform', 'rotate(-90)');
	tooltipSVG.append('g')
		.attr('transform', `translate(${TOOLTIP_MARGIN}, 0)`)
		.call(yAxis);

	// build bars
	tooltipSVG.selectAll('bar')
		.data(countsAsArray)
		.enter()
		.append('rect')
		.attr('x', (d) => xScale(d.type))
		.attr('width', xScale.bandwidth())
		.attr('y', (d) => yScale(d.count))
		.attr('height', (d) => (TOOLTIP_HEIGHT - yScale(d.count) - TOOLTIP_MARGIN))
		.attr('fill', (d) => d.color);

	// build title and labels
	tooltipSVG.append('text')
		.attr('x', TOOLTIP_WIDTH / 2)
		.attr('y', TOOLTIP_MARGIN - TOOLTIP_MARGIN / 6)
		.style('font-size', '20px')
		.style('font-family', 'Arial')
		.style('text-anchor', 'middle')
		.text('Cuisine frequencies');

	tooltipSVG.append('text')
		.attr('x', TOOLTIP_WIDTH / 2)
		.attr('y', TOOLTIP_HEIGHT - TOOLTIP_MARGIN / 6)
		.style('font-size', '15px')
		.style('font-family', 'Arial')
		.style('text-anchor', 'middle')
		.text('Cuisine');

	tooltipSVG.append('text')
		.attr('transform', `translate(${TOOLTIP_MARGIN / 3}, ${TOOLTIP_WIDTH / 2}) rotate(-90)`)
		.style('font-size', '15px')
		.style('font-family', 'Arial')
		.style('text-anchor', 'middle')
		.text('Frequency')

	return tooltip;
}

const main = async () => {
	const data = await d3.csv(dataCSV);

	// aggregate ratings and sub-ratings
	const ratingCounts = {};
	const countsPerRating = {};
	data.forEach(row => {
		let rating = row.rating;
		if (!(rating in ratingCounts)) {
			ratingCounts[rating] = 0;
			countsPerRating[rating] = {};
		}
		ratingCounts[rating] += 1;
		let category = row.category;

		if (!(category in countsPerRating[rating])) {
			countsPerRating[rating][category] = 0;
		}

		countsPerRating[rating][category] += 1;
	});

	// translate ratings to array format
	const ratingsAsArray = VALUES_TO_SHOW.map((value, i) => {
		return {
			value,
			count: value in ratingCounts ? ratingCounts[value] : 0,
			color: COLORS[i]
		}
	});

	// get maximum count
	const maxMain = getMaximumOfGroup(ratingCounts);

	// build SVG container
	const svgContainer = d3.select(DIV_CONTAINER_ID)
		.append('svg')
		.attr('width', WIDTH)
		.attr('height', HEIGHT);

	// set domain and range
	const xScale = d3.scaleBand()
		.domain(VALUES_TO_SHOW)
		.rangeRound([MARGIN, WIDTH - MARGIN])
		.padding(0.1);
	const yScale = d3.scaleLinear()
		.domain([0, maxMain])
		.range([HEIGHT - MARGIN, 0 + MARGIN]);
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	// draw axes
	svgContainer.append('g')
		.attr('transform', `translate(0, ${WIDTH - MARGIN})`)
		.call(xAxis);
	svgContainer.append('g')
		.attr('transform', `translate(${MARGIN}, 0)`)
		.call(yAxis);

	// draw bars
	let bars = svgContainer.selectAll('bar')
		.data(ratingsAsArray)
		.enter()
		.append('rect')
		.attr('x', (d) => xScale(d.value))
		.attr('width', xScale.bandwidth())
		.attr('y', (d) => yScale(d.count))
		.attr('height', (d) => (HEIGHT - yScale(d.count) - MARGIN))
		.attr('fill', (d) => d.color)
		.attr('stroke', STROKE)
		.attr('stroke-width', STROKE_WIDTH);

	let tooltip = buildTooltip();

	// add mouseover functionality
	bars.on('mouseover', function (d) {
		d3.select(this)
			.transition()
			.duration(200)
			.style('opacity', 0.5);
		fillTooltip(tooltip, countsPerRating[d.value])
			.transition()
			.duration(200)
			.style('opacity', 1);
	}).on('mousemove', function (d) {
		tooltip
			.style('left', `${d3.event.pageX}px`)
			.style('top', `${d3.event.pageY - TOOLTIP_HEIGHT - 15}px`)
	}).on('mouseout', function (d) {
		d3.select(this)
			.transition()
			.duration(200)
			.style('opacity', 1);
		tooltip.transition().duration(200).style('opacity', 0);
	});

	// build title and labels
	svgContainer.append('text')
		.attr('x', WIDTH / 2)
		.attr('y', MARGIN - MARGIN / 6)
		.style('font-size', '40px')
		.style('font-family', 'Arial')
		.style('text-anchor', 'middle')
		.text('Ratings and frequencies');

	svgContainer.append('text')
		.attr('x', WIDTH / 2)
		.attr('y', HEIGHT - MARGIN / 3)
		.style('font-size', '20px')
		.style('font-family', 'Arial')
		.style('text-anchor', 'middle')
		.text('Rating');

	svgContainer.append('text')
		.attr('transform', `translate(${MARGIN / 3}, ${WIDTH / 2}) rotate(-90)`)
		.style('font-size', '20px')
		.style('font-family', 'Arial')
		.style('text-anchor', 'middle')
		.text('Frequency')
}

main();