import path from 'path';
import express from 'express';
import config from '../data/config.json';

function send404(res) {
	res.status(404);
	res.send('Not found');
}

export default async () => {
	console.log('Starting server');
	// create a new app
	const app = express();

	// requests for .html files will 404
	app.get(/.*\.html/, (req, res) => send404(res));

	// requests for any of the main section pages
	for (let [ section, sectionData ] of Object.entries(config.sections)) {
		let uri = sectionData.uri;
		let filePath = path.join(__dirname, '..', 'build/public', `${uri}.html`);
		app.get(`/${uri}`, (req, res) => res.sendFile(filePath));
	}

	// requests for images
	app.use('/images', express.static('web-assets/images'));

	// requests for fonts
	app.use('/fonts', express.static('web-assets/fonts'));

	// requests for all other .html pages
	app.use(express.static('build/public', {
		extensions: [ 'html' ],
		index: `${config.sections[config.defaultSection].uri}.html`
	}));

	// any requests that don't match any of the above should 404
	app.use((req, res) => send404(res));

	// start listening
	let port = process.env.PORT || 3000;
	app.listen(port);
	console.log(`  Server listening on port ${port}`);
};