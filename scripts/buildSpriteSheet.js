import packProjectImages from './packProjectImages';
import saveSpriteSheet from './helper/saveSpriteSheet';

export default async (galleryData, projects) => {
	let spriteSheetPath = `build/public/images/${galleryData.imagesUri}-1.png`;
	let { bins, width, height } = packProjectImages(projects);
	for (let bin of bins) {
		projects[bin.project].image.spriteSheet = {
			path: spriteSheetPath,
			uri: `/images/${galleryData.imagesUri}-1.png`,
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