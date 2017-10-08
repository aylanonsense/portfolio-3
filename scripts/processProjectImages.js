import gm from 'gm';
import striptags from 'striptags';
import config from '../data/config';
import parseDate from './parseDate';
import loadFile from './helper/loadFile';
import loadImage from './helper/loadImage';
import applyDefaults from './helper/applyDefaults';
import convertToVideo from './helper/convertToVideo';
import saveProcessedImage from './helper/saveProcessedImage';

export default async (galleryData, projects) => {
	for (let [ project, projectData ] of Object.entries(projects)) {
		if (config.showVerboseLogging) { console.log(`    Processing ${project} images...`); }
		if (projectData.image) {
			// crop and resize the image for the gallery grid
			let width = projectData.image.raw.width;
			let height = projectData.image.raw.height;
			let scale = projectData.grid.scale;
			let resize = null;
			if (!projectData.isPixelArt && scale < 1) {
				width = Math.ceil(width * scale);
				height = Math.ceil(height * scale);
				resize = { width, height };
			}
			let crop = null;
			if (projectData.grid.width > width || projectData.grid.height > height) {
				// x and y
				let widthPostCrop = Math.ceil(Math.min(projectData.grid.width / Math.max(1, scale), width));
				let heightPostCrop = Math.ceil(Math.min(projectData.grid.height / Math.max(1, scale), height));
				crop = {
					width: widthPostCrop,
					height: heightPostCrop,
					x: Math.floor((width - widthPostCrop) / 2),
					y: Math.floor((height - heightPostCrop) / 2)
				};
				width = crop.width;
				height = crop.height;
			}
			// save a rescaled (and deanimated) version
			let rescaledPath = `build/rescaled-images/${galleryData.uri}/${projectData.image.file}`;
			if (config.saveImages) {
				await saveProcessedImage(projectData.image.raw.path, rescaledPath, {
					deanimate: projectData.image.animated,
					resize: resize,
					crop: crop
				});
			}
			projectData.image.rescaled = { path: rescaledPath, width, height };
			// determine how big the image will be on the project page
			scale = Math.max(1, Math.min(Math.floor(Math.min(550 / projectData.image.raw.width, 600 / projectData.image.raw.height)), 6));
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