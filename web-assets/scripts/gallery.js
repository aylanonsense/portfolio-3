window.addEventListener('load', function() {
	var project, id;

	// data
	var config = ({{{configJSON}}});
	var projects = ({{{projectsJSON}}})
	var animatedProjects = ({{{animatedProjectsJSON}}});

	// get elements
	var galleryEle = document.getElementById('gallery');
	var projectEles = {};
	for (project in projects) {
		id = projects[project][0];
		projectEles[id] = document.getElementById(id);
	}

	// resize grid to match viewport
	var currNumCols = config.defaultCols;
	function considerAdjustingGrid() {
		var width = document.documentElement.clientWidth;
		var numCols = Math.floor((width - config.cellGap) / (config.cellWidth + config.cellGap));
		numCols = Math.min(Math.max(config.minCols, config.colStep * Math.floor(numCols / config.colStep)), config.maxCols);
		if (currNumCols !== numCols) {
			currNumCols = numCols;
			adjustGrid(numCols);
		}
	}
	function adjustGrid(numCols) {
		console.log('adjusting grid to ' + numCols);
		var colIndex = Math.floor(2 * (numCols - config.minCols) / config.colStep);
		var rowIndex = colIndex + 1;
		for (var project in projects) {
			var id = projects[project][0];
			var coordinates = projects[project][1];
			var ele = projectEles[id];
			ele.style.gridColumnStart = coordinates[colIndex];
			ele.style.gridRowStart = coordinates[rowIndex];
		}
	}

	// // on window resize, reposition all grid images
	var resizeTimer = null;
	window.addEventListener("resize", function() {
		if (!resizeTimer) {
			resizeTimer = setTimeout(function() {
				resizeTimer = null;
				considerAdjustingGrid();
			}, 100);
		}
	}, false);

	// on pageload, load all animated images
	function loadAnimatedImage(projectData) {
		var id = projectData[0];
		var scale = projectData[1];
		var img = new Image();
		img.onload = function() {
			var width = img.width * scale;
			var height = img.height * scale;
			var projectImageEle = projectEles[id].getElementsByClassName('gallery-item-image')[0];
			projectImageEle.style.backgroundImage = "url('" + projectData[2] + "')";
			projectImageEle.style.width = width + 'px';
			projectImageEle.style.height = height + 'px';
			projectImageEle.style.backgroundPosition = 'center';
			projectImageEle.style.backgroundSize = width + 'px ' + height + 'px';
		};
		img.src = projectData[2];
	}
	for (project in animatedProjects) {
		loadAnimatedImage(animatedProjects[project]);
	}

	// consider adjusting the grid immediately on pageload
	considerAdjustingGrid();
}, false);