import addMetadata from './addMetadata';
import packProjects from './packProjects';
import saveSpriteSheet from './saveSpriteSheet';
import determineGridSizes from './determineGridSizes';
import { buildGalleryHtml, buildProjectHtml } from './buildHtml';

export default async (pageData, projects) => {
	await addMetadata(pageData, projects);

	// pack the thumbnails into sprite sheets
	let spriteSheetPath = `build/public/images/${pageData.imagesUri}-1.png`;
	let { bins, width, height } = packProjects(projects);
	for (let bin of bins) {
		let project = bin.project;
		let projectData = projects[project];
		projectData.image.spriteSheet = {
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

	// determine how big each item should be in the grid
	determineGridSizes(projects);

	// make the base pixel art page
	await buildGalleryHtml(pageData, {
		gridWidth: 630,
		gridHeight: 710,
		gridItems: [
			{ x: 0,   y: 0,   width: 30,  height: 30 },
			{ x: 0,   y: 40,  width: 30,  height: 30 },
			{ x: 40,  y: 0,   width: 30,  height: 30 },
			{ x: 40,  y: 40,  width: 30,  height: 30 },
			{ x: 80,  y: 0,   width: 70,  height: 70 },
			{ x: 160, y: 0,   width: 70,  height: 70 },
			{ x: 0,   y: 80,  width: 70,  height: 110 },
			{ x: 80,  y: 80,  width: 150, height: 150 },
			{ x: 0,   y: 200, width: 30,  height: 30 },
			{ x: 40,  y: 200, width: 30,  height: 30 },
			{ x: 240, y: 0,   width: 230, height: 230 },
			{ x: 240, y: 240, width: 30,  height: 30 },
			{ x: 240, y: 280, width: 30,  height: 30 },
			{ x: 280, y: 240, width: 30,  height: 30 },
			{ x: 280, y: 280, width: 30,  height: 30 },
			{ x: 320, y: 240, width: 70,  height: 70 },
			{ x: 400, y: 240, width: 70,  height: 70 },
			{ x: 240, y: 320, width: 70,  height: 110 },
			{ x: 320, y: 320, width: 150, height: 150 },
			{ x: 240, y: 440, width: 30,  height: 30 },
			{ x: 280, y: 440, width: 30,  height: 30 },
			{ x: 0,   y: 240, width: 230, height: 230 },
			{ x: 240, y: 480, width: 30,  height: 30 },
			{ x: 240, y: 520, width: 30,  height: 30 },
			{ x: 280, y: 480, width: 30,  height: 30 },
			{ x: 280, y: 520, width: 30,  height: 30 },
			{ x: 320, y: 480, width: 70,  height: 70 },
			{ x: 400, y: 480, width: 70,  height: 70 },
			{ x: 240, y: 560, width: 70,  height: 110 },
			{ x: 320, y: 560, width: 150, height: 150 },
			{ x: 240, y: 680, width: 30,  height: 30 },
			{ x: 280, y: 680, width: 30,  height: 30 },
			{ x: 0,   y: 480, width: 230, height: 230 },
			{ x: 480, y: 0,   width: 70,  height: 230 },
			{ x: 480, y: 240, width: 70,  height: 230 },
			{ x: 480, y: 480, width: 70,  height: 230 },
			{ x: 560, y: 0,   width: 70,  height: 230 },
			{ x: 560, y: 240, width: 70,  height: 230 },
			{ x: 560, y: 480, width: 70,  height: 230 },
		]
	});

	// make all the pixel art project pages
	for (let project in projects) {
		await buildProjectHtml(pageData, projects[project], {});
	}
};