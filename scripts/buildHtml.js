import Mustache from 'mustache';
import { minify } from 'html-minifier';
import loadFile from './helper/loadFile';
import saveFile from './helper/saveFile';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

const minifyOptions = {
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	minifyCSS: {
		level: 2
	},
	minifyJS: {
		compress: {
			sequences: true,
			properties: true,
			dead_code: true,
			drop_debugger: true,
			unsafe: true,
			unsafe_comps: true,
			unsafe_Func: true,
			unsafe_math: true,
			unsafe_proto: true,
			unsafe_regexp: true,
			conditionals: true,
			comparisons: true,
			evaluate: true,
			booleans: true,
			typeofs: true,
			loops: true,
			unused: true,
			toplevel: false,
			top_retain: false,
			hoist_funs: true,
			hoist_vars: false,
			if_return: true,
			inline: true,
			join_vars: true,
			cascade: true,
			collapse_vars: true,
			reduce_vars: true,
			warnings: false,
			negate_iife: true,
			pure_getters: true,
			pure_funcs: null,
			drop_console: true,
			expression: false,
			keep_fargs: false,
			keep_fnames: false,
			passes: 1,
			keep_infinity: false,
			side_effects: true
		},
		mangle: {
			reserved: [],
			toplevel: true,
			keep_fnames: false,
			eval: true
		},
		output: {
			ascii_only: false,
			beautify: false,
			bracketize: false,
			comments: false,
			indent_level: 4,
			indent_start: 0,
			inline_script: false,
			keep_quoted_props: false,
			max_line_len: false,
			preamble: null,
			preserve_line: false,
			quote_keys: false,
			quote_style: 0,
			semicolons: true,
			shebang: false,
			wrap_iife: false
		},
		sourceMap: false,
		toplevel: true,
		warnings: true
	},
	minifyURLs: true,
	removeAttributeQuotes: true,
	removeComments: true,
	removeEmptyAttributes: true,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true,
	useShortDoctype: true,
};

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
		.map(projectData => [ projectData.id, projectData.grid.coordinates ]);
	let animatedProjectsJSON = Object.values(projects)
		.filter(projectData => projectData.image.animated)
		.map(projectData => [ projectData.id, projectData.grid.scale, projectData.image.project.uri ]);
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
	let minifiedHtml = minify(html, minifyOptions);
	await saveFile(`build/public/${galleryData.uri}.html`, minifiedHtml);
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
	let minifiedHtml = minify(html, minifyOptions);
	await saveFile(`build/public/${galleryData.uri}/${projectData.project}.html`, minifiedHtml);
};