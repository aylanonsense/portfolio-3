import fs from 'fs';

export default (filePath, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, data, (err, data) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		});
	});
};