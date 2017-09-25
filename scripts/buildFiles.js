import Mustache from 'mustache';
import loadFile from './loadFile';
import loadImage from './loadImage';
import saveFile from './saveFile';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

import { buildProjectPage } from './buildPage';

export default async () => {
	const templates = {
		base: await loadFile('templates/base.mustache'),
		layout: await loadFile('templates/layout.mustache'),
		header: await loadFile('templates/header.mustache'),
		nav: await loadFile('templates/nav.mustache'),
		footer: await loadFile('templates/footer.mustache'),
		githubIcon: await loadFile('icons/github.svg'),
		twitterIcon: await loadFile('icons/twitter.svg')
	};
	const content = {
		project: await loadFile('templates/project.mustache'),
		grid: await loadFile('templates/grid.mustache')
	};
	const styles = {
		universal: await loadFile('styles/universal.css'),
		project: await loadFile('styles/project.css'),
		gallery: await loadFile('styles/gallery.css'),
		grid: await loadFile('styles/grid.css')
	};
	const siteData = {
		siteName: config.siteName,
		pages: config.pageOrder.map(page => config.pages[page]),
		githubUri: config.links.github,
		twitterUri: config.links.twitter,
		showDebugColors: config.showDebugColors
	};

	// pretend we're making the base pixel art page
	let html = Mustache.render(templates.base, {
		...siteData,
		pageTitle: config.pages.pixels.title,
		showSubheading: true,
		navInHeader: false,
		showFooterText: true,
		minBodyWidth: 300,
		minBodyHeight: null,
		gridWidth: 630,
		gridHeight: 710,
		gridItems: [
			{ x: 0,   y: 0,   width: 30,  height: 30 },
			{ x: 0,   y: 40,  width: 30,  height: 30 },
			{ x: 40,  y: 0,   width: 30,  height: 30 },
			{ x: 40,  y: 40,  width: 30,  height: 30 },
			{ x: 80,  y: 0,   width: 70,  height: 70 },
			{ x: 160, y: 0,   width: 70,  height: 70 },
			{ x: 0,   y: 80,  width: 70,  height: 110 },
			{ x: 80,  y: 80,  width: 150, height: 150 },
			{ x: 0,   y: 200, width: 30,  height: 30 },
			{ x: 40,  y: 200, width: 30,  height: 30 },
			{ x: 240, y: 0,   width: 230, height: 230 },
			{ x: 240, y: 240, width: 30,  height: 30 },
			{ x: 240, y: 280, width: 30,  height: 30 },
			{ x: 280, y: 240, width: 30,  height: 30 },
			{ x: 280, y: 280, width: 30,  height: 30 },
			{ x: 320, y: 240, width: 70,  height: 70 },
			{ x: 400, y: 240, width: 70,  height: 70 },
			{ x: 240, y: 320, width: 70,  height: 110 },
			{ x: 320, y: 320, width: 150, height: 150 },
			{ x: 240, y: 440, width: 30,  height: 30 },
			{ x: 280, y: 440, width: 30,  height: 30 },
			{ x: 0,   y: 240, width: 230, height: 230 },
			{ x: 240, y: 480, width: 30,  height: 30 },
			{ x: 240, y: 520, width: 30,  height: 30 },
			{ x: 280, y: 480, width: 30,  height: 30 },
			{ x: 280, y: 520, width: 30,  height: 30 },
			{ x: 320, y: 480, width: 70,  height: 70 },
			{ x: 400, y: 480, width: 70,  height: 70 },
			{ x: 240, y: 560, width: 70,  height: 110 },
			{ x: 320, y: 560, width: 150, height: 150 },
			{ x: 240, y: 680, width: 30,  height: 30 },
			{ x: 280, y: 680, width: 30,  height: 30 },
			{ x: 0,   y: 480, width: 230, height: 230 },
			{ x: 480, y: 0,   width: 70,  height: 230 },
			{ x: 480, y: 240, width: 70,  height: 230 },
			{ x: 480, y: 480, width: 70,  height: 230 },
			{ x: 560, y: 0,   width: 70,  height: 230 },
			{ x: 560, y: 240, width: 70,  height: 230 },
			{ x: 560, y: 480, width: 70,  height: 230 },
		]
	}, {
		...templates,
		main: content.grid,
		style: styles.universal + styles.gallery + styles.grid
	});
	await saveFile(`build/public/${config.pages.pixels.uri}.html`, html);

	// pretend we're in a loop
	{
		await buildProjectPage('pixels', 'bonsai');
		// let data = pixels[key];
		// let imagePath = `images/${config.pages.pixels.uri}/${data.image}`;
		// let image = await loadImage(imagePath);
		// let mult = Math.min(6, Math.floor(Math.min(500 / image.width, 500 / image.height)));
		// let width = image.width * mult;
		// let height = image.height * mult;
		// let html = Mustache.render(templates.base, {
		// 	...siteData,
		// 	pageTitle: data.title,
		// 	showSubheading: false,
		// 	navInHeader: true,
		// 	showFooterText: false,
		// 	image: imagePath,
		// 	width: width,
		// 	height: height,
		// 	backgroundColor: data.background,
		// 	isPixelArt: true,
		// 	minBodyWidth: Math.max(width + 20, 300),
		// 	minBodyHeight: Math.max(height + 200, 400),
		// 	mainWidth: Math.max(width, 280),
		// 	description: 'This is a description of the thing. It could go on a little long and I should account for that in some way.',
		// 	dateText: 'Dec 2016'
		// }, {
		// 	...templates,
		// 	main: content.project,
		// 	style: styles.universal + styles.project
		// });
		// await saveFile(`build/public/${config.pages.pixels.uri}/${project}.html`, html);
	}
};