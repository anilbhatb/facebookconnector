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

}on
function getProfile(access_token, response, callback) {
    // Specify the URL and query string parameters needed for the request
    var url = 'https://graph.facebook.com/me';
    var params = {
        access_token: access_token,
        fields: 'id,name,last_name,link,username,hometown,work,gender,languages,interests,education,email'
    };
    console.log('into get profile');
    // Send the request
    request.get({ url: url, qs: params }, function (err, resp, body) {

        // Handle any errors that occur
        if (err) return console.error("Error occured: ", err);
        body = JSON.parse(body);
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
function getHomeFeeds(access_token, response) {
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

        // Generate output
    //    var output = '<p>' + body + '</p>';
    //    output += '<pre>' + JSON.stringify(body, null, '\t') + '</pre>';
      //  console.log(output);
        // Send output as the response
        response.writeHeader(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(body, null, '\t'));
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