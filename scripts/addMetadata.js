import parseDate from './parseDate';
import loadImage from './helper/loadImage';
import saveDeanimatedImage from './helper/saveDeanimatedImage';

export default async (galleryData, projects) => {
	// gather some metadata
	let ordered = [];
	for (let [ project, projectData ] of Object.entries(projects)) {
		projectData.id = `project-${project}`;
		projectData.uri = `/${galleryData.uri}/${project}`;
		// parse the time and human-readable date
		let { time, dateText } = parseDate(projectData.date);
		projectData.time = time;
		projectData.dateText = dateText;
		ordered.push({ project, time });
		// add metadata about the image
		let imagePath = `web-assets/images/${galleryData.imagesUri}/${projectData.image.name}`;
		let imageUri = `/images/${galleryData.imagesUri}/${projectData.image.name}`;
		let image = await loadImage(imagePath);
		projectData.project = project;
		projectData.image.raw = {
			path: imagePath,
			uri: imageUri,
			width: image.width,
			height: image.height
		};
		let mult = Math.max(1, Math.min(Math.floor(Math.min(500 / image.width, 500 / image.height)), 6));
		projectData.image.project = {
			path: imagePath,
			uri: imageUri,
			width: image.width * mult,
			height: image.height * mult
		};
		// if it's an animated image, we need to create a non-animated one
		if (projectData.image.animated) {
			let deanimatedImagePath = `build/deanimated/${galleryData.imagesUri}/${projectData.image.name}`;
			await saveDeanimatedImage(imagePath, deanimatedImagePath);
			projectData.image.raw.deanimatedPath = deanimatedImagePath;
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