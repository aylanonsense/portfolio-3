import Mustache from 'mustache';
import loadFile from './loadFile';
import saveFile from './saveFile';
import loadImage from './loadImage';
import packProjects from './packProjects';
import saveSpriteSheet from './saveSpriteSheet';
import { buildGalleryPage, buildProjectPage } from './buildPage';
import parseDate from './parseDate';
import config from '../data/config.json';
import pixels from '../data/pixels.json';

export default async () => {
	// gather some metadata
	let pixelsOrdering = [];
	for (let [ project, projectData ] of Object.entries(pixels)) {
		let { time, dateText } = parseDate(projectData.date);
		let imagePath = `images/${config.pages.pixels.imagesUri}/${projectData.image}`;
		let image = await loadImage(imagePath);
		pixels[project] = {
			...pixels[project],
			project,
			time,
			dateText,
			imagePath,
			imageWidth: image.width,
			imageHeight: image.height
		};
		pixelsOrdering.push({ project, time });
	}

	// add metadata about which projects come next/prev in the order
	pixelsOrdering.sort((a, b) => b.time - a.time);
	for (let i = 0; i < pixelsOrdering.length; i++) {
		let nextProjectIndex = i === pixelsOrdering.length - 1 ? 0 : i + 1;
		let prevProjectIndex = i === 0 ? pixelsOrdering.length - 1 : i - 1;
		let project = pixelsOrdering[i].project;
		let nextProject = pixelsOrdering[nextProjectIndex].project;
		let prevProject = pixelsOrdering[prevProjectIndex].project;
		pixels[project] = {
			...pixels[project],
			nextProject,
			prevProject
		}
	}

	// pack the thumbnails into sprite sheets
	await saveSpriteSheet('build/public/images/test.png', pixels, ...packProjects(pixels));

	// pretend we're making the base pixel art page
	await buildGalleryPage(config.pages.pixels, {
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

	// pretend we're in a loop
	for (let project in pixels) {
		await buildProjectPage(config.pages.pixels, pixels[project], {});
	}
};