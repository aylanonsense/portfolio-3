import config from '../data/config.json';

export default async projects => {
	let totalRows = 0;
	let maxCol = 0;
	for (let [ project, projectData ] of Object.entries(projects)) {
		let col = 0;
		let row = totalRows;
		projectData.grid.col = col;
		projectData.grid.row = row;
		projectData.grid.x = (config.grid.cellWidth + config.grid.cellGap) * col;
		projectData.grid.y = (config.grid.cellHeight + config.grid.cellGap) * row;
		totalRows += projectData.grid.rows;
		maxCol = Math.max(maxCol, projectData.grid.cols);
	}
	return {
		rows: totalRows,
		cols: maxCol,
		width: maxCol * config.grid.cellWidth + Math.max(0, maxCol - 1) * config.grid.cellGap,
		height: totalRows * config.grid.cellHeight + Math.max(0, totalRows - 1) * config.grid.cellGap
	};
};