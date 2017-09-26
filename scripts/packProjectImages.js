import pack from 'bin-pack';

export default projects => {
	let bins = Object.entries(projects).map(([ project, projectData ]) => {
		let imageWidth = projectData.image.raw.width;
		let imageHeight = projectData.image.raw.height;
		let gridWidth = Math.ceil(projectData.grid.width / projectData.grid.scale);
		let gridHeight = Math.ceil(projectData.grid.height / projectData.grid.scale);
		let spriteSheetImageWidth = Math.min(imageWidth, gridWidth);
		let spriteSheetImageHeight = Math.min(imageHeight, gridHeight);
		return {
			project: project,
			width: spriteSheetImageWidth + 2,
			height: spriteSheetImageHeight + 2,
			offsetX: Math.ceil((imageWidth - spriteSheetImageWidth) / 2),
			offsetY: Math.ceil((imageHeight - spriteSheetImageHeight) / 2)
		};
	});
	let { width, height } = pack(bins, { inPlace: true });
	bins = bins.map(bin => {
		return {
			project: bin.project,
			x: bin.x + 1,
			y: bin.y + 1,
			width: bin.width - 2,
			height: bin.height - 2,
			offsetX: bin.offsetX,
			offsetY: bin.offsetY
		};
	});
	return { bins, width, height };
};