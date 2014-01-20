var http = require('http')
        , fbapi = require('./facebook')
    , utils = require('util')
	, moment = require('moment')
        , winston = require('winston');
var fb_expires;
var logger = new (winston.Logger)({
	transports: [

      new (winston.transports.File)({ filename: 'connectorpost.log' })
	]
});
logger.log('info', 'logger for post controller working');
//winston.add(winston.transports.File, { filename: 'connectorpost.log' });
////winston.remove(winston.transports.Console);
//winston.log('info', 'winston logging started for post controller');

function GetAccessToken(req, res, fun) {
	var sid = req.query.sid == undefined ? req.body.sid : req.query.sid;
	var sessionid = req.query.sessionid == undefined ? req.body.sessionid : req.query.sessionid;
	logger.log("info", "GetAccessToken sid:" + sid + "sessionid:" + sessionid);

	var options = {
		host: ROCKON_URL,
		port: ROCKON_PORT,
		path: '/SocialNetwork/GetAccessToken',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'dataType': "json",
			'rockonconnector': "secretRockonCode",
			'sid': sid,
			'sessionid': sessionid
			//        'Content-Length': postdata.length
		}
	};
	var rockonreq = http.request(options, function (rockonres) {
		var fb_access_token;
		var socialInfo = '';
		rockonres.setEncoding('utf8');
		rockonres.on('data', function (chunk) {
			socialInfo += chunk;
		});

		rockonres.on('error', function (err) {
			logger.log("error", err);
		});
		rockonres.on('end', function () {
			if (socialInfo == "" || socialInfo == null) {
				logger.log("error", "null returned sid:" + sid);
				fun(req, res);
			}
			else {
				socialInfo = JSON.parse(socialInfo);
				if (socialInfo.SocialNetworks) {
					logger.log("info", 'socialInfo.access_token' + socialInfo.SocialNetworks[0].TokenKey);
					fb_access_token = socialInfo.SocialNetworks[0].TokenKey;
				}
				else {
					logger.log("info", 'no social network info found for sid: ' + sid + 'sessionid: ' + sessoinid);
				}
				fun(req, res, fb_access_token);
			}
		});
	});
	//rockonreq.write(dat);
	rockonreq.end();
}
function SaveSocialNetworkInfo(req, res, userid, userName, networkName, tokenkey, url, expiresIn, fun) {
	var sid = req.query.sid == undefined ? req.body.sid : req.query.sid;
	var sessionid = req.query.sessionid == undefined ? req.body.sessionid : req.query.sessionid;
	if (sid == undefined) { sid = req.params.sid; sessionid = req.params.session; }
	logger.log("info", "call to save social network info" + sid + "sessionid:" + sessionid);
	var postdata = JSON.stringify({
		"userid": userid
		, "username": userName
		, "networkname": networkName
		, "tokenkey": tokenkey
		, "url": url
		, "expiresIn": expiresIn
	});
	var options = {
		host: ROCKON_URL,
		port: ROCKON_PORT,
		path: '/SocialNetwork/SaveSocialNetworkInfo',
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
		var fb_access_token;
		var socialInfo = '';
		rockonres.setEncoding('utf8');
		rockonres.on('data', function (chunk) {
			socialInfo += chunk;
		});

		rockonres.on('error', function (err) {
			logger.log("error", err);
			fun();
		});
		rockonres.on('end', function () {
			if (socialInfo == "" || socialInfo == null) {
				logger.log("error", "could not save socialNetwork info: " + postdata);
				fun();
			}
			else
				fun();
		});
	});
	rockonreq.write(postdata);
	rockonreq.end();
}
function GetPost(req, res) {
	GetAccessToken(req, res,
		   function (req, res, fb_access_token) {
		   	var sid = req.query.sid;
		   	var sessionid = req.query.sessionid;

		   	logger.log("info", 'GetPost being called');
		   	var postdata = JSON.stringify({
		   		'soid': req.body.soid, 'replySoid': req.body.replySoid, 'areRepliesExposed': req.body.areRepliesExposed, 'onNotification': req.body.onNotification, 'replyCountBeforeNotification': req.body.replyCountBeforeNotification
		   	});
		   	var options = {
		   		host: ROCKON_URL,
		   		port: ROCKON_PORT,

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
		   			logger.log("error", err);
		   		});
		   		rockonres.on('end', function () {
		   			//  alert('f');
		   			var callback = req.query.callback;
		   			if (callback)
		   				res.end(callback + "(" + JSON.stringify(body, null, '\t') + ")");
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
		   function (req, res, fb_access_token) {
		   	var sid = req.query.sid;
		   	var maxdate = req.query.date;
		   	var sessionid = req.query.sessionid;
		   	var postdata = JSON.stringify({
		   		'soid': req.query.soid, 'date': req.query.date
		   	});
		   	var options = {
		   		host: ROCKON_URL,
		   		port: ROCKON_PORT,
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
		   			logger.log("error", err);
		   			rockonfeeds = { posts: [] };
		   		});
		   		rockonres.on('end', function () {
		   			rockonfeeds = convertrockonfeeds(strFeed);
		   			feedGetComplete(fbfeeds, rockonfeeds, req, res, fb_access_token);
		   		});
		   	});
		   	rockonreq.write(postdata);
		   	rockonreq.end();
		   	if (fb_access_token) {
		   		logger.log("info", 'GetHome feeds called:' + fb_access_token);
		   		fbapi.getHomeFeeds(fb_access_token, res, function (feeds) {
		   			fbfeeds = feeds;
		   			feedGetComplete(fbfeeds, rockonfeeds, req, res, fb_access_token);
		   		}, maxdate);
		   	}
		   });
}
function feedGetComplete(fbfeeds, rockonfeeds, req, res, fb_access_token) {
	var groupfeed;
	try {
		if ((fb_access_token && fbfeeds == '') || rockonfeeds == '')
			return;
		var clubbedfeed = [];

		//		logger.log("info","FB FEEDS FOR SORT FB FEEDS FOR SORTFB FEEDS FOR SORTFB FEEDS FOR SORTFB FEEDS FOR SORTFB FEEDS FOR SORT");
		//		logger.log("info", fbfeeds.posts);
		//		logger.log("info", "ROCKON FEEEDS FOR SORT ROCKON FEEEDS FOR SORT ROCKON FEEEDS FOR SORT ROCKON FEEEDS FOR SORT ROCKON FEEEDS FOR SORT ");
		//		logger.log("info", rockonfeeds.posts);

		var pos = 0, rindex = 0, findex = 0, maxfeeds = 9;
		var rockonposts = rockonfeeds.posts == undefined ? [] : rockonfeeds.posts;
		var facebookposts = fbfeeds.posts == undefined ? [] : fbfeeds.posts;
		for (pos = 0; pos < facebookposts.length + rockonposts.length; pos++) {
			if (clubbedfeed.length >= maxfeeds)
				break;
			if (rindex < rockonposts.length && findex < facebookposts.length) {
				//console.log(moment('2014-01-17T15:44:48+0000', 'YYYY-MM-DDTHH:mm');
				if (moment(rockonposts[rindex][9] + ' GMT') > moment(facebookposts[findex][9])) {
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
					clubbedfeed.push(facebookposts[findex++]);
				}
				break;
			}
			else {
				break;
			}
		}
		groupfeed = {
			posts: clubbedfeed
		};
	}
	catch (e) {
		logger.log("error", "error in feedGetComplete" + e);
		groupfeed = { posts: [] };
	}
	//	logger.log("info", "CLUBBED FEEDS AFTER SORT CLUBBED FEEDS AFTER SORT CLUBBED FEEDS AFTER SORT CLUBBED FEEDS AFTER SORT CLUBBED FEEDS AFTER SORT CLUBBED FEEDS AFTER SORT ");
	//	logger.log("info", groupfeed.posts);
	var callback = req.query.callback;
	if (callback)
		res.end(callback + "(" + JSON.stringify(groupfeed) + ")");
	else
		res.end(JSON.stringify(groupfeed, null, '\t'));
}
function convertrockonfeeds(msg) {
	try {
		var rcfeeds = JSON.parse(msg);
		var rockonfeedArray = [];
		if (!utils.isArray(rcfeeds)) {
			return { posts: [] };
		}
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
		return { posts: rockonfeedArray };
	}
	catch (e) {
		logger.log("error", "error in getconvertedrockonfeeds: " + e);
		return { posts: [] };
	}
}
function GetInitialPosts(req, res) {
	var fbfeeds = '', rockonfeeds = '';

	GetAccessToken(req, res,
			   function (req, res, fb_access_token) {
			   	var sid = req.query.sid;
			   	var sessionid = req.query.sessionid;
			   	var options = {
			   		host: ROCKON_URL,
			   		port: ROCKON_PORT,
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
			   			logger.log("error", err);
			   			rockonfeeds = { posts: [] };
			   		});

			   		rockonres.on('end', function () {
			   			rockonfeeds = convertrockonfeeds(msg);
			   			feedGetComplete(fbfeeds, rockonfeeds, req, res, fb_access_token);
			   		});
			   	});

			   	rockonreq.end();
			   	if (fb_access_token) {
			   		logger.log("info", 'GetHome feeds called');
			   		fbapi.getHomeFeeds(fb_access_token, res, function (feeds) {
			   			fbfeeds = feeds;
			   			feedGetComplete(fbfeeds, rockonfeeds, req, res, fb_access_token);
			   		});
			   	}
			   });
}

exports.GetAccessToken = GetAccessToken;
exports.GetInitialPosts = GetInitialPosts;
exports.GetPostsOnScroll = GetPostsOnScroll;
exports.GetPost = GetPost;
exports.SaveSocialNetworkInfo = SaveSocialNetworkInfo;