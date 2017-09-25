import Mustache from 'mustache';
import loadFile from '../scripts/loadFile';
import loadImage from '../scripts/loadImage';
import saveFile from '../scripts/saveFile';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

let isLoaded = false;
let templates;
let content;
let styles;
let siteData;

async function load() {
	isLoaded = true;
	templates = {
		base: await loadFile('templates/base.mustache'),
		layout: await loadFile('templates/layout.mustache'),
		header: await loadFile('templates/header.mustache'),
		nav: await loadFile('templates/nav.mustache'),
		footer: await loadFile('templates/footer.mustache'),
		githubIcon: await loadFile('icons/github.svg'),
		twitterIcon: await loadFile('icons/twitter.svg')
	};
	content = {
		project: await loadFile('templates/project.mustache'),
		grid: await loadFile('templates/grid.mustache')
	};
	styles = {
		universal: await loadFile('styles/universal.css'),
		project: await loadFile('styles/project.css'),
		gallery: await loadFile('styles/gallery.css'),
		grid: await loadFile('styles/grid.css')
	};
	siteData = {
		siteName: config.siteName,
		pages: config.pageOrder.map(page => config.pages[page]),
		githubUri: config.links.github,
		twitterUri: config.links.twitter,
		showDebugColors: config.showDebugColors
	};
}

export async function buildProjectPage(page, project) {
	if (!isLoaded) {
		await load();
	}
	let pageUri = config.pages[page].uri
	let projectData;
	if (page === 'pixels') {
		projectData = pixels[project];
	}
	let imagePath = `images/${pageUri}/${projectData.image}`;
	let image = await loadImage(imagePath);
	let mult = Math.min(6, Math.floor(Math.min(500 / image.width, 500 / image.height)));
	let width = image.width * mult;
	let height = image.height * mult;
	let html = Mustache.render(templates.base, {
		...siteData,
		pageTitle: projectData.title,
		showSubheading: false,
		navInHeader: true,
		showFooterText: false,
		image: imagePath,
		width: width,
		height: height,
		backgroundColor: projectData.background,
		description: projectData.description,
		dateText: 'Dec 2016',
		isPixelArt: true,
		minBodyWidth: Math.max(width + 20, 300),
		minBodyHeight: Math.max(height + 200, 400),
		mainWidth: Math.max(width, 280)
	}, {
		...templates,
		main: content.project,
		style: styles.universal + styles.project
	});
	await saveFile(`build/public/${pageUri}/${project}.html`, html);
};