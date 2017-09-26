import fs from 'fs';
import rimraf from 'rimraf';
import config from './data/config.json';

rimraf('build', () => {
	fs.mkdirSync('build');
	fs.mkdirSync('build/public');
	fs.mkdirSync('build/public/images');
	fs.mkdirSync('build/deanimated');
	for (let [ section, sectionData ] of Object.entries(config.sections)) {
		if (sectionData.isGallery) {
			fs.mkdirSync(`build/public/${sectionData.uri}`);
			fs.mkdirSync(`build/public/images/${sectionData.imagesUri}`);
			fs.mkdirSync(`build/deanimated/${sectionData.imagesUri}`);
		}
	}
});