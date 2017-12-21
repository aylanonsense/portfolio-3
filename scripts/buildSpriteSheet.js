import fs from 'fs';
import Canvas from 'canvas';
import config from '../data/config';
import loadImage from './helper/loadImage';
import saveCanvas from './helper/saveCanvas';
import packProjectImages from './packProjectImages';

export default async (galleryData, projects) => {
	// figure out how to pack all the projects images together
	let { bins, width, height } = packProjectImages(projects);
	// create a new spritesheet
	let spriteSheetPath = `build/sprite-sheets/${galleryData.uri}/sprite-sheet-1.png`;
	let spriteSheetUri = `/${galleryData.uri}/sprite-sheet-1.png`;
	let canvas = new Canvas(width, height);
	let ctx = canvas.getContext('2d');
	// for each project
	for (let bin of bins) {
		let project = bin.project;
		let projectData = projects[project];
		// draw the project's image into the spritesheet
		if (config.saveImages && !config.quickBuild) {
			let image = await loadImage(projectData.image.animated ? projectData.image.deanimated.path : projectData.image.raw.path);
			ctx.fillStyle = projectData.backgroundColor;
			ctx.fillRect(bin.fillX, bin.fillY, bin.fillWidth, bin.fillHeight);
			ctx.drawImage(image,
				bin.sourceX, bin.sourceY, bin.sourceWidth, bin.sourceHeight,
				bin.targetX, bin.targetY, bin.targetWidth, bin.targetHeight);
		}
		// save the metadata to the project
		let scale = Math.max(1, projectData.grid.scale);
		projectData.image.gallery = {
			path: spriteSheetPath,
			uri: spriteSheetUri,
			x: scale * bin.targetX,
			y: scale * bin.targetY,
			width: scale * bin.targetWidth,
			height: scale * bin.targetHeight,
			sheetWidth: scale * width,
			sheetHeight: scale * height
		};
	}
	// save the spritesheet
	if (config.saveImages) {
		await saveCanvas(spriteSheetPath, canvas);
	}
};