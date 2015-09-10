var https = require('https');
var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var content;
var id = 1;
var url = 'http://www.nian.so/thing.php?id=1';
var _ = require('underscore');
var page = 0;



if (url.split(':')[0] === 'https') {
	function httpsUrl() {
		https.get(url, function(res) {
			res.on('data', function(data) {
				content = data.toString();
				anysis(content)
			})
		});
	}
	httpsUrl();
} else {
	function httpUrl() {
		content = '';
		http.get(url, function(res) {
			res.on('data', function(data) {
				content+=data;
			});
			res.on('end',function(){
				anysis(content);
				//console.log('done');
			})
		});
		// return -1;

	// return;
	}
	httpUrl();

}

function anysis(content) {
	$ = cheerio.load(content);
	if ($('div.title').text() === '' && id >99999) {
		console.log(' spider work finished');
		return;
	} else {
		var outer = $('div.step');
		// console.log($('div.title').text());
		
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
			console.log(outer.text());
		}
	};
if($('div.step_more').text()){
	page=page+1;
	console.log(page);
	loadmore(id,page);
	console.log('loadmore')
}
else{
	console.log('none')
	page = 0;
				id+=1;


	url='http://www.nian.so/thing.php?id='+id;
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
	}, function(err,res,body) {
		anysis(body);
		})
	
}

