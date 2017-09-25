import path from 'path';
import express from 'express';
import config from '../data/config.json';

function send404(res) {
	res.status(404);
	res.send('Not found');
}

export default async () => {
	// create a new app
	const app = express();

	// bind routes
	app.get(/.*\.html/, (req, res) => send404(res));
	for (let [ k, page ] of Object.entries(config.pages)) {
		let uri = page.uri;
		let filePath = path.join(__dirname, '..', 'build/public', `${uri}.html`);
		app.get(`/${uri}`, (req, res) => res.sendFile(filePath));
	}
	app.use('/images', express.static('images'));
	app.use(express.static('build/public', {
		extensions: [ 'html' ],
		index: `${config.pages[config.defaultPage].uri}.html`
	}));
	app.use((req, res) => send404(res));

	// start listening
	return app.listen(process.env.PORT || 3000);
};