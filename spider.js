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
			res.on('error', function() {
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
			res.on('error', function() {
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
							var filename = e.attribs.href.split('/').pop();
							//下载图片
							var options = {
  								url: 'http://img.nian.so/step/'+filename,
  								headers: {
    								'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
									'Accept-Encoding':'gzip, deflate, sdch',
									'Accept-Language':'zh-CN,zh;q=0.8',
									'Connection':'keep-alive',
									'Cookie':'__utma=6360749.383970808.1471687231.1474983462.1475079018.15; __utmb=6360749.7.10.1475079018; __utmc=6360749; __utmz=6360749.1475079018.15.15.utmcsr=baidu|utmccn=(organic)|utmcmd=organic',
									'Host':'img.nian.so',
									'Upgrade-Insecure-Requests':1,
									'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2824.2 Safari/537.36'
  								}
							};
							request(options).on('error', function(err) {
    								console.log(err)
  							}).pipe(fs.createWriteStream('./img'+filename+'.png'));

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
	setTimeout(function(){
	request.post('http://www.nian.so/more_step.php', {
		form: {
			"id": id,
			"page": page,
			"t": Math.random()
		}
	}, function(err, res, body) {
		anysis(body);
	})}, Math.random()*10*200);

}
