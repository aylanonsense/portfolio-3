import Mustache from 'mustache';
import { minify } from 'html-minifier';
import loadFile from './helper/loadFile';
import saveFile from './helper/saveFile';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

const configJSON = JSON.stringify({
	cellWidth: config.grid.cellWidth,
	cellHeight: config.grid.cellHeight,
	cellGap: config.grid.cellGap,
	colStep: config.grid.colStep,
	defaultCols: config.grid.defaultCols,
	minCols: config.grid.minCols,
	maxCols: config.grid.maxCols
});
const minifyOptions = {
	collapseBooleanAttributes: true,
	collapseInlineTagWhitespace: false,
	collapseWhitespace: true,
	conservativeCollapse: false,
	minifyCSS: {
		level: {
			1: {
				removeEmpty: false,
				tidySelectors: false
			}
		}
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
const siteData = {
	...config,
	sections: config.nav.map(section => config.sections[section])
};

let hasLoadedAssets = false;
let assets;

async function loadAssets() {
	hasLoadedAssets = true;
	assets = {
		templates: {
			base: await loadFile('web-assets/templates/base.mustache'),
			layout: await loadFile('web-assets/templates/layout.mustache'),
			header: await loadFile('web-assets/templates/header.mustache'),
			nav: await loadFile('web-assets/templates/nav.mustache'),
			footer: await loadFile('web-assets/templates/footer.mustache'),
			projectDescription: await loadFile('web-assets/templates/project-description.mustache'),
			analyticsHead: await loadFile('web-assets/templates/google-analytics-head.mustache'),
			analyticsBody: await loadFile('web-assets/templates/google-analytics-body.mustache'),
			githubIcon: await loadFile('web-assets/icons/github.svg'),
			twitterIcon: await loadFile('web-assets/icons/twitter.svg')
		},
		content: {
			image: await loadFile('web-assets/templates/image.mustache'),
			pico8: await loadFile('web-assets/templates/pico8.mustache'),
			gallery: await loadFile('web-assets/templates/gallery.mustache')
		},
		scripts: {
			gallery: await loadFile('web-assets/scripts/gallery.js'),
			pico8: await loadFile('web-assets/scripts/pico8.js')
		},
		styles: {
			universal: await loadFile('web-assets/styles/universal.css'),
			project: await loadFile('web-assets/styles/project.css'),
			gallery: await loadFile('web-assets/styles/gallery.css'),
			pico8: await loadFile('web-assets/styles/pico8.css'),
			fontRaleway: await loadFile('web-assets/styles/font-raleway.css'),
		},
	};
}

export async function buildGalleryHtml(galleryData, projects) {
	if (!hasLoadedAssets) {
		await loadAssets();
	}
	let view = {
		...galleryData,
		projects: Object.values(projects),
		showSubheading: true,
		navInHeader: false,
		showFooterText: true,
		minBodyWidth: 320,
		minBodyHeight: null,
		mainWidth: null,
		projectsJSON: JSON.stringify(Object.values(projects)
			.map(projectData => [ projectData.id, projectData.grid.coordinates ])),
		animatedProjectsJSON: JSON.stringify(Object.values(projects)
			.filter(projectData => projectData.image.animated)
			.map(projectData => [ projectData.id, projectData.grid.scale, projectData.image.project.uri ]))
	};
	let content = assets.content.gallery;
	let scripts = [ assets.scripts.gallery ];
	let styles = [ assets.styles.universal, assets.styles.gallery, assets.styles.fontRaleway ];
	await buildHtml(`build/public/${galleryData.uri}.html`, view, content, scripts, styles);
}

export async function buildProjectHtml(galleryData, projectData) {
	if (!hasLoadedAssets) {
		await loadAssets();
	}
	// set up default build options for a project
	let view = {
		...projectData,
		showSubheading: false,
		navInHeader: true,
		showFooterText: false
	};
	let content = null;
	let scripts = [];
	let styles = [ assets.styles.universal, assets.styles.project, assets.styles.fontRaleway ];
	// change project defaults for each project type
	if (projectData.type === "image") {
		content = assets.content.image;
		view.minBodyWidth = Math.max(projectData.image.project.width + 20, 320);
		view.minBodyHeight = Math.max(projectData.image.project.height + 200, 400);
		view.mainWidth = Math.max(projectData.image.project.width, 280);
	}
	else if (projectData.type === "pico8") {
		content = assets.content.pico8;
		scripts.push(assets.scripts.pico8);
		styles.push(assets.styles.pico8);
		view.minBodyWidth = 600;
		view.minBodyHeight = 600;
		view.mainWidth = 512;
		view.pico8Code = projectData.code.content;
	}
	await buildHtml(`build/public/${galleryData.uri}/${projectData.project}.html`, view, content, scripts, styles);
};

async function buildHtml(uri, view, content, scripts, styles) {
	let html = Mustache.render(assets.templates.base, {
		...siteData,
		...view,
		configJSON: configJSON
	}, {
		...assets.templates,
		main: content,
		scripts: scripts.join('\n'),
		styles: styles.join('\n')
	});
	await saveFile(uri, config.minify ? minify(html, minifyOptions) : html);
}