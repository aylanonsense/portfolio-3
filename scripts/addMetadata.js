import striptags from 'striptags';
import parseDate from './parseDate';
import loadFile from './helper/loadFile';
import loadImage from './helper/loadImage';
import saveDeanimatedImage from './helper/saveDeanimatedImage';

export default async (galleryData, projects) => {
	// gather some metadata
	let ordered = [];
	for (let [ project, projectData ] of Object.entries(projects)) {
		if (galleryData.projectDefaults) {
			for (let [ prop, value ] of Object.entries(galleryData.projectDefaults)) {
				if (!projectData.hasOwnProperty(prop)) {
					projectData[prop] = value;
				}
			}
		}
		projectData.project = project;
		projectData.id = `project-${project}`;
		projectData.uri = `/${galleryData.uri}/${project}`;
		projectData.descriptionStripped = projectData.description ? striptags(projectData.description) : null;
		// parse the time and human-readable date
		let { time, dateText } = parseDate(projectData.date);
		projectData.time = time;
		projectData.dateText = dateText;
		ordered.push({ project, time });
		// add metadata about the image
		if (projectData.type === 'image') {
			let imagePath = `web-assets/images/${galleryData.uri}/${projectData.image.fileName}`;
			let imageUri = `/${galleryData.uri}/${projectData.image.fileName}`;
			let image = await loadImage(imagePath);
			projectData.image.raw = {
				path: imagePath,
				uri: imageUri,
				width: image.width,
				height: image.height
			};
			let mult = Math.max(2, Math.min(Math.floor(Math.min(550 / image.width, 600 / image.height)), 6));
			projectData.image.project = {
				path: imagePath,
				uri: imageUri,
				width: image.width * mult,
				height: image.height * mult
			};
			// if it's an animated image, we need to create a non-animated one
			if (projectData.image.animated) {
				let deanimatedImagePath = `build/deanimated/${projectData.image.fileName}`;
				await saveDeanimatedImage(imagePath, deanimatedImagePath);
				projectData.image.raw.deanimatedPath = deanimatedImagePath;
			}
		}
		else if (projectData.type === 'pico8') {
			projectData.code.path = `web-assets/pico-8/${projectData.code.fileName}`;
			projectData.code.content = await loadFile(projectData.code.path);
		}
	}

	// add metadata about which projects comes next/prev in the order
	ordered.sort((a, b) => b.time - a.time);
	for (let i = 0; i < ordered.length; i++) {
		let project = ordered[i].project;
		let projectData = projects[project];
		let nextProjectIndex = i === ordered.length - 1 ? 0 : i + 1;
		let prevProjectIndex = i === 0 ? ordered.length - 1 : i - 1;
		projectData.nextProject = ordered[nextProjectIndex].project;
		projectData.prevProject = ordered[prevProjectIndex].project;
	}
};