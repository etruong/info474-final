import * as d3 from 'd3';
import dataCSV from './data/combine-hour-zip-code-data.csv';

const main = async () => {
	const data = await d3.csv(dataCSV);
}

main();