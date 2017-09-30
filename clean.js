import fs from 'fs';
import rimraf from 'rimraf';
import config from './data/config.json';

console.log('Cleaning file system')
console.log('  Removing all build files...');
rimraf('build', () => {
	console.log('  Making new blank directories...');
	fs.mkdirSync('build');
	fs.mkdirSync('build/public');
	fs.mkdirSync('build/deanimated');
	for (let [ section, sectionData ] of Object.entries(config.sections)) {
		if (sectionData.isGallery) {
			fs.mkdirSync(`build/public/${sectionData.uri}`);
		}
	}
	console.log('  Done!');
});