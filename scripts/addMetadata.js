import striptags from 'striptags';
import parseDate from './parseDate';
import loadFile from './helper/loadFile';
import loadImage from './helper/loadImage';
import applyDefaults from './helper/applyDefaults';
import saveDeanimatedImage from './helper/saveDeanimatedImage';

export default async (galleryData, projects) => {
	let proxies = {};
	// gather some metadata
	let ordered = [];
	for (let [ project, projectData ] of Object.entries(projects)) {
		if (galleryData.projectDefaults) {
			applyDefaults(galleryData.projectDefaults, projectData);
		}
		projectData.project = project;
		projectData.id = `project-${project}`;
		projectData.uri = `/${galleryData.uri}/${project}`;
		if (!projectData.shortDescription) {
			projectData.shortDescription = projectData.description;
		}
		projectData.priority = projectData.priority || 0;
		projectData.descriptionStripped = projectData.description ? striptags(projectData.description) : null;
		projectData.shortDescriptionStripped = projectData.shortDescription ? striptags(projectData.shortDescription) : null;
		projectData.includeScreenReadableText = !projectData.isComplete;
		// parse the time and human-readable date
		let { time, dateText } = parseDate(projectData.date);
		projectData.time = time;
		projectData.dateText = dateText;
		ordered.push({ project, time });
		// add metadata about the image
		if (projectData.image) {
			let imagePath = `web-assets/images/${galleryData.uri}/${projectData.image.fileName}`;
			let imageUri = `/${galleryData.uri}/${projectData.image.fileName}`;
			let image = await loadImage(imagePath);
			projectData.image.raw = {
				path: imagePath,
				uri: imageUri,
				width: image.width,
				height: image.height
			};
			let scale = Math.max(1, Math.min(Math.floor(Math.min(550 / image.width, 600 / image.height)), 6));
			if (projectData.isPixelArt) {
				scale = Math.max(2, scale);
			}
			else {
				scale = Math.min(1, scale);
			}
			projectData.image.project = {
				path: imagePath,
				uri: imageUri,
				width: image.width * scale,
				height: image.height * scale
			};
			// if it's an animated image, we need to create a non-animated one
			if (projectData.image.animated) {
				let deanimatedImagePath = `build/deanimated/${projectData.image.fileName}`;
				await saveDeanimatedImage(imagePath, deanimatedImagePath);
				projectData.image.raw.deanimatedPath = deanimatedImagePath;
			}
		}
		if (projectData.type === 'pico-8') {
			projectData.code.path = `web-assets/pico-8/${galleryData.uri}/${projectData.code.fileName}`;
			projectData.code.content = await loadFile(projectData.code.path);
		}
		else if (projectData.type === 'flash') {
			projectData.code.uri = `/${galleryData.uri}/${projectData.code.fileName}`;
		}
		else if (projectData.type === 'raw-js') {
			projectData.code.path = `web-assets/scripts/${galleryData.uri}/${projectData.code.fileName}`;
			projectData.code.content = await loadFile(projectData.code.path);
		}
		else if (projectData.type === 'proxy') {
			projectData.proxy.uri = `/${galleryData.uri}/${project}/proxy`;
			proxies[projectData.proxy.uri] = projectData.proxy.port;
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

	return proxies;
};