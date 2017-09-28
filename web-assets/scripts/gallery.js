window.addEventListener('load', () => {
	// data
	const config = ({{{configJSON}}});
	const gridHeights = ({{{gridHeightsJSON}}});
	const projects = ({{{projectsJSON}}})
	const animatedProjects = ({{{animatedProjectsJSON}}});

	// get elements
	let galleryEle = document.getElementById('gallery');
	let projectEles = {};
	for (let projectData of projects) {
		projectEles[projectData.id] = document.getElementById(projectData.id);
	}

	// resize grid to match viewport
	let currNumCols = config.defaultCols;
	function considerAdjustingGrid() {
		let width = document.documentElement.clientWidth;
		let numCols = Math.floor((width - config.cellGap) / (config.cellWidth + config.cellGap));
		numCols = Math.min(Math.max(config.minCols, config.colStep * Math.floor(numCols / config.colStep)), config.maxCols);
		if (currNumCols !== numCols) {
			currNumCols = numCols;
			adjustGrid(numCols);
		}
	}
	function adjustGrid(numCols) {
		let colIndex = Math.floor(2 * (numCols - config.minCols) / config.colStep);
		let rowIndex = colIndex + 1;
		for (let projectData of projects) {
			let ele = projectEles[projectData.id];
			ele.style.left = (projectData.coordinates[colIndex] * (config.cellWidth + config.cellGap)) + 'px';
			ele.style.top = (projectData.coordinates[rowIndex] * (config.cellHeight + config.cellGap)) + 'px';
		}
		galleryEle.style.width = (numCols * config.cellWidth + (numCols - 1) * config.cellGap) + 'px';
		galleryEle.style.height = gridHeights[Math.floor((numCols - config.minCols) / config.colStep)] + 'px';
	}

	// on window resize, reposition all grid images
	let resizeTimer = null;
	window.addEventListener("resize", () => {
		if (!resizeTimer) {
			resizeTimer = setTimeout(() => {
				resizeTimer = null;
				considerAdjustingGrid();
			}, 100);
		}
	}, false);

	// on pageload, load all animated images
	for (let projectData of animatedProjects) {
		let id = projectData.id;
		let scale = projectData.scale;
		let img = new Image();
		img.onload = () => {
			img.width *= scale;
			img.height *= scale;
			let projectImageEle = projectEles[id].getElementsByClassName('gallery-item-image');
			projectEles[id].removeChild(projectImageEle[0]);
			projectEles[id].appendChild(img);
		};
		img.src = projectData.imageUri
	}

	// consider adjusting the grid immediately on pageload
	considerAdjustingGrid();
}, false);