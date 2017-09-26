import addMetadata from './addMetadata';
import buildSpriteSheet from './buildSpriteSheet';
import determineGridSizes from './determineGridSizes';
import { buildGalleryHtml, buildProjectHtml } from './buildHtml';

export default async (galleryData, projects) => {
	await addMetadata(galleryData, projects);
	await buildSpriteSheet(galleryData, projects);
	await determineGridSizes(projects);
	await buildGalleryHtml(galleryData, {
		gridWidth: 70,
		gridHeight: 70,
		gridItems: [
			{ x: 0,   y: 0,   width: 30,  height: 30 },
			{ x: 0,   y: 40,  width: 30,  height: 30 },
			{ x: 40,  y: 0,   width: 30,  height: 30 },
			{ x: 40,  y: 40,  width: 30,  height: 30 }
		]
	});
	for (let [ project, projectData ] of Object.entries(projects)) {
		await buildProjectHtml(galleryData, projectData, {});
	}
};