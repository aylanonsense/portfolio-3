import pack from 'bin-pack';

export default projects => {
	let bins = Object.entries(projects).map(([ project, projectData ]) => {
		return {
			project: project,
			width: projectData.image.raw.width + 2,
			height: projectData.image.raw.height + 2
		};
	});
	let { width, height } = pack(bins, { inPlace: true });
	bins = bins.map(bin => {
		return {
			project: bin.project,
			x: bin.x + 1,
			y: bin.y + 1,
			width: bin.width - 2,
			height: bin.height - 2
		};
	});
	return { bins, width, height };
};