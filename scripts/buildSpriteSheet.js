import packProjects from './packProjects';
import saveSpriteSheet from './saveSpriteSheet';

export default async (galleryData, projects) => {
	let spriteSheetPath = `build/public/images/${galleryData.imagesUri}-1.png`;
	let { bins, width, height } = packProjects(projects);
	for (let bin of bins) {
		projects[bin.project].image.spriteSheet = {
			path: spriteSheetPath,
			x: bin.x,
			y: bin.y,
			width: bin.width,
			height: bin.height,
			sheetWidth: width,
			sheetHeight: height
		};
	}
	await saveSpriteSheet(spriteSheetPath, projects, width, height);
};