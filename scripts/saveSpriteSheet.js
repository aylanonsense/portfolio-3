import Canvas from 'canvas';
import saveCanvas from './saveCanvas';

export default async (filePath, projects, width, height, bins) => {
	let canvas = new Canvas(width, height);
	let ctx = canvas.getContext('2d');
	for (let bin of bins) {
		ctx.fillStyle = projects[bin.project].background;
		ctx.fillRect(bin.x, bin.y, bin.width, bin.height);
	}
	await saveCanvas(filePath, canvas);
};