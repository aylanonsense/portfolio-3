import gm from 'gm';

export default async (inputFilePath, outputFilePath, options) => {
	return new Promise((resolve, reject) => {
		let image = gm(inputFilePath + (options.deanimate ? '[0]' : ''));
		if (options.resize) {
			image.resize(options.resize.width, options.resize.height)
		}
		if (options.crop) {
			image.crop(options.crop.width, options.crop.height, options.crop.x, options.crop.y);
		}
		image.write(outputFilePath, err => {
			if (err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
};