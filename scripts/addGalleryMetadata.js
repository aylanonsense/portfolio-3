import striptags from 'striptags';
import parseDate from './parseDate';
import loadFile from './helper/loadFile';
import loadImage from './helper/loadImage';
import applyDefaults from './helper/applyDefaults';

function cleanUpFilePath(data, defaultName, defaultExtension) {
	data.name = data.name || defaultName;
	data.ext = data.ext || defaultExtension;
	data.file = data.name + '.' + data.ext;
}

export default async (galleryData, projects) => {
	let proxies = {};
	// gather some metadata
	let ordered = [];
	for (let [ project, projectData ] of Object.entries(projects)) {
		// apply default metadata from the gallery
		if (galleryData.projectDefaults) {
			applyDefaults(galleryData.projectDefaults, projectData);
		}
		// add basic metadata
		projectData.project = project;
		projectData.id = `project-${project}`;
		projectData.uri = `/${galleryData.uri}/${project}`;
		projectData.hidden = projectData.hidden || false;
		projectData.priority = projectData.priority || 0;
		projectData.shortDescription = projectData.shortDescription || projectData.description;
		projectData.descriptionStripped = projectData.description ? striptags(projectData.description) : null;
		projectData.shortDescriptionStripped = projectData.shortDescription ? striptags(projectData.shortDescription) : null;
		// parse the date into a  time and human-readable date
		let { time, dateText } = parseDate(projectData.date);
		projectData.time = time;
		projectData.dateText = dateText;
		ordered.push({ project, time });
		// add metadata about the image associated with the project
		if (projectData.type === 'image') {
			projectData.image = projectData.image || {};
			projectData.image.animated = projectData.image.animated || false;
			projectData.image.touchesEdges = projectData.image.touchesEdges || false;
		}
		if (projectData.image) {
			cleanUpFilePath(projectData.image, project, (projectData.image.animated ? 'gif' : 'png'));
			let imagePath = `web-assets/images/${galleryData.uri}/${projectData.image.file}`;
			let image = await loadImage(imagePath);
			projectData.image.raw = {
				path: imagePath,
				uri: `/${galleryData.uri}/${projectData.image.file}`,
				width: image.width,
				height: image.height
			};
		}
		// each project type has its own files to load
		if (projectData.type === 'pico-8') {
			projectData.code = projectData.code || {};
			cleanUpFilePath(projectData.code, project, 'js');
			projectData.code.path = `web-assets/pico-8/${galleryData.uri}/${projectData.code.file}`;
			projectData.code.content = await loadFile(projectData.code.path);
		}
		else if (projectData.type === 'flash') {
			projectData.code = projectData.code || {};
			cleanUpFilePath(projectData.code, project, 'swf');
			projectData.code.uri = `/${galleryData.uri}/${projectData.code.file}`;
		}
		else if (projectData.type === 'raw-js') {
			projectData.code = projectData.code || {};
			cleanUpFilePath(projectData.code, project, 'js');
			projectData.code.path = `web-assets/scripts/${galleryData.uri}/${projectData.code.file}`;
			projectData.code.content = await loadFile(projectData.code.path);
		}
		else if (projectData.type === 'proxy') {
			projectData.proxy.uri = `/${galleryData.uri}/${project}/proxy`;
			proxies[projectData.proxy.uri] = projectData.proxy.port;
		}
	}

	// add metadata about project order
	ordered.sort((a, b) => b.time - a.time);
	for (let i = 0; i < ordered.length; i++) {
		let project = ordered[i].project;
		let projectData = projects[project];
		projectData.order = i;
		let nextProjectIndex = i === ordered.length - 1 ? 0 : i + 1;
		let prevProjectIndex = i === 0 ? ordered.length - 1 : i - 1;
		projectData.nextProject = ordered[nextProjectIndex].project;
		projectData.prevProject = ordered[prevProjectIndex].project;
	}

	return proxies;
};