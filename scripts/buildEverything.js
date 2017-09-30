import buildGallery from './buildGallery';
import config from '../data/config.json';
import pixels from '../data/pixels.json';
import games from '../data/games.json';

import addMetadata from './addMetadata';
import { buildProjectHtml } from './buildHtml';

export default async () => {
	await buildGallery(config.sections.pixels, pixels);
	await addMetadata(config.sections.games, games);
	await buildProjectHtml(config.sections.games, games['8-legs-to-love']);
};