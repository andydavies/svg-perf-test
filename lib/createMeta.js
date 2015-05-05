var fs = require('fs');
var path = require('path');

var data = JSON.parse(fs.readFileSync('_data.json'));

var metrics = {},
	types = {},
	icons = {};

for (var icon in data) {
	icons[icon] = true;
	for (var type in data[icon]) {
		types[type] = true
		for (var metric in data[icon][type]) {
			metrics[metric] = true;
		}
	}
}

fs.writeFileSync('_meta.json', JSON.stringify({
	metrics: Object.keys(metrics),
	types: Object.keys(types),
	icons: Object.keys(icons),
}).replace(/\,/g, ',\n'));