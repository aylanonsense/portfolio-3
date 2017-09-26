import config from '../data/config.json';

const SCALE_PENALTY = [ 0.1, 0.03, 0, 0, 0.05, 0.2 ];

export default async projects => {
	for (let [ project, projectData ] of Object.entries(projects)) {
		let image = projectData.image.raw;
		let bestFit = null;
		for (let cols = 1; cols <= 8; cols++) {
			let gridWidth = config.grid.cellWidth * cols + config.grid.cellGap * (cols - 1);
			for (let rows = 1; rows <= 10; rows++) {
				let gridHeight = config.grid.cellHeight * rows + config.grid.cellGap * (rows - 1);
				for (let scale = 1; scale <= 6; scale++) {
					let imageWidth = scale * image.width;
					let imageHeight = scale * image.height;
					let unusedGridArea = 0;
					let unusedImageArea = 0;
					if (gridWidth > imageWidth) {
						unusedGridArea += (gridWidth - imageWidth) * Math.min(gridHeight, (gridHeight + imageHeight) / 2);
					}
					else {
						unusedImageArea += (imageWidth - gridWidth) * Math.min(imageHeight, (gridHeight + imageHeight) / 2);
					}
					if (gridHeight > imageHeight) {
						unusedGridArea += (gridHeight - imageHeight) * Math.min(gridWidth, (gridWidth + imageWidth) / 2);
					}
					else {
						unusedImageArea += (imageHeight - gridHeight) * Math.min(imageWidth, (gridWidth + imageWidth) / 2);
					}
					let unusedGridPercentage = unusedGridArea / (gridWidth * gridHeight);
					let unusedImagePercentage = unusedImageArea / (imageWidth * imageHeight);
					let unusedGridMult = projectData.image.touchesEdges ? 3 : 1;
					let unusedImageMult = 1;
					let fitness = 0
						- unusedGridMult * unusedGridPercentage
						- unusedImageMult * unusedImagePercentage
						- SCALE_PENALTY[scale - 1];
					if (projectData.grid) {
						if (projectData.grid.cols && cols === projectData.grid.cols) {
							fitness += 1;
						}
						if (projectData.grid.rows && rows === projectData.grid.rows) {
							fitness += 1;
						}
						if (projectData.grid.scale && scale === projectData.grid.scale) {
							fitness += 1;
						}
					}
					if (!bestFit || bestFit.fitness < fitness) {
						bestFit = { scale, cols, rows, fitness, gridWidth, gridHeight };
					}
				}
			}
		}
		// projectData.image.gallery = {
		// 	path: image.path,
		// 	uri: image.uri,
		// 	x: bestFit.scale * image.x,
		// 	y: bestFit.scale * image.y,
		// 	width: bestFit.scale * image.width,
		// 	height: bestFit.scale * image.height,
		// 	sheetWidth: bestFit.scale * image.sheetWidth,
		// 	sheetHeight: bestFit.scale * image.sheetHeight
		// };
		projectData.grid = {
			scale: bestFit.scale,
			cols: bestFit.cols,
			rows: bestFit.rows,
			width: bestFit.gridWidth,
			height: bestFit.gridHeight
		}
	}
};