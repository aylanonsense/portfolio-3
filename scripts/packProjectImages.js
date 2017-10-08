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
			width: spriteSheetImageWidth * Math.min(1, projectData.grid.scale) + 6,
			height: spriteSheetImageHeight * Math.min(1, projectData.grid.scale) + 6,
			sourceX: Math.ceil((imageWidth - spriteSheetImageWidth) / 2),
			sourceY: Math.ceil((imageHeight - spriteSheetImageHeight) / 2),
			sourceWidth: spriteSheetImageWidth,
			sourceHeight: spriteSheetImageHeight
		};
	});
	let { width, height } = pack(bins, { inPlace: true });
	bins = bins.map(bin => {
		return {
			project: bin.project,
			targetX: bin.x + 3,
			targetY: bin.y + 3,
			targetWidth: bin.width - 6,
			targetHeight: bin.height - 6,
			sourceX: bin.sourceX,
			sourceY: bin.sourceY,
			sourceWidth: bin.sourceWidth,
			sourceHeight: bin.sourceHeight,
			fillX: bin.x,
			fillY: bin.y,
			fillWidth: bin.width,
			fillHeight: bin.height
		};
	});
	return { bins, width, height };
};