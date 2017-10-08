import gm from 'gm';
import striptags from 'striptags';
import config from '../data/config';
import parseDate from './parseDate';
import loadFile from './helper/loadFile';
import loadImage from './helper/loadImage';
import applyDefaults from './helper/applyDefaults';
import convertToVideo from './helper/convertToVideo';
import saveDeanimatedImage from './helper/saveDeanimatedImage';

export default async (galleryData, projects) => {
	for (let [ project, projectData ] of Object.entries(projects)) {
		if (config.showVerboseLogging) { console.log(`    Processing ${project} images...`); }
		if (projectData.image) {
			// save a deanimated version of animated images
			let deanimatedPath = `build/deanimated-images/${galleryData.uri}/${projectData.image.file}`;
			if (config.saveImages) {
				await saveDeanimatedImage(projectData.image.raw.path, deanimatedPath);
			}
			projectData.image.deanimated = {
				path: deanimatedPath,
				width: projectData.image.raw.width,
				height: projectData.image.raw.height
			};
			// determine how big the image will be on the project page
			let scale = Math.max(1, Math.min(Math.floor(Math.min(550 / projectData.image.raw.width, 600 / projectData.image.raw.height)), 6));
			if (projectData.isPixelArt) {
				scale = Math.max(2, scale);
			}
			else {
				scale = Math.min(1, scale);
			}
			projectData.image.project = {
				uri: projectData.image.raw.uri,
				width: projectData.image.raw.width * scale,
				height: projectData.image.raw.height * scale
			};
		}
	}
};