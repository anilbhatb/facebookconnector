var request = require('request')
  , qs = require('qs');

var callbackURL = 'http://'+process.env.OPENSHIFT_APP_DNS+'/callback'
  , APP_ID = '236299956516217'
  , APP_SECRET = '9364d9abbaf1e83f0a0608c4bc737f91';


var state = '';
var access_token = '';
var expires = '';


function login(req, res) {

  state = Math.floor(Math.random()*1e19);
  console.log('sdsd');
	var params = {
		client_id: '236299956516217',
		redirect_uri: callbackURL,
		state: state,
		display: 'popup',
		scope: 'publish_stream' // required in order to post on user's feed
	};
	params = qs.stringify(params);
	console.log(params);
	res.end('https://www.facebook.com/dialog/oauth?'+params);
}

function callback(req, res) {
	var code = req.query.code
    , cb_state = req.query.state
    , errorreason = req.query.error_reason
    , error = req.query.error;
	//console.log();
	//if (state == cb_state)
	 {

		if (code !== undefined) {
			var params = {
				client_id: '236299956516217',
				redirect_uri: 'http://localhost:8180/callback',
				client_secret: '9364d9abbaf1e83f0a0608c4bc737f91',
				code: code
			};
      
	    request.get({url:'https://graph.facebook.com/oauth/access_token',qs:params}, function(err, resp, body) {
				var results = qs.parse(body);
        
        // Retreive the access_token and store it for future use
			
				access_token = results.access_token;
				expires = results.expires;
        exports.access_token = access_token;
        exports.expires = expires;

				console.log("Connected to Facebook");
			console.log(body);
			console.log('*****************************************');
				// close the popup
				var output = '<html><head></head><body><form id=\"fbpost\" action=\"./post\" method=\"post\" > <p>Message: <input type=\"text\" placeholder=\"Enter message\" id=\"message\" name=\"message\" /></p><input type=\"submit\" name=\"submit\" value=\"Submit\" /></form></body></html>';
		
				res.writeHead(200, {'Content-Type': 'text/html'});
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

exports.login = login;
exports.callback = callback;