import gen from 'random-seed';
import config from '../data/config.json';

const rand = gen('bridgs-seed');

function repeatedlyPackProjectsIntoGrid(projects, numCols, numAttempts) {
	let bestFit = null;
	for (let i = 0; i < numAttempts; i++) {
		let { numRows, projectCoordinates, grid } = packProjectsIntoGrid(projects, numCols);
		let fitness = calcFitness(projects, grid, numCols, numRows);
		if (!bestFit || fitness > bestFit.fitness) {
			bestFit = { numRows, projectCoordinates, fitness }
		}
	}
	return bestFit;
}

function packProjectsIntoGrid(projects, numCols) {
	// randomly sort projects
	let projectArr = Object.values(projects);
	projectArr.sort(() => rand.random() - 0.5); // ((a, b) => b.time - a.time);
	// create a grid (accessed with grid[col][row])
	let numRows = 0;
	let grid = [];
	for (let i = 0; i < numCols; i++) {
		grid.push([]);
	}
	let projectCoordinates = {};
	for (let projectData of projectArr) {
		let { col, row, newNumRows } = findSpaceInGrid(projectData, grid, numCols, numRows);
		projectCoordinates[projectData.project] = { col, row };
		numRows = newNumRows;
	}
	return { numRows, projectCoordinates, grid };
}

function findSpaceInGrid(projectData, grid, numCols, numRows) {
	let width = projectData.grid.cols;
	let height = projectData.grid.rows;
	for (let row = 0; row <= numRows + 1; row++) {
		for (let col = 0; col <= numCols - width; col++) {
			let canFit = true;
			for (let c = col; (c < col + width) && canFit; c++) {
				for (let r = row; (r < row + height) && canFit; r++) {
					if (grid[c][r]) {
						canFit = false;
					}
				}
			}
			if (canFit) {
				for (let c = col; (c < col + width) && canFit; c++) {
					for (let r = row; (r < row + height) && canFit; r++) {
						grid[c][r] = projectData;
					}
				}
				return {
					col,
					row,
					newNumRows: Math.max(numRows, row + height)
				}
			}
		}
	}
}

function calcFitness(projects, grid, numCols, numRows) {
	let fitness = 0;
	for (let col = 0; col < numCols; col++) {
		for (let row = 0; row < numRows; row++) {
			if (!grid[col][row]) {
				fitness -= 1;
			}
		}
	}
	return fitness;
}

export default async projects => {
	let numCols = 24;
	let { numRows, projectCoordinates } = repeatedlyPackProjectsIntoGrid(projects, numCols, config.grid.packAttempts);
	for (let [ project, projectData ] of Object.entries(projects)) {
		let { col, row } = projectCoordinates[project];
		projectData.grid.col = col;
		projectData.grid.row = row;
		projectData.grid.x = (config.grid.cellWidth + config.grid.cellGap) * col;
		projectData.grid.y = (config.grid.cellHeight + config.grid.cellGap) * row;
	}
	return {
		rows: numRows,
		cols: numCols,
		width: numCols * config.grid.cellWidth + Math.max(0, numCols - 1) * config.grid.cellGap,
		height: numRows * config.grid.cellHeight + Math.max(0, numRows - 1) * config.grid.cellGap
	};
};