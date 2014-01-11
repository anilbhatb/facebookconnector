
var http = require('http')
	, fbapi = require('./facebook');
var rockonurl = 'localhost';
var rockonport = '57652';
var fb_access_token;
var fb_expires;

 
function GetAccessToken(req, res, fun)
{
	console.log('getaccess token being called');
	var sid = req.query.sid == undefined ? req.body.sid : req.query.sid;
	var sessionid = req.query.sessionid == undefined ? req.body.sessionid:req.query.sessionid;
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
	    var socialInfo = '';
	    rockonres.setEncoding('utf8');
	    rockonres.on('data', function (chunk) {
	        socialInfo += chunk;
	    });

	    rockonres.on('error', function (err) {
	        console.log(err);
	    });
	    rockonres.on('end', function () {
	        console.log("access token data received ");
	        if (socialInfo == "" || socialInfo == null) {
	            console.log("null returned");
	            fun(req, res);
	        }
	        else {
	            socialInfo = JSON.parse(socialInfo);
	            if (socialInfo.SocialNetworks) {
	            	console.log('socialInfo.access_token' + socialInfo.SocialNetworks[0].TokenKey);
	            	fb_access_token = socialInfo.SocialNetworks[0].TokenKey;
	            	fb_expires = socialInfo.expires;
	            	exports.fb_access_token = fb_access_token;
	            	exports.fb_expires = fb_expires;
	            }
	            else {
	            	console.log('no social network info found for sid: '+ sid+ 'sessionid: '+sessoinid );
	            }
                 fun(req, res);
	        }

	    });
	});
	//rockonreq.write(dat);
	rockonreq.end();

}
 function GetPost(req, res) {
 	GetAccessToken(req, res,
		function (req, res) {
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
 	var fbfeeds = '', rockonfeeds = '';
 	GetAccessToken(req, res,
		function (req, res) {
			var sid = req.query.sid;
			var sessionid = req.query.sessionid;
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
				var strFeed = '';
				rockonres.setEncoding('utf8');
				rockonres.on('data', function (chunk) {
					strFeed += chunk;
				});

				rockonres.on('error', function (err) {
					console.log(err);
				});
				rockonres.on('end', function () {
					 rockonfeeds = convertrockonfeeds(strfeeds);
					feedGetComplete(fbfeeds, rockonfeeds, req, res);
				});
			});
			rockonreq.write(postdata);
			rockonreq.end();
			if (fb_access_token) {
				console.log('GetHome feeds called');
				fbapi.getHomeFeeds(fb_access_token, res, function (feeds) {
					fbfeeds = feeds;
					feedGetComplete(fbfeeds, rockonfeeds, req, res);
				}, date);
			}
		});
 }
 function feedGetComplete(fbfeeds,rockonfeeds,req, res) {
 	if ((fb_access_token && fbfeeds == '') || rockonfeeds == '')
 		return;
 	var clubbedfeed = [];
 	var pos = 0, rindex = 0, findex = 0, maxfeeds = 9;
 	var rockonposts = rockonfeeds.posts == undefined ? [] : rockonfeeds.posts;
 	var facebookposts = fbfeeds.posts == undefined ? [] : fbfeeds.posts;

 	for (pos = 0; pos < facebookposts.length + rockonposts.length; pos++) {
 		if (clubbedfeed.length >= maxfeeds)
 			break;
 		if (rindex < rockonposts.length && findex < facebookposts.length) {
 			if (new Date(rockonposts[rindex][9]) > new Date(facebookposts[findex][9])) {
 				//if (rockonposts[rindex][9] > rockonposts[rindex][9][findex][9]) {
 			//	console.log('adding' + rockonposts[rindex]);
 				clubbedfeed.push(rockonposts[rindex++]);
 			}
 			else {
 				//console.log('adding fb' + facebookposts[findex]);
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

 	//  console.log(groupfeed.posts);
 	var callback = req.query.callback;
 	if (callback)
 		res.end(callback + "(" + JSON.stringify(groupfeed) + ")");
 	else
 		res.end(JSON.stringify("{}", null, '\t'));
 }
 function convertrockonfeeds(msg){
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
 	output.push("Rockon");
 	rockonfeedArray.push(output);

 });
 return  { posts: rockonfeedArray };
}
 function GetInitialPosts(req, res) {
     var fbfeeds = '', rockonfeeds = '';
     GetAccessToken(req, res,
		function (req, res) {

			
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
		            rockonfeeds=  convertrockonfeeds(msg);
		            feedGetComplete(fbfeeds, rockonfeeds, req, res);

		        });
		    });

		    rockonreq.end();
		    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAA' + fb_access_token);
		    if (fb_access_token) {
		    	console.log('GetHome feeds called');
		    	fbapi.getHomeFeeds(fb_access_token, res, function (feeds) {
		    		fbfeeds = feeds;
		    		feedGetComplete(fbfeeds,rockonfeeds,req,res);
		    	});
		    }


		});
 }

 exports.GetAccessToken = GetAccessToken;
exports.GetInitialPosts = GetInitialPosts;
exports.GetPostsOnScroll = GetPostsOnScroll;
exports.GetPost = GetPost;