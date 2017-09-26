import config from '../data/config.json';

export default async projects => {
	for (let [ project, projectData ] of Object.entries(projects)) {
		let spriteSheetImage = projectData.image.spriteSheet;
		let bestFit = null;
		for (let cols = 1; cols <= 8; cols++) {
			let gridWidth = config.grid.cellWidth * cols + config.grid.cellGap * (cols - 1);
			for (let rows = 1; rows <= 10; rows++) {
				let gridHeight = config.grid.cellHeight * rows + config.grid.cellGap * (rows - 1);
				for (let mult = 1; mult <= 6; mult++) {
					let imageWidth = mult * spriteSheetImage.width;
					let imageHeight = mult * spriteSheetImage.height;
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
					let fitness = 1 - unusedGridPercentage / 2 - unusedImagePercentage / 2;
					if (!bestFit || bestFit.fitness < fitness) {
						bestFit = { mult, cols, rows, fitness, gridWidth, gridHeight };
					}
				}
			}
		}
		projectData.image.gallery = {
			path: spriteSheetImage.path,
			uri: spriteSheetImage.uri,
			x: bestFit.mult * spriteSheetImage.x,
			y: bestFit.mult * spriteSheetImage.y,
			width: bestFit.mult * spriteSheetImage.width,
			height: bestFit.mult * spriteSheetImage.height,
			sheetWidth: bestFit.mult * spriteSheetImage.sheetWidth,
			sheetHeight: bestFit.mult * spriteSheetImage.sheetHeight
		};
		projectData.grid = {
			cols: bestFit.cols,
			rows: bestFit.rows,
			width: bestFit.gridWidth,
			height: bestFit.gridHeight
		}
	}
};