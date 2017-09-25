import pack from 'bin-pack';

export default projects => {
	let bins = Object.entries(projects).map(([ project, projectData ]) => {
		return {
			project: project,
			width: projectData.imageWidth,
			height: projectData.imageHeight
		};
	});
	let result = pack(bins, { inPlace: true });
	return[ result.width, result.height, bins ];
};