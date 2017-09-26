import buildGallery from './buildGallery';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

export default async () => {
	// todo iterate through all sections
	await buildGallery(config.sections.pixels, pixels);
};