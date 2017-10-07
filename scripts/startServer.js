import path from 'path';
import express from 'express';
import proxy from 'express-http-proxy';
import config from '../data/config.json';
import loadFile from './helper/loadFile';

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
		let filePath = path.join(__dirname, '..', 'build/html', `${uri}.html`);
		app.get(`/${uri}`, (req, res) => res.sendFile(filePath));
	}

	// requests for images
	app.use(express.static('web-assets/images'));

	// requests for fonts
	app.use(express.static('web-assets/fonts'));

	// requests for Flash files
	app.use(express.static('web-assets/flash'));

	// requests for sprite sheets
	app.use(express.static('build/sprite-sheets'));

	// proxy some requests to other local servers
	try {
		let proxies = JSON.parse(await loadFile(path.join(__dirname, '..', 'build/proxies.json')));
		console.log('  Setting up proxies');
		for (let [ uri, port ] of Object.entries(proxies)) {
			app.use(uri, proxy(`localhost:${port}`));
		}
	}
	catch (err) {
		console.log(err);
		console.log('  Skipping proxies (build/proxies.json missing)');
	}

	// requests for html files
	app.use(express.static('build/html', {
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