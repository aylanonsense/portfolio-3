import addBlogMetadata from './addBlogMetadata';
import { buildBlogPostHtml } from './buildHtml';

export default async (blogData, posts) => {
	console.log(`Building ${blogData.title}`);
	console.log('  Adding post metadata...');
	await addBlogMetadata(blogData, posts);
	console.log('  Building blog html...');
	for (let [ post, postData ] of Object.entries(posts)) {
		await buildBlogPostHtml(blogData, postData);
	}
};