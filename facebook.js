var request = require('request');

function postMessage(access_token, message, response) {
	// Specify the URL and query string parameters needed for the request
	var url = 'https://graph.facebook.com/me/feed';
	var params = {
		access_token: access_token,
		message: message
	};

	// Send the request
	request.post({ url: url, qs: params }, function (err, resp, body) {
		// Handle any errors that occur
		if (err) return console.error("Error occured: ", err);
		body = JSON.parse(body);
		if (body.error) return console.error("Error returned from facebook: ", body.error);

		// Generate output
		var output = '<p>Message has been posted to your feed. Here is the id generated:</p>';
		output += '<pre>' + JSON.stringify(body, null, '\t') + '</pre>';

		// Send output as the response
		response.writeHeader(200, { 'Content-Type': 'text/html' });
		response.end(output);
	});
}
function getProfile(tokeninfo, response, callback) {
	// Specify the URL and query string parameters needed for the request
	var url = 'https://graph.facebook.com/me';
	var params = {
		access_token: tokeninfo.access_token,
		fields: 'id,name,last_name,link,username,hometown,work,gender,languages,interests,education,email'
	};
	console.log('into get profile');
	// Send the request
	request.get({ url: url, qs: params }, function (err, resp, body) {
		// Handle any errors that occur
		if (err) return console.error("Error occured: ", err);
		body = JSON.parse(body);
		body.access_token = tokeninfo.access_token;
		body.expires = tokeninfo.expires;
		if (body.error) return console.error("Error returned from facebook: ", body.error);

		response.writeHeader(200, { 'Content-Type': 'application/json' });
		if (callback)
			response.end(callback + "(" + JSON.stringify(body, null, '\t') + ")");
		else
			response.end(JSON.stringify(body, null, '\t'));
	});
}
function getconvertedfacebookfeed(feedArray, response, fun, maxdate) {
	try {
		var outputFeedArray = [];
		console.log("date: " + maxdate);
		var objmaxdate = maxdate ? new Date(maxdate) : undefined;
		feedArray.forEach(function (jsonfeed) {
			//   var inputfeed = $("#inputfeed").val();
			var output = [];
			if (objmaxdate != undefined
                 && new Date(jsonfeed.updated_time) >= objmaxdate) {
				console.log(jsonfeed.updated_time + "does not match the criteria ")
			}
			else {
				if (jsonfeed.status_type == 'mobile_status_update' || (jsonfeed.type == 'status' && jsonfeed.status_type == 'wall_post')) {
					output.push(jsonfeed.id);
					output.push(jsonfeed.from.id);
					output.push("");
					//console.log("middle of  mobile status update");
					output.push(jsonfeed.from.name);
					output.push(jsonfeed.created_time);
					output.push(jsonfeed.message);
					if (jsonfeed.likes)
						output.push(jsonfeed.likes.data.length);
					else
						output.push(0);
					output.push("");
					if (jsonfeed.comments)
						output.push(jsonfeed.comments.data.length);
					else
						output.push(0);
					output.push(jsonfeed.updated_time);
					output.push("Facebook");
					///console.log("mobile status populated");
					outputFeedArray.push(output);
				}
				else if (jsonfeed.type == 'status' && jsonfeed.status_type == undefined) {
					//console.log("status parse begin");
					output.push(jsonfeed.id);
					output.push(jsonfeed.from.id);
					output.push("");
					output.push(jsonfeed.from.name);
					output.push(jsonfeed.created_time);
					// console.log("status parse middle");
					output.push(jsonfeed.story);
					if (jsonfeed.likes)
						output.push(jsonfeed.likes.data.length);
					else
						output.push(0);
					output.push("");
					if (jsonfeed.comments)
						output.push(jsonfeed.comments.data.length);
					else
						output.push(0);
					output.push(jsonfeed.updated_time);
					output.push("Facebook");
					// console.log("status  populated");
					outputFeedArray.push(output);
				}
				else if ((jsonfeed.type == 'photo' && jsonfeed.status_type == 'shared_story') || (jsonfeed.type == 'photo' && jsonfeed.status_type == 'added_photos') || (jsonfeed.type == 'photo' && jsonfeed.status_type == 'added_photos')) {
					output.push(jsonfeed.id);
					output.push(jsonfeed.from.id);
					output.push("");
					output.push(jsonfeed.from.name);
					output.push(jsonfeed.created_time);
					// console.log("status parse middle");
					var groupmessage = '';
					if (jsonfeed.caption)
						groupmessage = groupmessage + jsonfeed.caption;
					if (jsonfeed.picture)
						groupmessage = groupmessage + "link:" + jsonfeed.picture;
					if (jsonfeed.story)
						groupmessage = groupmessage + jsonfeed.story;
					output.push(groupmessage);
					if (jsonfeed.likes)
						output.push(jsonfeed.likes.data.length);
					else
						output.push(0);
					output.push("");
					if (jsonfeed.comments)
						output.push(jsonfeed.comments.data.length);
					else
						output.push(0);
					output.push(jsonfeed.updated_time);
					output.push("Facebook");
					console.log("photo status  populated");
					outputFeedArray.push(output);
				}
				else if (jsonfeed.type == 'photo' && jsonfeed.status_type == 'wall_post') {
					output.push(jsonfeed.id);
					output.push(jsonfeed.from.id);
					output.push("");
					output.push(jsonfeed.from.name);
					output.push(jsonfeed.created_time);
					// console.log("status parse middle");
					var groupmessage = '';
					if (jsonfeed.caption)
						groupmessage = groupmessage + jsonfeed.caption;
					if (jsonfeed.picture)
						groupmessage = groupmessage + "link:" + jsonfeed.picture;
					if (jsonfeed.story)
						groupmessage = groupmessage + jsonfeed.story;
					if (jsonfeed.message)
						groupmesage = groupmessage + jsonfeed.message;
					output.push(groupmessage);
					if (jsonfeed.likes)
						output.push(jsonfeed.likes.data.length);
					else
						output.push(0);
					output.push("");
					if (jsonfeed.comments)
						output.push(jsonfeed.comments.data.length);
					else
						output.push(0);
					output.push(jsonfeed.updated_time);
					output.push("Facebook");
					console.log("photo status  populated");
					outputFeedArray.push(output);
				}
			}
		});
		if (fun) {
			fun({ posts: outputFeedArray });
		}
		else {
			response.writeHeader(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ posts: outputFeedArray }, null, '\t'));
		}
	}
	catch (e) {
		console.log("error in getconverted fbfeeds: " + e);
		if (fun) {
			fun({ posts: [] });
		}
		else {
			response.writeHeader(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ posts: [] }, null, '\t'));
		}
	}
}
function getConvertedLikes(likesArray) {
	var outputlikes = [];
	likesArray.forEach(function (objlike) {
		outputlikes.push(objlike.name);
	});
	return { members: outputlikes };
}
function getConvertedReplies(replyArray) {
	var outputreply = [];
	var replycount = replyArray.length;
	replyArray.forEach(function (objreply) {
		var output = [];
		output.push(objreply.id);
		output.push(objreply.from.id);
		output.push("");
		output.push(objreply.from.name);
		output.push(objreply.created_time);
		output.push("reply no: " + replycount--);
		outputreply.push(output);
	});
	return { replies: outputreply };
}
function getLikes(access_token, response, post_id) {
	console.log('call to get likes');
	var url = 'https://graph.facebook.com/' + post_id + '/likes';
	var params = {
		access_token: access_token
	};
	fbget(url, params, access_token, response,
          function (body) {
          	response.writeHeader(200, { 'Content-Type': 'application/json' });
          	response.end(JSON.stringify(getConvertedLikes(body.data)));
          });
}
function postLikes(access_token, response, post_id) {
	console.log('call to post likes');
	var url = 'https://graph.facebook.com/' + post_id + '/likes';
	var params = {
		access_token: access_token
	};
	fbpost(url, params, access_token, response);
}
function postReplies(access_token, response, post_id, message) {
	var url = 'https://graph.facebook.com/' + post_id + '/comments';
	var params = {
		access_token: access_token,
		message: message
	};
	fbpost(url, params, access_token, response);
}
function getReplies(access_token, response, post_id, fun) {
	var url = 'https://graph.facebook.com/' + post_id + '/comments';
	var params = {
		access_token: access_token,
		limit: 100
	};
	fbget(url, params, access_token, response,
    function (body) {
    	response.writeHeader(200, { 'Content-Type': 'application/json' });
    	response.end(JSON.stringify(getConvertedReplies(body.data)));
    });
}
function fbget(url, params, access_token, response, fun) {
    request.get({ url: url, qs: params }, function (err, resp, body) {
        // Handle any errors that occur
        console.log('url' + url);
        if (err) {
            console.error("Error occured: ", err);
            response.writeHeader(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(err, null, '\t'));
            return;
        }
        body = JSON.parse(body);
        if (body.error) {
            console.error("Error returned from facebook: ", body.error);
            response.writeHeader(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(body, null, '\t'));
            return;
        }
        if (fun) {
            fun(body);
        }
        else {
            response.writeHeader(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(body, null, '\t'));
        }
    });
}
function fbpost(url, params, access_token, response, fun) {
	request.post({ url: url, qs: params }, function (err, resp, body) {
		// Handle any errors that occur
		console.log('url' + url);
		if (err) return console.error("Error occured: ", err);
		body = JSON.parse(body);
		if (body.error) return console.error("Error returned from facebook: ", body.error);
		if (fun) {
			fun(body);
		}
		else {
			response.writeHeader(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(body, null, '\t'));
		}
	});
}
function getHomeFeeds(access_token, response, fun, maxdate) {
	// Specify the URL and query string parameters needed for the request
	try {
		var url = 'https://graph.facebook.com/me/home';
		var params = {
			access_token: access_token
			//  message: message
		};
		console.log('into home feeds');
		fbget(url, params, access_token, response,
    function (body) {
    	getconvertedfacebookfeed(body.data, response, fun, maxdate);
    });
	}
	catch (e) {
		console.log(e);
	}
}
function postfromapplication(access_token, message, response) {
	// Specify the URL and query string parameters needed for the request
	var url = 'https://graph.facebook.com/100005623991718/feed';
	var params = {
		access_token: access_token,
		message: message
	};

	// Send the request
	request.post({ url: url, qs: params }, function (err, resp, body) {
		// Handle any errors that occur
		if (err) return console.error("Error occured: ", err);
		body = JSON.parse(body);
		if (body.error) return console.error("Error returned from facebook: ", body.error);

		// Generate output
		var output = '<p>' + body + '</p>';
		output += '<pre>' + JSON.stringify(body, null, '\t') + '</pre>';

		// Send output as the response
		response.writeHeader(200, { 'Content-Type': 'text/html' });
		response.end(output);
	});
}

exports.postMessage = postMessage;
exports.getHomeFeeds = getHomeFeeds;
exports.postfromapplication = postfromapplication;
exports.getProfile = getProfile;
exports.getLikes = getLikes;
exports.getReplies = getReplies;