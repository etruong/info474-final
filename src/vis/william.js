import * as d3 from 'd3';
import dataCSV from '../../data/combine-hour-zip-code-data.csv';

const DIV_CONTAINER_ID = "#william-vis";
const WIDTH = 800;
const HEIGHT = 800;
const VALUES_TO_SHOW = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const MARGIN = 70;

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


const buildPopup = () => {

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

	// get maximum count
	const maxMain = getMaximumOfGroup(ratingCounts);

	// build SVG container
	const svgContainer = d3.select(DIV_CONTAINER_ID)
		.append('svg')
		.attr('width', WIDTH)
		.attr('height', HEIGHT);

	// set domain and range
	const xScale = d3.scale
		.ordinal()
		.domain(VALUES_TO_SHOW)
		.rangeRoundBands([0, WIDTH - MARGIN], .05);
	const yScale = d3.scale
		.linear()
		.domain([0, maxMain])
		.range([HEIGHT - MARGIN, 0]);


}

main();