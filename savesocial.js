
var http = require('http');
 var dat = JSON.stringify({
    	'userid': '2', 'username': 'sdjsd', 'networkname': 'networkname', 'tokenkey': 'tokenkey', 'url': 'url', 'expiresIn': 'expiresIn'
    });
	
var options = {
  host: 'localhost',
  port: '26742',
		path: '/Home.aspx/GetProfilePicture',
 // data: dat,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'dataType': "json"
  //  'Content-Length': dat.length
  }
};

 
function savesocial() {
    console.log('validate being called');
    var dat = JSON.stringify({
    	'userid': '2', 'username': 'sdjsd', 'networkname': 'networkname', 'tokenkey': 'tokenkey', 'url': 'url', 'expiresIn': 'expiresIn'
    });
	console.log('inside social save');
    var rockonreq = http.request(options, function (rockonres) {
        var msg = '';
        rockonres.setEncoding('utf8');
        rockonres.on('data', function (chunk) {
            msg += chunk;
        });

        rockonres.on('error', function (err) {
            console.log(err);
        });
        rockonres.on('end', function () {
            console.log(msg);
            //  alert('f');
            //res.end('true');
        });
    });
    //rockonreq.write(dat);
    rockonreq.end();
}
exports.savesocial = savesocial;