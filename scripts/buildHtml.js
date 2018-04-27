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
			gridItemImage: await loadFile('web-assets/templates/grid-item-image.mustache'),
			gameControls: await loadFile('web-assets/templates/game-controls.mustache'),
			analyticsHead: await loadFile('web-assets/templates/google-analytics-head.mustache'),
			analyticsBody: await loadFile('web-assets/templates/google-analytics-body.mustache'),
			artstationIcon: await loadFile('web-assets/icons/artstation.svg'),
			deviantartIcon: await loadFile('web-assets/icons/deviantart.svg'),
			facebookIcon: await loadFile('web-assets/icons/facebook.svg'),
			gamejoltIcon: await loadFile('web-assets/icons/gamejolt.svg'),
			githubIcon: await loadFile('web-assets/icons/github.svg'),
			instagramIcon: await loadFile('web-assets/icons/instagram.svg'),
			kofiIcon: await loadFile('web-assets/icons/kofi.svg'),
			lexaloffleIcon: await loadFile('web-assets/icons/lexaloffle.svg'),
			linkedinIcon: await loadFile('web-assets/icons/linkedin.svg'),
			mediumIcon: await loadFile('web-assets/icons/medium.svg'),
			newgroundsIcon: await loadFile('web-assets/icons/newgrounds.svg'),
			patreonIcon: await loadFile('web-assets/icons/patreon.svg'),
			pinterestIcon: await loadFile('web-assets/icons/pinterest.svg'),
			tumblrIcon: await loadFile('web-assets/icons/tumblr.svg'),
			twitchIcon: await loadFile('web-assets/icons/twitch.svg'),
			twitterIcon: await loadFile('web-assets/icons/twitter.svg'),
			youtubeIcon: await loadFile('web-assets/icons/youtube.svg')
		},
		content: {
			image: await loadFile('web-assets/templates/image.mustache'),
			pico8: await loadFile('web-assets/templates/pico-8.mustache'),
			flash: await loadFile('web-assets/templates/flash.mustache'),
			rawJS: await loadFile('web-assets/templates/raw-js.mustache'),
			proxy: await loadFile('web-assets/templates/proxy.mustache'),
			about: await loadFile('web-assets/templates/about.mustache'),
			gallery: await loadFile('web-assets/templates/gallery.mustache')
		},
		scripts: {
			gallery: await loadFile('web-assets/scripts/gallery.js'),
			pico8: await loadFile('web-assets/scripts/pico-8.js'),
			rawJS: await loadFile('web-assets/scripts/raw-js.js'),
			proxy: await loadFile('web-assets/scripts/proxy.js')
		},
		styles: {
			universal: await loadFile('web-assets/styles/universal.css'),
			about: await loadFile('web-assets/styles/about.css'),
			centeredContent: await loadFile('web-assets/styles/centered-content.css'),
			textContent: await loadFile('web-assets/styles/text-content.css'),
			gallery: await loadFile('web-assets/styles/gallery.css'),
			project: await loadFile('web-assets/styles/project.css'),
			game: await loadFile('web-assets/styles/game.css'),
			pico8: await loadFile('web-assets/styles/pico-8.css'),
			proxy: await loadFile('web-assets/styles/proxy.css'),
			fontRaleway: await loadFile('web-assets/styles/font-raleway.css'),
			fullHeaderFooter: await loadFile('web-assets/styles/full-header-footer.css'),
			smallHeaderFooter: await loadFile('web-assets/styles/small-header-footer.css'),
			blogPost: await loadFile('web-assets/styles/blog-post.css')
		},
	};
}

export async function buildGalleryHtml(galleryData, projects, options) {
	if (!hasLoadedAssets) {
		await loadAssets();
	}
	let view = {
		...galleryData,
		projects: Object.values(projects).filter(projectData => !projectData.hidden),
		showSubheading: true,
		navInHeader: false,
		showFooterText: true,
		minBodyWidth: 320,
		minBodyHeight: null,
		mainWidth: null,
		projectsJSON: JSON.stringify(Object.values(projects)
			.filter(projectData => !projectData.hidden)
			.map(projectData => [ projectData.id, projectData.grid.coordinates ])),
		animatedProjectsJSON: JSON.stringify(Object.values(projects)
			.filter(projectData => projectData.image.animated && !projectData.hidden)
			.map(projectData => [ projectData.id, projectData.grid.scale, projectData.image.raw.uri ])),
		...options
	};
	let content = assets.content.gallery;
	let scripts = [ assets.scripts.gallery ];
	let styles = [ assets.styles.universal, assets.styles.centeredContent, assets.styles.fullHeaderFooter, assets.styles.gallery, assets.styles.fontRaleway ];
	await buildHtml(`build/html/${view.uri}.html`, view, content, scripts, styles);
}

export async function buildProjectHtml(galleryData, projectData) {
	if (config.showVerboseLogging) { console.log(`    Building ${projectData.project} html...`); }
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
	let styles = [ assets.styles.universal, assets.styles.centeredContent, assets.styles.smallHeaderFooter, assets.styles.project, assets.styles.fontRaleway ];
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
		styles.push(assets.styles.game, assets.styles.pico8);
	}
	else if (projectData.type === "flash") {
		content = assets.content.flash;
		view.minBodyWidth = Math.max(projectData.code.width + 20, 320);
		view.minBodyHeight = Math.max(projectData.code.height + 200, 400);
		view.mainWidth = Math.max(projectData.code.width, 280);
	}
	else if (projectData.type === "raw-js") {
		content = assets.content.rawJS;
		scripts.push(assets.scripts.rawJS);
		view.minBodyWidth = Math.max(projectData.code.width + 20, 320);
		view.minBodyHeight = Math.max(projectData.code.height + 200, 400);
		view.mainWidth = Math.max(projectData.code.width, 280);
	}
	else if (projectData.type === "proxy") {
		content = assets.content.proxy;
		scripts.push(assets.scripts.proxy);
		styles.push(assets.styles.proxy);
		view.minBodyWidth = Math.max(projectData.proxy.width + 20, 320);
		view.minBodyHeight = Math.max(projectData.proxy.height + 200, 400);
		view.mainWidth = Math.max(projectData.proxy.width, 280);
	}
	await buildHtml(`build/html/${galleryData.uri}/${projectData.project}.html`, view, content, scripts, styles);
}

export async function buildBlogPostHtml(blogData, postData) {
	if (config.showVerboseLogging) { console.log(`    Building ${postData.post} html...`); }
	if (!hasLoadedAssets) {
		await loadAssets();
	}
	let view = {
		...postData,
		showSubheading: false,
		navInHeader: true,
		showFooterText: false,
		minBodyWidth: 320,
		minBodyHeight: null,
		mainWidth: null,
	};
	let content = postData.html.content;
	let scripts = [ ];
	let styles = [ assets.styles.universal, assets.styles.smallHeaderFooter, assets.styles.blogPost, assets.styles.fontRaleway ];
	await buildHtml(`build/html/${blogData.uri}/${postData.post}.html`, view, content, scripts, styles);
}

export async function buildAboutHtml(aboutData) {
	if (config.showVerboseLogging) { console.log(`    Building About Me html...`); }
	if (!hasLoadedAssets) {
		await loadAssets();
	}
	let view = {
		...aboutData,
		showSubheading: true,
		navInHeader: false,
		showFooterText: true,
		minBodyWidth: 320
	};
	let content = assets.content.about;
	let scripts = [ ];
	let styles = [ assets.styles.universal, assets.styles.textContent, assets.styles.about, assets.styles.fullHeaderFooter, assets.styles.fontRaleway ];
	await buildHtml(`build/html/${aboutData.uri}.html`, view, content, scripts, styles);
}

async function buildHtml(uri, view, content, scripts, styles) {
	let html = Mustache.render(assets.templates.base, {
		...siteData,
		...view,
		sections: siteData.sections.map(section => {
			return { ...section, isSelected: (view.uri === section.uri || (view.uri === 'index' && section.uri === config.index)) };
		}),
		configJSON: configJSON
	}, {
		...assets.templates,
		main: content,
		scripts: scripts.join('\n'),
		styles: styles.join('\n')
	});
	await saveFile(uri, config.minify && !config.quickBuild ? minify(html, minifyOptions) : html);
}