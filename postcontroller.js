
var http = require('http')
	,fbapi = require('./facebook');
var rockonurl = 'localhost';
var rockonport = '49388';
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
			var socialInfo = JSON.parse(msg);
			console.log(msg);
			console.log("trying to get the token info");
			console.log(socialInfo.SocialNetworks[0].TokenKey);
			if (msg == "" || msg === null)
			{
				console.log("null returned");
				res.end("true");
			}
			else
			{
				fun(req, res, msg);
			}
			
		});
	});
	//rockonreq.write(dat);
	rockonreq.end();

}
 function GetPost(req, res) {
 	GetAccessToken(req, res,


		function (req, res, token) {
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
						res.end(JSON.stringify(body, null, '\t'));

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
					var callback = req.query.callback;
					if (callback)
						res.end(callback + "(" + msg + ")");
					else
						res.end(JSON.stringify(body, null, '\t'));

				});
			});
			rockonreq.write(postdata);
			rockonreq.end();
		});
 }
 function GetInitialPosts(req, res) {
     var fbfeeds = '', rockonfeeds = '';
     GetAccessToken(req, res,


		function (req, res, body) {
		    function feedGetComplete() {
		        console.log("********************************");
		        console.log("fbfeeds");
		        console.log(fbfeeds);
		        console.log("+++++++++++++++++++++++++++++++++");
		        console.log("rockonfeeds");
		        console.log(rockonfeeds);
		        var callback = req.query.callback;
		        if (callback)
		            res.end(callback + "(" + fbfeeds + ")");
		        else
		            res.end(JSON.stringify("{}", null, '\t'));
		    }
		    var finished = _.after(2, feedGetComplete);
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
		            'sid': sid,
		            'sessionid': sessionid

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
		            console.log('final expected message');
		            console.log(msg);
		            rockonfeeds = mgs;
		            feedGetComplete();

		        });
		    });

		    rockonreq.end();
		    fbapi.getHomeFeeds("CAADW6d739XkBAMwVFcCAGeebQ8xMQZBIrxFqSqCnmAfAAnVAkgZBYfH1oBQNIE5rmTEEQFHvI8lFhQ533TPFHoFf89oZB63IZAeN3DUaza8YV1FTOxgG36i4TPzC8F5x1zYPho7XBXmoATmfwCMhWxHEYbh96ZCHf7uGYCigaFmqJKOebYB2E", res, function (feeds) {
		        fbfeeds = feeds;
		        feedGetComplete();
		    });


		});
 }

exports.validate = validate;
exports.GetInitialPosts = GetInitialPosts;
exports.GetPostsOnScroll = GetPostsOnScroll;
exports.GetPost = GetPost;