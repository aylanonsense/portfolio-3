import Mustache from 'mustache';
import loadFile from './scripts/loadFile';
import loadImage from './scripts/loadImage';
import saveFile from './scripts/saveFile';
import config from './data/config.json';
import pixelArt from './data/pixel-art.json';

(async () => {
	const templates = {
		base: await loadFile('templates/base.mustache'),
		layout: await loadFile('templates/layout.mustache'),
		header: await loadFile('templates/header.mustache'),
		nav: await loadFile('templates/nav.mustache'),
		main: 'todo',
		footer: await loadFile('templates/footer.mustache'),
		styles: 'todo',
		githubIcon: await loadFile('icons/github.svg'),
		twitterIcon: await loadFile('icons/twitter.svg')
	};
	const siteData = {
		siteName: config.siteName,
		pages: config.pageOrder.map(page => config.pages[page]),
		githubUri: config.links.github,
		twitterUri: config.links.twitter,
	};

	// pretend we're making the base pixel art page
	let view = {
		...siteData,
		pageTitle: null,
		navInHeader: false,
		showFooterText: true
	};
	let html = Mustache.render(templates.base, view, templates);
	saveFile('build/pixel-art.html', html);

	// pretend we're in a loop
	{
		let key = 'bonsai';
		let data = pixelArt[key];
		let view = {
			...siteData,
			pageTitle: data.title,
			navInHeader: true,
			showFooterText: false
		};
		let html = Mustache.render(templates.base, view, templates);
		saveFile(`build/pixel-art/${key}.html`, html);
	}
})();