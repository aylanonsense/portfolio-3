import addMetadata from './addMetadata';
import buildSpriteSheet from './buildSpriteSheet';
import determineGridSizes from './determineGridSizes';
import buildGrid from './buildGrid';
import { buildGalleryHtml, buildProjectHtml } from './buildHtml';

export default async (galleryData, projects) => {
	await addMetadata(galleryData, projects);
	await buildSpriteSheet(galleryData, projects);
	await determineGridSizes(projects);
	let { width, height } = await buildGrid(projects);
	await buildGalleryHtml(galleryData, projects, {
		gridWidth: width,
		gridHeight: height
	});
	for (let [ project, projectData ] of Object.entries(projects)) {
		await buildProjectHtml(galleryData, projectData, {});
	}
};