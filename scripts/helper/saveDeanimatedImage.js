import gm from 'gm';

export default async (inputFilePath, outputFilePath) => {
	return new Promise((resolve, reject) => {
		gm(inputFilePath + '[0]')
			.write(outputFilePath, function (err) {
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			});
	});
};