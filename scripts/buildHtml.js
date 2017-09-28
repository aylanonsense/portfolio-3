import Mustache from 'mustache';
import loadFile from './helper/loadFile';
import saveFile from './helper/saveFile';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

let isLoaded = false;
let templates;
let content;
let scripts;
let styles;
let siteData;

async function load() {
	isLoaded = true;
	templates = {
		base: await loadFile('web-assets/templates/base.mustache'),
		layout: await loadFile('web-assets/templates/layout.mustache'),
		header: await loadFile('web-assets/templates/header.mustache'),
		nav: await loadFile('web-assets/templates/nav.mustache'),
		footer: await loadFile('web-assets/templates/footer.mustache'),
		githubIcon: await loadFile('web-assets/icons/github.svg'),
		twitterIcon: await loadFile('web-assets/icons/twitter.svg')
	};
	content = {
		project: await loadFile('web-assets/templates/project.mustache'),
		gallery: await loadFile('web-assets/templates/gallery.mustache')
	};
	scripts = {
		gallery: await loadFile('web-assets/scripts/gallery.js')
	};
	styles = {
		universal: await loadFile('web-assets/styles/universal.css'),
		project: await loadFile('web-assets/styles/project.css'),
		gallery: await loadFile('web-assets/styles/gallery.css'),
		fontRaleway: await loadFile('web-assets/styles/font-raleway.css')
	};
	siteData = {
		siteName: config.siteName,
		sections: config.nav.map(section => config.sections[section]),
		githubUri: config.links.github,
		twitterUri: config.links.twitter,
		showDebugColors: config.showDebugColors
	};
}

export async function buildGalleryHtml(galleryData, projects, buildOptions) {
	if (!isLoaded) {
		await load();
	}
	let configJSON = {
		cellWidth: config.grid.cellWidth,
		cellHeight: config.grid.cellHeight,
		cellGap: config.grid.cellGap,
		colStep: config.grid.colStep,
		defaultCols: config.grid.defaultCols,
		minCols: config.grid.minCols,
		maxCols: config.grid.maxCols
	};
	let projectsJSON = Object.values(projects)
		.map(projectData => {
			return {
				id: projectData.id,
				coordinates: projectData.grid.coordinates
			};
		});
	let animatedProjectsJSON = Object.values(projects)
		.filter(projectData => projectData.image.animated)
		.map(projectData => {
			return {
				id: projectData.id,
				scale: projectData.grid.scale,
				imageUri: projectData.image.project.uri
			};
		});
	let html = Mustache.render(templates.base, {
		...siteData,
		...buildOptions,
		projects: Object.values(projects),
		title: galleryData.title,
		showSubheading: true,
		navInHeader: false,
		showFooterText: true,
		isPixelArt: galleryData.isPixelArt,
		minBodyWidth: 320,
		minBodyHeight: null,
		configJSON: JSON.stringify(configJSON),
		gridHeightsJSON: JSON.stringify(buildOptions.gridHeights),
		projectsJSON: JSON.stringify(projectsJSON),
		animatedProjectsJSON: JSON.stringify(animatedProjectsJSON)
	}, {
		...templates,
		main: content.gallery,
		script: scripts.gallery,
		style: styles.fontRaleway + styles.universal + styles.gallery
	});
	await saveFile(`build/public/${galleryData.uri}.html`, html);
}

export async function buildProjectHtml(galleryData, projectData, buildOptions) {
	if (!isLoaded) {
		await load();
	}
	let html = Mustache.render(templates.base, {
		...siteData,
		...projectData,
		...buildOptions,
		showSubheading: false,
		navInHeader: true,
		showFooterText: false,
		isPixelArt: galleryData.isPixelArt,
		minBodyWidth: Math.max(projectData.image.project.width + 20, 320),
		minBodyHeight: Math.max(projectData.image.project.height + 200, 400),
		mainWidth: Math.max(projectData.image.project.width, 280)
	}, {
		...templates,
		main: content.project,
		script: null,
		style: styles.fontRaleway + styles.universal + styles.project
	});
	await saveFile(`build/public/${galleryData.uri}/${projectData.project}.html`, html);
};