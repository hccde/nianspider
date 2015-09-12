var https = require('https');
var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var mailtest = require('./mailtest');
 var fs = require('fs');
var content;
var id = 1;
var url = 'http://www.nian.so/thing.php?id=1';
var _ = require('underscore');
var page = 0;
ws = fs.createWriteStream('nian.txt');
if (url.split(':')[0] === 'https') {
	function httpsUrl() {
		https.get(url, function(res) {
			res.on('data', function(data) {
				content += data;
			});
			res.on('end', function() {
				anysis(content);
			})
		});
	}
	httpsUrl();
} else {
	function httpUrl() {

		content = '';
		http.get(url, function(res) {
			res.on('data', function(data) {
				content += data;
			});
			res.on('end', function() {
				anysis(content);
			})
		});
	}
	httpUrl();

}

function anysis(content) {
	$ = cheerio.load(content);
	if ($('div.title').text() === '' && id > 600000) {
		mailtest.mail();
		console.log(' spider work finished');
		return;
	} else {
		var outer = $('div.step');
		if (outer.length) {
			for (var j in outer) {
				if (outer[j].children) {
					_.forEach(outer[j].children, function(e) {
						if (e && e.name == 'a' && e.attribs && e.attribs.class == 'img') {
							console.log(e.attribs.href);
						};
					})
				};

			};
			var text = outer.text();
			var inteset = outer.text()
			console.log(inteset);
			ws.write(inteset);
		}
	};
	if ($('div.step_more').text()) {
		page = page + 1;
		console.log(page);
		loadmore(id, page);
	} else {
		console.log('none')
		page = 0;
		id += 1;


		url = 'http://www.nian.so/thing.php?id=' + id;
		console.log(url);
		httpUrl();
	}

}


function loadmore(id, page) {
	// console.log('page;'+page);
	request.post('http://www.nian.so/more_step.php', {
		form: {
			"id": id,
			"page": page,
			"t": Math.random()
		}
	}, function(err, res, body) {
		anysis(body);
	})

}
