import { buildAboutHtml } from './buildHtml';

export default async (aboutData) => {
	console.log(`Building ${aboutData.title}`);
	console.log('  Building html...');
	await buildAboutHtml(aboutData);
	console.log(`  Done building ${aboutData.title}!`);
};