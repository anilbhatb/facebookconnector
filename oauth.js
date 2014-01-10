var request = require('request')
  , qs = require('qs');
console.log("connector url:  "+ CONNECTOR_URL);
var callbackURL = 'http://'+CONNECTOR_URL+'/callback'
  , APP_ID = FACEBOOK_APP_ID
  , APP_SECRET = FACEBOOK_APP_SECRET;

var state = '';
var access_token = '';
var expires = '';
var app_access_token = '';

function login(req, res) {

  state = Math.floor(Math.random()*1e19);
	var params = {
	    client_id: FACEBOOK_APP_ID,
		redirect_uri: callbackURL,
		state: state,
		display: 'popup',
		scope: 'publish_stream' // required in order to post on user's feed
	};
	params = qs.stringify(params);
	console.log(params);
	res.end('https://www.facebook.com/dialog/oauth?'+params);
}
function storeaccesstoken(token) {
    console.log('***************************');
    console.log('storing auth information');
    //access_token = 'CAADW6d739XkBACDLERlItelGaGOArIAzTgIvAzOLuktOK1EqUUymTMtHBmSFLReIodOPTY1DUw7TcWm4GlqVpsiz3OQ8Xih9DsV5brPIayPDZCXSv1VNL3yT2ErTZCZA0g39VbQMSowTldLZANcP9wcyJ8UHqtbTU5ZCn4edK5v6FxLrkvKZBfjLXZBsvyyXM0ZD';
    access_token = token;
    exports.access_token = access_token;
}

//https: //graph.facebook.com/me/accounts?access_token=XXXXXXXX

function getapplicationAuthtoken(user_token, res) {
    var params = {
        access_token: user_token
    };
    console.log('user_token: '+user_token);
    request.get({ url: 'https://graph.facebook.com/me/accounts', qs: params }, function (err, resp, body) {
        var results = qs.parse(body);
        console.log("output of the getapplication token");
        console.log(results);
        var jsondata = JSON.parse(body);
        console.log("************************");
        // Retreive the access_token and store it for future use
        //console.log('inside getApplication Auth token');
        console.log(jsondata.data);
        name = jsondata.data[0].name;
        //  console.log('1:' + name);
        //  category = jsondata.data[0].category;
        // console.log('2: ' + category);
        //  id = jsondata.data[0].id;
        //  console.log('3: ' + id);
        if (jsondata.data )
        if( jsondata.data[0]) {
            app_access_token = jsondata.data[0].access_token;
            exports.app_access_token = app_access_token;
            console.log(app_access_token);
        } //res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('true');

    });


}
function callback(req, res, fn) {
	var code = req.query.code
    , cb_state = req.query.state
    , errorreason = req.query.error_reason
    , error = req.query.error;
	console.log('http://' + CONNECTOR_URL + '/callback');
    
	//if (state == cb_state)
	 {
	     console.log(FACEBOOK_APP_ID);
		if (code !== undefined) {
			var params = {
			    client_id: FACEBOOK_APP_ID,
				redirect_uri: 'http://'+CONNECTOR_URL+'/callback',
				client_secret: FACEBOOK_APP_SECRET,
				code: code
			};

			request.get({ url: 'https://graph.facebook.com/oauth/access_token', qs: params }, function (err, resp, body) {
			    var results = qs.parse(body);

			    // Retreive the access_token and store it for future use

			    access_token = results.access_token;
			    expires = results.expires;
			    exports.access_token = access_token;
			    exports.expires = expires;
			    console.log('access token: ');
			    console.log(access_token);
			    console.log(expires);
			    console.log("Connected to Facebook");
			    // close the popup
			    fn(access_token);
			    var output = '<html><head></head><body><script>this.window.close();</script> </body></html>';
			    //res.redirect('/facebook.html');
			    res.writeHead(200, { 'Content-Type': 'text/html' });
			    res.end(output);
			});

		} else {
			console.error('Code is undefined: '+code);
			console.error('Error: '+ error + ' - '+ errorreason);
		}

	}// else {
	//	console.error('Mismatch with variable "state". Redirecting to /');
	//	res.redirect('/');
	//}
}
exports.getapplicationAuthtoken = getapplicationAuthtoken;
exports.login = login;
exports.callback = callback;
exports.storeaccesstoken = storeaccesstoken;