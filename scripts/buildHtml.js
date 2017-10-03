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
			uniformGridItem: await loadFile('web-assets/templates/uniform-grid-item.mustache'),
			gridItemImage: await loadFile('web-assets/templates/grid-item-image.mustache'),
			gameControls: await loadFile('web-assets/templates/game-controls.mustache'),
			analyticsHead: await loadFile('web-assets/templates/google-analytics-head.mustache'),
			analyticsBody: await loadFile('web-assets/templates/google-analytics-body.mustache'),
			githubIcon: await loadFile('web-assets/icons/github.svg'),
			twitterIcon: await loadFile('web-assets/icons/twitter.svg')
		},
		content: {
			image: await loadFile('web-assets/templates/image.mustache'),
			pico8: await loadFile('web-assets/templates/pico-8.mustache'),
			binpackedGrid: await loadFile('web-assets/templates/binpacked-grid.mustache'),
			uniformGrid: await loadFile('web-assets/templates/uniform-grid.mustache')
		},
		scripts: {
			binpackedGrid: await loadFile('web-assets/scripts/binpacked-grid.js'),
			pico8: await loadFile('web-assets/scripts/pico-8.js')
		},
		styles: {
			universal: await loadFile('web-assets/styles/universal.css'),
			gallery: await loadFile('web-assets/styles/gallery.css'),
			project: await loadFile('web-assets/styles/project.css'),
			binpackedGrid: await loadFile('web-assets/styles/binpacked-grid.css'),
			uniformGrid: await loadFile('web-assets/styles/uniform-grid.css'),
			game: await loadFile('web-assets/styles/game.css'),
			pico8: await loadFile('web-assets/styles/pico-8.css'),
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
		mainWidth: null
	};
	let content = null;
	let scripts = [];
	let styles = [ assets.styles.universal, assets.styles.gallery, assets.styles.fontRaleway ];
	if (galleryData.galleryType === 'binpacked-grid') {
		content = assets.content.binpackedGrid;
		scripts.push(assets.scripts.binpackedGrid);
		styles.push(assets.styles.binpackedGrid);
		view.projectsJSON = JSON.stringify(Object.values(projects)
			.map(projectData => [ projectData.id, projectData.grid.coordinates ]));
		view.animatedProjectsJSON = JSON.stringify(Object.values(projects)
			.filter(projectData => projectData.image.animated)
			.map(projectData => [ projectData.id, projectData.grid.scale, projectData.image.project.uri ]));
	}
	else if (galleryData.galleryType === 'uniform-grid') {
		content = assets.content.uniformGrid;
		styles.push(assets.styles.uniformGrid);
	}
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
	else if (projectData.type === "pico-8") {
		content = assets.content.pico8;
		scripts.push(assets.scripts.pico8);
		styles.push(assets.styles.game);
		styles.push(assets.styles.pico8);
		view.minBodyWidth = 532;
		view.minBodyHeight = 705;
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