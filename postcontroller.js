
var http = require('http')
	, fbapi = require('./facebook');
	//_ = require('lodash_node');
var rockonurl = 'localhost';
var rockonport = '43118';
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
			//var socialInfo = JSON.parse(msg);
			console.log(msg);
			console.log("trying to get the token info");
		//	console.log(socialInfo.SocialNetworks[0].TokenKey);
			//if (msg == "" || msg === null)
			//{
			//	console.log("null returned");
			//	res.end("true");
			//}
			//else
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
		        if (fbfeeds == '' || rockonfeeds == '')
		            return;
		        // var rockonfeed = JSON.parse(rockonfeeds);
		        var clubbedfeed = [];
		        var pos = 0, rindex = 0, findex = 0, maxfeeds = 9;
		        var rockonposts = rockonfeeds.posts;
		        var facebookposts = fbfeeds.posts;
		       // console.log('rockon feeds');
		       // console.log(rockonfeeds.posts);
		        console.log('facebook feeds');
		       // console.log(fbfeeds.posts);
		        for (pos = 0; pos < facebookposts.length + rockonposts.length; pos++) {
		            if (clubbedfeed.length >= maxfeeds)
		                break;
		            if (rindex < rockonposts.length && findex < facebookposts.length) {
		                if (rockonposts[rindex][9] > facebookposts[findex][9]) {
		                    clubbedfeed.push(rockonposts[rindex++]);
		                }
		                else {
		                    clubbedfeed.push(facebookposts[findex++]);
		                }
		            }
		            else if (rindex < rockonposts.length) {
		                while (clubbedfeed.length < maxfeeds && rindex < rockonposts.length) {
		                    clubbedfeed.push(rockonposts[rindex++]);
		                }
		                break;
		            }
		            else if (findex < facebookposts.length) {
		                while (clubbedfeed.length < maxfeeds && rindex < facebookposts.length) {
		                    clubbedfeed.push(facebookposts[rindex++]);
		                }
		                break;
		            }
		            else {
		                break;
		            }
		        }

		        console.log("*******++++++++++++++++++**************");
		        var groupfeed = {
		        	posts: clubbedfeed
		        	
		        };

		        console.log(groupfeed.posts);
		        var callback = req.query.callback;
		        if (callback)
		            res.end(callback + "(" + JSON.stringify(groupfeed) + ")");
		        else
		            res.end(JSON.stringify("{}", null, '\t'));
		    }
		    //var finished = _.after(2, feedGetComplete);
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
		            console.log(msg);
		            var rcfeeds = JSON.parse(msg);
		            var rockonfeedArray = [];
		            rcfeeds.forEach(function (p) {
		                var output = [];
		                output.push(p.Soid);
		                output.push(p.MemberSoid);
		                output.push(p.PictureRef);
		                output.push(p.Fullname);
		                output.push(p.Recency);
		                output.push(p.Body);
		                output.push(p.LikeCount);
		                output.push(p.SelfLike); //Whether post liked by the current member
		                output.push(p.ReplyCount);
		                output.push(p.LastModified);
		                output.push("rockon");
		                rockonfeedArray.push(output);

		            });
		            rockonfeeds = { posts: rockonfeedArray };
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