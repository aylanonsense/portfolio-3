import Canvas from 'canvas';
import loadImage from './helper/loadImage';
import saveCanvas from './helper/saveCanvas';
import fs from 'fs';

export default async (filePath, projects, width, height) => {
	let canvas = new Canvas(width, height);
	let ctx = canvas.getContext('2d');
	for (let [ project, projectData ] of Object.entries(projects)) {
		let imagePath = projectData.animated ? projectData.image.raw.deanimatedPath : projectData.image.raw.path;
		let image = await loadImage(imagePath);
		ctx.fillStyle = projectData.background;
		ctx.fillRect(projectData.image.spriteSheet.x - 1, projectData.image.spriteSheet.y - 1,
			projectData.image.spriteSheet.width + 2, projectData.image.spriteSheet.height + 2);
		ctx.drawImage(image,
			0, 0,
			projectData.image.spriteSheet.width, projectData.image.spriteSheet.height,
			projectData.image.spriteSheet.x, projectData.image.spriteSheet.y,
			projectData.image.spriteSheet.width, projectData.image.spriteSheet.height);
	}
	await saveCanvas(filePath, canvas);
};