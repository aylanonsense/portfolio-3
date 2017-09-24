import loadFile from './loadFile';
import Canvas from 'canvas';

export default async filePath => {
	let data = await loadFile(filePath, null);
	let img = new Canvas.Image();
	img.src = data;
	return img;
};