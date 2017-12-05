import buildGallery from './buildGallery';
import config from '../data/config.json';
import pixels from '../data/pixels.json';
import games from '../data/games.json';
import slides from '../data/slides.json';
import saveFile from './helper/saveFile';

import addMetadata from './addMetadata';
import { buildProjectHtml } from './buildHtml';

export default async () => {
	for(let [ section, sectionData ] of Object.entries(config.sections)) {
		sectionData.section = section;
	}
	let proxies = {
		...(await buildGallery(config.sections.pixels, pixels)),
		...(await buildGallery(config.sections.games, games))
	};
	for(let [ slide, slideData ] of Object.entries(slides)) {
		proxies[`/slides/${slide}`] = slideData.proxy.port;
	}
};