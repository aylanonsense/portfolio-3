window.addEventListener('load', () => {
	const animatedProjects = {{{animatedProjects}}};

	// on pageload, load all animated images
	for (let projectData of animatedProjects) {
		let id = projectData.id;
		let scale = projectData.scale;
		let projectEle = document.getElementById(id);
		let projectImageEle = projectEle.getElementsByClassName('gallery-item-image');
		let img = new Image();
		img.onload = () => {
			console.log('before', img.width, img.height);
			img.width *= scale;
			img.height *= scale;
			console.log('after', img.width, img.height);
			projectEle.removeChild(projectImageEle[0]);
			projectEle.appendChild(img);
		};
		img.src = projectData.imageUri
	}

	// on window resize, reshuffle all grid images
	// todo
});