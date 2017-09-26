import fs from 'fs';

export default (filePath, canvas) => {
	return new Promise((resolve, reject) => {
		let out = fs.createWriteStream(filePath);
		let stream = filePath.endsWith('.png') ? canvas.pngStream() : canvas.jpegStream();
		stream.on('data', chunk => out.write(chunk));
		stream.on('end', () => resolve());
	});
};