window.addEventListener('load', function() {
	// find the canvas
	var canvas = document.getElementById('pico8-canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// create the Module
	var Module = {};
	Module.canvas = canvas;

	// run the PICO-8 code
	{{{code.content}}}

	// prevent keypresses from scrolling through the page
	function onKeyDown_blocker(event) {
		event = event || window.event;
		var o = document.activeElement;
		if (!o || o == document.body || o.tagName === 'canvas') {
			if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
				if (event.preventDefault) {
					event.preventDefault();
				}
			}
		}
	}
	document.addEventListener('keydown', onKeyDown_blocker, false);

	// bind user controls
	var isPaused = false;
	var isMuted = false;
	var resetButton = document.getElementById('control-reset');
	var pauseButton = document.getElementById('control-pause');
	var fullscreenButton = document.getElementById('control-fullscreen');
	var soundButton = document.getElementById('control-sound');
	resetButton.addEventListener('click', function() {
		Module.pico8Reset();
	});
	pauseButton.addEventListener('click', function() {
		Module.pico8TogglePaused()
		isPaused = !isPaused;
		pauseButton.textContent = (isPaused ? 'Unpause' : 'Pause');
	});
	fullscreenButton.addEventListener('click', function() {
		Module.requestFullScreen(true, false);
	});
	soundButton.addEventListener('click', function() {
		Module.pico8ToggleSound();
		isMuted = !isMuted;
		soundButton.textContent = (isMuted ? 'Unmute' : 'Mute');
	});
});