import loadFile from './helper/loadFile';

export default async (blogData, posts) => {
	for (let [ post, postData ] of Object.entries(posts)) {
		// add basic metadata
		postData.post = post;
		// load post files
		postData.html = {};
		postData.html.path = `posts/${post}/post.html`;
		postData.html.content = await loadFile(postData.html.path);
	}
};