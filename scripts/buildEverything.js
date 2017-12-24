import config from '../data/config.json';
import pixels from '../data/pixels.json';
import games from '../data/games.json';
import posts from '../data/posts.json';
import slides from '../data/slides.json';
import buildGallery from './buildGallery';
import buildBlog from './buildBlog';
import saveFile from './helper/saveFile';

export default async () => {
	for(let [ section, sectionData ] of Object.entries(config.sections)) {
		sectionData.section = section;
	}
	let proxies = {
		...(await buildGallery(config.sections.pixels, pixels)),
		...(await buildGallery(config.sections.games, games))
	};
	buildBlog(config.sections.blog, posts);
	for(let [ slide, slideData ] of Object.entries(slides)) {
		proxies[`/slides/${slide}`] = slideData.proxy.port;
	}
	saveFile('build/proxies.json', JSON.stringify(proxies, null, '\t'));
};