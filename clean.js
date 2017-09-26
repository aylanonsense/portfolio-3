import fs from 'fs';
import rimraf from 'rimraf';
import config from './data/config.json';

rimraf('build', () => {
	fs.mkdirSync('build');
	fs.mkdirSync('build/public');
	fs.mkdirSync('build/public/images');
	fs.mkdirSync('build/deanimated');
	for (let [ page, pageData ] of Object.entries(config.pages)) {
		fs.mkdirSync(`build/public/${pageData.uri}`);
		fs.mkdirSync(`build/public/images/${pageData.imagesUri}`);
		fs.mkdirSync(`build/deanimated/${pageData.imagesUri}`);
	}
});