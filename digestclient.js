
var http = require('http');
var dd = '{"id": "2","token": "sdsd"}';
var options = {
  host: 'localhost',
  port: '8180',
  path: '/digestauth',

//  data: '{"id": "2","token": "sdsd"}',
  method: 'POST',
  auth: {
    user: 'john',
    pass: 'pass',
    sendImmediately: false
  },
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'dataType': "json"
  //  'Content-Length': dd.length
  }
};

 
function digestclient(req, res) {
    console.log('validate being called');
    var dat = JSON.stringify({
        'id': '2', 'token': 'sdjsd'
    });
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
            res.end('true');
        });
    });
    rockonreq.write(dd);
    rockonreq.end();
}
exports.digestclient = digestclient;