import addMetadata from './addMetadata';
import buildSpriteSheet from './buildSpriteSheet';
import determineGridSizes from './determineGridSizes';
import buildGrid from './buildGrid';
import { buildGalleryHtml, buildProjectHtml } from './buildHtml';

export default async (galleryData, projects) => {
	console.log(`Building ${galleryData.title}`);
	console.log('  Adding project metadata...');
	let proxies = await addMetadata(galleryData, projects);
	console.log('  Determining grid sizes...');
	await determineGridSizes(galleryData, projects);
	console.log('  Building spritesheet...');
	await buildSpriteSheet(galleryData, projects);
	if (galleryData.galleryType === 'binpacked-grid') {
		console.log('  Building grid...');
		await buildGrid(projects);
	}
	console.log('  Building gallery html...');
	await buildGalleryHtml(galleryData, projects);
	console.log('  Building project html...');
	for (let [ project, projectData ] of Object.entries(projects)) {
		await buildProjectHtml(galleryData, projectData);
	}
	console.log(`  Done building ${galleryData.title}!`);
	return proxies;
};