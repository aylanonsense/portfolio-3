import fs from 'fs';

export default (filePath, encoding='utf8') => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, encoding, (err, data) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		});
	});
};