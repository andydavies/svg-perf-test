var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var ProgressBar = require('progress');

module.exports = function(icons, types,binDir) {
	var templates = {};

	var copyFile = function(filename) {
		fs.createReadStream(path.join(__dirname, '../ionicons/', filename))
			.pipe(fs.createWriteStream(path.join(binDir, filename)));
	};

	types.forEach(function(type) {
		fs.mkdirSync(path.join(binDir, type));
		var data = fs.readFileSync(path.join(__dirname, 'templates', type + '.html'), 'utf-8');
		templates[type] = _.template(data.replace(/<!-- -->/g, ''));
	});

	var bar = new ProgressBar('Generating files: [:bar] :percent ', {
		total: types.length * icons.length,
		width: 30
	});


	icons.forEach(function(icon) {
		var data = fs.readFileSync(path.join(__dirname, '../ionicons/src/', icon + '.svg'), 'utf-8');
		types.forEach(function(type) {
			var content = templates[type]({
				data: data,
				name: icon,
				repeat: 200,
			});
			fs.writeFileSync(path.join(binDir, type, icon + '.html'), content);
			bar.tick();
		});
	});

	fs.mkdirSync(path.join(binDir, 'css'));
	fs.mkdirSync(path.join(binDir, 'fonts'));

	[
		'css/ionicons.min.css',
		'fonts/ionicons.ttf',
		'fonts/ionicons.woff',
		'fonts/ionicons.eot',
		'fonts/ionicons.svg'
	].forEach(copyFile);
}