var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var rimraf = require('rimraf');
var glob = require('glob');
var ProgressBar = require('progress');
var browserPerf = require('browser-perf');
var static = require('node-static');

var generateFiles = require('./fileGenerator');

var icons = glob.sync(path.join(__dirname, '../ionicons/src/*.svg')).map(function(filename) {
	return path.basename(filename, '.svg');
});

var args = process.argv.slice(2);
icons = icons.slice(icons.indexOf(args[0]));

var types = glob.sync(path.join(__dirname, 'templates/*.html')).map(function(filename) {
	return path.basename(filename, '.html');
});

var binDir = path.join(__dirname, '../bin');

// Step 1. Generate Files
//rimraf.sync(binDir);
//fs.mkdirSync(binDir);
//generateFiles(icons, types, binDir);

// Step 2. Start Web Server
var server = require('http').createServer(function(request, response) {
	request.addListener('end', function() {
		new static.Server(binDir).serve(request, response);
	}).resume();
}).listen(8080);

var bar = new ProgressBar('Running Tests: [:bar] :percent Elapsed-:elapsed, ETA-:eta', {
	total: types.length * icons.length,
	width: 30
});

// Step 3. Start tests
(function runTest(i, j) {
	bar.tick();
	if (j < types.length) {
		if (i < icons.length) {
			var url = ['http://192.168.0.104:8080/', types[j], '/', icons[i], '.html'].join('');
			browserPerf(url, function(err, res) {
				if (!err) {
					saveResults(icons[i], types[j], res[0]);
				} else {
					console.log(err);
				}
				runTest(i, j + 1);
			}, {
				browsers: [{
					browserName: 'android'
				}],
				selenium: 'http://localhost:9515',
				debugBrowser: false
			});
		} else {
			server.close();
			console.log('All tests completed');
		}
	} else {
		runTest(i + 1, 0);
	}
}(0, 0));

function saveResults(icon, type, res) {
	var data = {};
	try {
		data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
	} catch (e) {}
	if (typeof data[icon] === 'undefined') {
		data[icon] = {};
	}
	if (typeof data[icon][type] === 'undefined') {
		data[icon][type] = {};
	}

	for (var metric in res) {
		if (typeof data[icon][type][metric] === 'undefined') {
			data[icon][type][metric] = [];
		}
		data[icon][type][metric].push(res[metric]);
	}
	fs.writeFileSync('data.json', JSON.stringify(data));
}