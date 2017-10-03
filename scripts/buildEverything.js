import buildGallery from './buildGallery';
import config from '../data/config.json';
import pixels from '../data/pixels.json';
import games from '../data/games.json';

import addMetadata from './addMetadata';
import { buildProjectHtml } from './buildHtml';

export default async () => {
	// await buildGallery(config.sections.pixels, pixels);
	await buildGallery(config.sections.games, games);
};