import buildPage from './buildPage';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

export default async () => {
	await buildPage(config.pages.pixels, pixels);
};