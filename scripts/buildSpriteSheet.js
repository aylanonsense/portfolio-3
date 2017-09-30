import fs from 'fs';
import Canvas from 'canvas';
import loadImage from './helper/loadImage';
import saveCanvas from './helper/saveCanvas';
import packProjectImages from './packProjectImages';

export default async (galleryData, projects) => {
	// figure out how to pack all the projects images together
	let { bins, width, height } = packProjectImages(projects);
	// create a new spritesheet
	let spriteSheetPath = `build/public/${galleryData.uri}/sprite-sheet-1.png`;
	let spriteSheetUri = `/${galleryData.uri}/sprite-sheet-1.png`;
	let canvas = new Canvas(width, height);
	let ctx = canvas.getContext('2d');
	// for each project
	for (let bin of bins) {
		let project = bin.project;
		let projectData = projects[project];
		// draw the project's image into the spritesheet
		let imagePath = projectData.image.animated ? projectData.image.raw.deanimatedPath : projectData.image.raw.path;
		let image = await loadImage(imagePath);
		ctx.fillStyle = projectData.backgroundColor;
		ctx.fillRect(bin.x - 1, bin.y - 1, bin.width + 2, bin.height + 2);
		ctx.drawImage(image, bin.offsetX, bin.offsetY, bin.width, bin.height, bin.x, bin.y, bin.width, bin.height);
		// save the metadata to the project
		projectData.image.spriteSheet = {
			path: spriteSheetPath,
			uri: spriteSheetUri,
			x: bin.x,
			y: bin.y,
			width: bin.width,
			height: bin.height,
			sheetWidth: width,
			sheetHeight: height
		};
		let scale = projectData.grid.scale;
		projectData.image.gallery = {
			path: spriteSheetPath,
			uri: spriteSheetUri,
			x: scale * bin.x,
			y: scale * bin.y,
			width: scale * bin.width,
			height: scale * bin.height,
			sheetWidth: scale * width,
			sheetHeight: scale * height
		}
	}
	// save the spritesheet
	await saveCanvas(spriteSheetPath, canvas);
};