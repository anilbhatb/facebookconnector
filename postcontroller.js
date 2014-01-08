
var http = require('http');
var rockonurl = 'localhost';
var rockonport = '52391';
var fb_access_token;
var fb_expires;

 
function validate(req, res) {

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
    //rockonreq.write(dd);
    rockonreq.end();
}

function GetAccessToken(req, res, fun)
{
	console.log('getaccess token being called');
	var sid = req.query.sid;
	var sessionid = req.query.sessionid;
	//var postdata = JSON.stringify({
	//	'soid': req.body.soid, 'replySoid': req.body.replySoid, 'areRepliesExposed': req.body.areRepliesExposed, 'onNotification': req.body.onNotification, 'replyCountBeforeNotification': req.body.replyCountBeforeNotification
	//});
	console.log(sid + "sessionid:" + sessionid);
	//var rc = "sid=" +sid + "," +"sessionid="+ sessionid;
	var rc = '';
	//rc && rc.split(";").forEach(function(cookie) {
	//	var parts = cookie.split('=');
	//	list[parts.shift().trim()] = unescape(parts.join('='));
	//});

	console.log("cookies: "+rc);
	var options = {
		host: rockonurl,
		port: rockonport,
		path: '/SocialNetwork/GetAccessToken',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'dataType': "json",
			'rockonconnector': "secretRockonCode",
			'sid': sid,
			'sessionid': sessionid
		//	'Content-Length': postdata.length
		}
	};
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
			console.log("access token data received ");
			//fb_access_token = results.access_token;
			//fb_expires = results.expires;
			//exports.fb_access_token = access_token;
			//exports.fb_expires = expires;

			console.log(msg);
			if (msg == "" || msg === null)
			{
				console.log("null returned");
				res.end("true");
			}
			else
			{
				fun(req, res, msg);
			}//  alert('f');
			
		});
	});
	//rockonreq.write(dat);
	rockonreq.end();

}
 function GetPost(req, res) {
 	GetAccessToken(req, res,


		function (req, res, body) {
			var sid = req.query.sid;
			var sessionid = req.query.sessionid;
	
			console.log('GetPost being called');
			var postdata = JSON.stringify({
				'soid': req.body.soid, 'replySoid': req.body.replySoid, 'areRepliesExposed': req.body.areRepliesExposed, 'onNotification': req.body.onNotification, 'replyCountBeforeNotification': req.body.replyCountBeforeNotification
			});
			var options = {
				host: rockonurl,
				port: rockonport,
				path: '/Post/GetPost',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'dataType': "json",
					'rockonconnector': "secretRockonCode",
					'sid': sid,
					'sessionid': sessionid,
					'membersoid': req.headers.membersoid,
					'Content-Length': postdata.length
				}
			};
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
					var callback = req.query.callback;
					if (callback)
						res.end(callback + "(" + msg+ ")");
					else
						response.end(JSON.stringify(body, null, '\t'));

					//res.end('true');
				});
			});
			rockonreq.write(postdata);
			rockonreq.end();
		});
}
 function GetPostsOnScroll(req, res) {
 	GetAccessToken(req, res,


		function (req, res, body) {
			var sid = req.query.sid;
			var sessionid = req.query.sessionid;
			console.log('validate being called');

			var postdata = JSON.stringify({
				'soid': req.body.soid, 'date': req.body.date
			});
			var options = {
				host: rockonurl,
				port: rockonport,
				path: '/Post/GetPostsOnScroll',
				//data: '{"id": "2","token": "sdsd"}',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'dataType': "json",
					'rockonconnector': "secretRockonCode",
					'sid': sid,
					'sessionid': sessionid,
					'Content-Length': postdata.length
				}
			};
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
			rockonreq.write(postdata);
			rockonreq.end();
		});
 }
 function GetInitialPosts(req, res) {
 	GetAccessToken(req, res,


		function (req, res, body) {
			var sid = req.query.sid;
			var sessionid = req.query.sessionid;
			//console.log('validate being called');
			var options = {
				host: rockonurl,
				port: rockonport,
				path: '/Post/GetInitialPosts',
				//data: '{"id": "2","token": "sdsd"}',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'dataType': "json",
					'rockonconnector': "secretRockonCode",

				}
			};
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
					res.end('true');
				});
			});

			rockonreq.end();
		});
 }

exports.validate = validate;
exports.GetInitialPosts = GetInitialPosts;
exports.GetPostsOnScroll = GetPostsOnScroll;
exports.GetPost = GetPost;