import fs from 'fs';
import rimraf from 'rimraf';
import config from './data/config.json';

console.log('Cleaning file system')
console.log('  Removing all build files...');
rimraf('build', () => {
	console.log('  Making new blank directories...');
	fs.mkdirSync('build');
	fs.mkdirSync('build/html');
	fs.mkdirSync('build/sprite-sheets');
	fs.mkdirSync('build/deanimated-images');
	for (let [ section, sectionData ] of Object.entries(config.sections)) {
		fs.mkdirSync(`build/html/${sectionData.uri}`);
		if (sectionData.isGallery) {
			fs.mkdirSync(`build/sprite-sheets/${sectionData.uri}`);
			fs.mkdirSync(`build/deanimated-images/${sectionData.uri}`);
		}
	}
	console.log('  Done!');
});