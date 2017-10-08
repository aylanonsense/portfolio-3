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
	projectArr.sort((a, b) => {
		if (a.priority === b.priority) {
			return rand.random() - 0.5
		}
		else {
			return b.priority - a.priority;
		}
	});
	// create a grid (accessed with grid[col][row])
	let numRows = 0;
	let grid = [];
	for (let i = 0; i < numCols; i++) {
		grid.push([]);
	}
	let projectCoordinates = {};
	for (let projectData of projectArr) {
		if (!projectData.hidden) {
			let { col, row, newNumRows } = findSpaceInGrid(projectData, grid, numCols, numRows);
			projectCoordinates[projectData.project] = { col, row };
			numRows = newNumRows;
		}
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
	for (let [ project, projectData ] of Object.entries(projects)) {
		if (!projectData.hidden) {
			projectData.grid.coordinates = [];
		}
	}
	// for each possible number of columns
	for (let numCols = config.grid.minCols; numCols <= config.grid.maxCols; numCols += config.grid.colStep) {
		// pack the projects into a grid with that many columns
		let { numRows, projectCoordinates } = repeatedlyPackProjectsIntoGrid(projects, numCols, config.grid.packAttempts);
		for (let [ project, projectData ] of Object.entries(projects)) {
			if (!projectData.hidden) {
				// add that metadata onto each project
				let { col, row } = projectCoordinates[project];
				projectData.grid.coordinates.push(col + 1, row + 1);
				if (numCols === config.grid.defaultCols) {
					projectData.grid.colStart = col + 1;
					projectData.grid.rowStart = row + 1;
				}
			}
		}
	}
};