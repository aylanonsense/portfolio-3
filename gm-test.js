var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});

// resize and remove EXIF profile data
gm('images/pixels/nightmare.gif[0]')
	.write('build/nightmare-test.png', function (err) {
		if (!err) console.log('done');
	});
