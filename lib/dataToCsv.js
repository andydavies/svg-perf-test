var path = require('path');
var fs = require('fs');

var data = JSON.parse(fs.readFileSync('_data.json'));
var meta = JSON.parse(fs.readFileSync('_meta.json'));

var res = {
	_: [],
	header: []
};

meta.metrics.forEach(function(metric) {
	res._.push.apply(res._, [metric, ' ', ' ', ' ']);
	res.header.push.apply(res.header, meta.types.concat([' ']));
});

meta.icons.forEach(function(icon) {
	res[icon] = [];
	meta.metrics.forEach(function(metric) {
		meta.types.forEach(function(type) {
			try {
				val = data[icon][type][metric]
				res[icon].push(val.reduce(function(a, b) {
					return a + b;
				}) / val.length);
			} catch (e) {
				res[icon].push('-');
			}
		});
		res[icon].push(' ');
	});
});

var csv = JSON.stringify(res).replace(/\]\,/g, '],\n');
fs.writeFileSync('_result.json', csv);

csv = csv.replace(/[\]\[\{\}\"]/g, ' ').replace(/\:/g, ',')
fs.writeFileSync('_result.csv', csv);