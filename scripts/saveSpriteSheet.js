import Canvas from 'canvas';
import loadImage from './helper/loadImage';
import saveCanvas from './helper/saveCanvas';
import fs from 'fs';

export default async (filePath, projects, width, height) => {
	let canvas = new Canvas(width, height);
	let ctx = canvas.getContext('2d');
	for (let [ project, projectData ] of Object.entries(projects)) {
		let image = await loadImage(projectData.animated ? projectData.deanimatedImagePath : projectData.imagePath);
		ctx.fillStyle = projectData.background;
		ctx.fillRect(projectData.spriteSheetX - 1, projectData.spriteSheetY - 1,
			projectData.spriteSheetWidth + 2, projectData.spriteSheetHeight + 2);
		ctx.drawImage(image,
			0, 0,
			projectData.spriteSheetWidth, projectData.spriteSheetHeight,
			projectData.spriteSheetX, projectData.spriteSheetY,
			projectData.spriteSheetWidth, projectData.spriteSheetHeight);
	}
	await saveCanvas(filePath, canvas);
};