import videofy from 'videofy';

export default (inputFilePath, outputFilePath) => {
	return new Promise((resolve, reject) => {
		videofy(inputFilePath, outputFilePath, err => {
			if (err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
};