import * as d3 from 'd3';
import dataCSV from '../../data/combine-hour-zip-code-data.csv';

const main = async () => {
	const data = await d3.csv(dataCSV);


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
	console.log(ratingCounts);
	console.log(countsPerRating);
}

main();