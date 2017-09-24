import fs from 'fs';
import Canvas from 'canvas';

export default filePath => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) {
				reject(err);
			}
			else {
				let img = new Canvas.Image();
				img.src = data;
				resolve(img);
			}
		});
	});
};