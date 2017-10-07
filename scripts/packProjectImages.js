import pack from 'bin-pack';

export default projects => {
	let bins = Object.entries(projects).map(([ project, projectData ]) => {
		return {
			project,
			width: projectData.image.rescaled.width + 6,
			height: projectData.image.rescaled.height + 6
		};
	});
	let { width, height } = pack(bins, { inPlace: true });
	bins = bins.map(bin => {
		return {
			project: bin.project,
			x: bin.x + 3,
			y: bin.y + 3,
			width: bin.width - 6,
			height: bin.height - 6,
			fillX: bin.x,
			fillY: bin.y,
			fillWidth: bin.width,
			fillHeight: bin.height
		};
	});
	return { bins, width, height };
};