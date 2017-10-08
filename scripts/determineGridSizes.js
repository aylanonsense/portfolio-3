import config from '../data/config.json';

const SCALES = [
	{ scale: 1 / 16,	penalty: 0.2,	pixelArtPenalty: 0.9 },
	{ scale: 1 / 8,		penalty: 0,		pixelArtPenalty: 0.8 },
	{ scale: 1 / 4,		penalty: 0,		pixelArtPenalty: 0.6 },
	{ scale: 1 / 2,		penalty: 0,		pixelArtPenalty: 0.3 },
	{ scale: 1,			penalty: 0,		pixelArtPenalty: 0.1 },
	{ scale: 2,			penalty: 0.5,	pixelArtPenalty: 0.03 },
	{ scale: 3,			penalty: 0.8,	pixelArtPenalty: 0 },
	{ scale: 4,			penalty: 0.9,	pixelArtPenalty: 0 },
	{ scale: 5,			penalty: 0.9,	pixelArtPenalty: 0.05 },
	{ scale: 6,			penalty: 0.9,	pixelArtPenalty: 0.2 },
	{ scale: 7,			penalty: 0.9,	pixelArtPenalty: 0.6 },
	{ scale: 8,			penalty: 0.9,	pixelArtPenalty: 0.9 }
]

function calcUnusedSpace(imageWidth, imageHeight, gridWidth, gridHeight) {
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
	return { unusedGridPercentage, unusedImagePercentage };
}

export default async (galleryData, projects) => {
	for (let [ project, projectData ] of Object.entries(projects)) {
		let image = projectData.image.raw;
		let bestFit = null;
		for (let cols = config.grid.colStep; cols <= config.grid.maxItemCols; cols += config.grid.colStep) {
			let gridWidth = config.grid.cellWidth * cols + config.grid.cellGap * (cols - 1);
			for (let rows = config.grid.rowStep; rows <= config.grid.maxItemRows; rows += config.grid.rowStep) {
				let gridHeight = config.grid.cellHeight * rows + config.grid.cellGap * (rows - 1);
				for (let { scale, penalty, pixelArtPenalty } of SCALES) {
					let imageWidth = scale * image.width;
					let imageHeight = scale * image.height;
					let { unusedGridPercentage, unusedImagePercentage } = calcUnusedSpace(imageWidth, imageHeight, gridWidth, gridHeight);
					let unusedGridMult = projectData.image.touchesEdges ? 3 : 1;
					let unusedImageMult = 1;
					let fitness = 0
						- unusedGridMult * unusedGridPercentage
						- unusedImageMult * unusedImagePercentage
						- (projectData.isPixelArt ? pixelArtPenalty : penalty);
					if (projectData.grid) {
						if (projectData.grid.cols && cols === projectData.grid.cols) {
							fitness += 100;
						}
						if (projectData.grid.rows && rows === projectData.grid.rows) {
							fitness += 100;
						}
						if (projectData.grid.scale && scale === projectData.grid.scale) {
							fitness += 100;
						}
					}
					if (!bestFit || bestFit.fitness < fitness) {
						bestFit = { scale, cols, rows, fitness, gridWidth, gridHeight };
					}
				}
			}
		}
		projectData.grid = {
			scale: bestFit.scale,
			cols: bestFit.cols,
			rows: bestFit.rows,
			width: bestFit.gridWidth,
			height: bestFit.gridHeight
		};
	}
};