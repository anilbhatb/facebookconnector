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

        // Generate output
        //    var output = '<p>' + body + '</p>';00
        //    output += '<pre>' + JSON.stringify(body, null, '\t') + '</pre>';
        //  console.log(output);
        // Send output as the response
        //console.log('profile');
        //console.log(JSON.stringify(body, null, '\t'));
        response.writeHeader(200, { 'Content-Type': 'application/json' });
    if(callback)
        response.end(callback+"("+JSON.stringify(body, null, '\t')+")");
    else
        response.end(JSON.stringify(body, null, '\t'));

    });

}
function getconvertedfacebookfeed(feedArray) {
    var outputFeedArray = [];
    feedArray.forEach(function (jsonfeed) {
        //   var inputfeed = $("#inputfeed").val();
        var output = [];
        //  var jsonfeed = JSON.parse(inputfeed);
        if (jsonfeed.status_type == 'mobile_status_update') {
            output.push(jsonfeed.id);
            output.push(jsonfeed.from.id);
            output.push("");
            console.log("middle of  mobile status update");
            output.push(jsonfeed.from.name);
            output.push(jsonfeed.updated_time);
            output.push(jsonfeed.message);
            if (jsonfeed.likes)
                output.push(jsonfeed.likes.data.length);
            else
                output.push("0");
            output.push("");
            
            output.push("");
            if (jsonfeed.comments)
                output.push(jsonfeed.comments.data.length);
            else
                output.push("0");
            output.push(jsonfeed.updated_time);
            console.log("mobile status populated");
            outputFeedArray.push(output);
        }
        else if (jsonfeed.type == 'status' && jsonfeed.status_type == undefined) {
            console.log("status parse begin");
            output.push(jsonfeed.id);
            output.push(jsonfeed.from.id);
            output.push("");
            output.push(jsonfeed.from.name);
            output.push(jsonfeed.updated_time);
            console.log("status parse middle");
            output.push(jsonfeed.story);
            if (jsonfeed.likes)
                output.push(jsonfeed.likes.data.length);
            else
                output.push("0");
            output.push("");
            if (jsonfeed.comments)
                output.push(jsonfeed.comments.data.length);
            else
                output.push("0");
            output.push(jsonfeed.updated_time);
            console.log("status  populated");
            outputFeedArray.push(output);
        }

    });
    return { posts: outputFeedArray };
}

function getHomeFeeds(access_token, response, fun) {
    // Specify the URL and query string parameters needed for the request
    var url = 'https://graph.facebook.com/me/home';
    var params = {
        access_token: access_token
      //  message: message
    };
    console.log('into home feeds');
    // Send the request
    request.get({ url: url, qs: params }, function (err, resp, body) {

        // Handle any errors that occur
        if (err) return console.error("Error occured: ", err);
        body = JSON.parse(body);
        if (body.error) return console.error("Error returned from facebook: ", body.error);
        console.log("body" + body);
        var feedList = {};
        //var feed =
        //{
        //    soid: body.data[0].id,
        //    membersoid: body.data[0].from.id,
        //    PictureRef: '',
        //    FullName: body.data[0].from.name,
        //    Recency: '',
        //    Body: body.data[0].message,
        //    LikeCount: body.data[0].likes.data.length,
        //    SelfLike: '',
        //    ReplyCount: body.data[0].comments.data.count,
        //    LastModified: body.data.updated_time
        //};
        console.log("*******************************" + JSON.stringify(body.data[0].id));
        // Generate output
        //    var output = '<p>' + body + '</p>';
        //    output += '<pre>' + JSON.stringify(body, null, '\t') + '</pre>';
        //  console.log(output);
        // Send output as the response
        response.writeHeader(200, { 'Content-Type': 'application/json' });
        var output = getconvertedfacebookfeed(body.data);
        console.log("after getconvertedfacebookfeeds");
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