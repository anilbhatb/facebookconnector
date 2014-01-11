var request = require('request');

function postMessage(access_token, message, response) {
    // Specify the URL and query string parameters needed for the request
    var url = 'https://graph.facebook.com/me/feed';
    var params = {
        access_token: access_token,
        message: message
    };

	// Send the request
    request.post({url: url, qs: params}, function(err, resp, body) {
      
      // Handle any errors that occur
      if (err) return console.error("Error occured: ", err);
      body = JSON.parse(body);
      if (body.error) return console.error("Error returned from facebook: ", body.error);

      // Generate output
      var output = '<p>Message has been posted to your feed. Here is the id generated:</p>';
      output += '<pre>' + JSON.stringify(body, null, '\t') + '</pre>';
      
      // Send output as the response
      response.writeHeader(200, {'Content-Type': 'text/html'});
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
    if(callback)
        response.end(callback+"("+JSON.stringify(body, null, '\t')+")");
    else
        response.end(JSON.stringify(body, null, '\t'));
    });

}
function getconvertedfacebookfeed(feedArray, maxdate) {
	var outputFeedArray = [];
	maxdate = "1/8/2014 6:50:52 AM";
	console.log("date: "+ maxdate);
	var objmaxdate =maxdate?  new Date(maxdate):undefined;
	feedArray.forEach(function (jsonfeed) {
		//   var inputfeed = $("#inputfeed").val();
		var output = [];
		if(objmaxdate != undefined
		 && new Date(jsonfeed.updated_time) >= objmaxdate)
			{
			console.log(jsonfeed.updated_time + "does not match the criteria ")
			}
		else{
		if (jsonfeed.status_type == 'mobile_status_update') {
			output.push(jsonfeed.id);
			output.push(jsonfeed.from.id);
			output.push("");
			//console.log("middle of  mobile status update");
			output.push(jsonfeed.from.name);
			output.push(jsonfeed.updated_time);
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
			output.push(jsonfeed.updated_time);
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
	}

    });
    return { posts: outputFeedArray };
}
function getConvertedLikes(likesArray)
{ 
	var outputlikes = [];
	likesArray.forEach(function (objlike) {
		outputlikes.push(objlike.name);
	});
	return {members:outputlikes };
}
function getConvertedReplies(replyArray) {
	var outputreply = [];
	replyArray.forEach(function (objreply) {
		outputreply.push(objreply.name);
	});
	return { data: outputreply };
}
function getLikes(access_token, response,post_id, fun) {
    console.log('call to get likes');
  var url = 'https://graph.facebook.com/'+post_id+'/likes';
  var params = {
        access_token: access_token
    };
  send(url, params, access_token, response, 
	  function (body) {
	  	response.writeHeader(200, { 'Content-Type': 'application/json' });
	  	response.end(JSON.stringify(getConvertedLikes(body.data)));
	  });
}
function getReplies(access_token, response, post_id, fun) {
    var url = 'https://graph.facebook.com/' + post_id + '/comments';
    var params = {
        access_token: access_token,
        limit: 100
    };
    send(url, params, access_token, response, fun);
}
function send(url,params, access_token, response, fun) {
    request.get({ url: url, qs: params }, function (err, resp, body) {
        // Handle any errors that occur
        console.log('url' + url);
        if (err) return console.error("Error occured: ", err);
        body = JSON.parse(body); console.log(body);
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
function getHomeFeeds(access_token, response, fun,date) {
    // Specify the URL and query string parameters needed for the request
    var url = 'https://graph.facebook.com/me/home';
    var params = {
        access_token: access_token
      //  message: message
    };
    console.log('into home feeds');
    console.log(date);
    // Send the request
    request.get({ url: url, qs: params }, function (err, resp, body) {
        // Handle any errors that occur
        if (err) return console.error("Error occured: ", err);
        body = JSON.parse(body);
        if (body.error) return console.error("Error returned from facebook: ", body.error);
        var feedList = {};
        response.writeHeader(200, { 'Content-Type': 'application/json' });
        var output = getconvertedfacebookfeed(body.data,date);
        if (fun) {
            fun(output);
        }
        else {
            response.end(JSON.stringify(body, null, '\t'));
        }
    });
}

function postfromapplication(access_token,message, response) {
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