import Mustache from 'mustache';
import loadImage from './scripts/loadImage';
import data from './data/pixel-art.json';
// import config from './data/config.json';
// import tmpl from './templates/test1.mustache';

(async () => {
	console.log('Loading image...');
	try {
		let img = await loadImage('images/pixel-art/blueberry.png');
		console.log('img', img.width, img.height);
	}
	catch (err) {
		throw err;
	}
})();