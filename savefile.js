var Readable = require('stream').Readable;
var fs = require('fs');
var rs = new Readable;
rs.push('bep ');
rs.push('boop\n');
rs.push(null);
var fsstream = fs.createWriteStream('nianspider.txt');
rs.pipe(fsstream);//http://my.oschina.net/sundq/blog/192276#OSC_h3_6