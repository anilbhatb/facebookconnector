var cluster = require('cluster');
if (cluster.isMaster) {
	var worker = cluster.fork().process;
	console.log('worker %s started.', worker.pid);
	cluster.on('exit', function (worker) {
		console.log('worker %s died. restart...', worker.process.pid);
		cluster.fork();
	});
}
else {
	//global.FACEBOOK_APP_ID = "236299956516217"
	//global.FACEBOOK_APP_SECRET = "9364d9abbaf1e83f0a0608c4bc737f91";
	//global.CONNECTOR_URL = "localhost:8180";
	global.FACEBOOK_APP_ID = "363685873749093"
	global.FACEBOOK_APP_SECRET = "84895681852dc4a96f23345fd4d855b0";
	global.CONNECTOR_URL = "192.168.6.148:8180";

	var express = require('express')
  , fbapi = require('./facebook')
  , postcontroller = require('./postcontroller')
  , digestclient = require('./digestclient')
  , oauth = require('./oauth')
  , passport = require('passport')
  , app = express()
  , digest = require('./digestapp')
  , qs = require('qs')
  , domain = require('domain')
  ,winston  = require('winston')
  , DigestStrategy = require('passport-http').DigestStrategy // http digest
  , FacebookStrategy = require('passport-facebook').Strategy;
	// Setup middleware
	var serverDomain = domain.create();
	serverDomain.on('error', function (err) {
		console.log("Server Domain Error: " + err);
	});
	app.use(express.static(__dirname));
	app.use(express.bodyParser());
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	winston.add(winston.transports.File, { filename: 'connector.log' });
	winston.remove(winston.transports.Console);
	winston.log('info', 'winston logging started');
	app.post('/fbpostfromuser', function (req, res) {
		// Check to ensure user has a valid access_token
		//if (oauth.access_token) {
		postcontroller.GetAccessToken(req, res, function (req, res,fb_access_token) {
			if (fb_access_token) {
				// Call function that contains API call to post on Facebook (see facebook.js)

				fbapi.postMessage(fb_access_token, req, res);
			} else {
				console.log("Couldn't confirm that user was authenticated. Redirecting to /");
				res.redirect('/');
			}
		});
	});
    app.post('/fbpostNotification', function (req, res) {
		// Check to ensure user has a valid access_token
			// Call function that contains API call to post on Facebook (see facebook.js)
        fbapi.postNotification(req, res);
	});

	app.get('/fbgetReplies', function (req, res) {
		// Check to ensure user has a valid access_token
		postcontroller.GetAccessToken(req, res, function (req, res,fb_access_token) {
			if (fb_access_token) {
				fbapi.getReplies(fb_access_token, res, req);
			} else {
				console.log("Couldn't confirm that user was authenticated. Redirecting to /");
				res.redirect('/');
			}
		});
	});
	app.get('/fbgetLikes', function (req, res) {
		// Check to ensure user has a valid access_token
		postcontroller.GetAccessToken(req, res, function (req, res,fb_access_token) {
			if (fb_access_token) {
				fbapi.getLikes(fb_access_token, res, req);
			} else {
				console.log("Couldn't confirm that user was authenticated. Redirecting to /");
				res.redirect('/');
			}
		});
	});
	app.post('/fbpostReplies', function (req, res) {
		// Check to ensure user has a valid access_token
		postcontroller.GetAccessToken(req, res, function (req, res,fb_access_token) {
			if (fb_access_token) {
				fbapi.postReplies(fb_access_token, res, req);
			} else {
				console.log("Couldn't confirm that user was authenticated. Redirecting to /");
				res.redirect('/');
			}
		});
	});
	app.post('/fbpostLikes', function (req, res) {
		// Check to ensure user has a valid access_token
		postcontroller.GetAccessToken(req, res, function (req, res,fb_access_token) {
			if (fb_access_token) {
				fbapi.postLikes(fb_access_token, res, req);
			} else {
				console.log("Couldn't confirm that user was authenticated. Redirecting to /");
				res.redirect('/');
			}
		});
	});
	app.get('/fbhome', function (req, res) {
	    // Check to ensure user has a valid access_token
	    if (oauth.access_token) {
	        // Call function that contains API call to post on Facebook (see facebook.js)
	        fbapi.getHomeFeeds(oauth.access_token, res);
	    } else {
	        console.log("Couldn't confirm that user was authenticated. Redirecting to /");
	        res.redirect('/');
	    }
	});
	app.get('/fbgetProfile', function (req, res) {
	    // Check to ensure user has a valid access_token
	    postcontroller.GetAccessToken(req, res, function (req, res, fb_access_token) {
	        if (fb_access_token) {
	            var callback = req.query.callback;
	            // Call function that contains API call to post on Facebook (see facebook.js)
	            var tokeninfo = { access_token: oauth.access_token, expires: oauth.expires };
	            fbapi.getProfile(tokeninfo, res, callback);
	        } else {
	            console.log("Couldn't confirm that user was authenticated. Redirecting to /");
	            res.redirect('/');
	        }
	    });
	});
	var loggedinuser = '';
	// Use the FacebookStrategy within Passport.
	//   Strategies in Passport require a `verify` function, which accept
	//   credentials (in this case, an accessToken, refreshToken, and Facebook
	//   profile), and invoke a callback with a user object.
	passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "http://" + CONNECTOR_URL + "/callback"
	},
  function (accessToken, refreshToken, profile, done) {
  	// asynchronous verification, for effect...

  	process.nextTick(function () {
  		// To keep the example simple, the user's Facebook profile is returned to
  		// represent the logged-in user.  In a typical application, you would want
  		// to associate the Facebook account with a user record in your database,
  	    // and return that user instead.
  		return done(null, profile);
  	});
  }
));
	app.get('/auth/facebook',
    function(req,res){
     passport.authenticate('facebook', { callbackURL: "http://" + CONNECTOR_URL + "/callback/" + req.query.sid + "/" + req.query.sessionid, scope: ['create_note', 'email', 'export_stream', 'manage_pages', 'photo_upload', 'publish_actions', 'read_stream', 'publish_stream', 'read_stream', 'share_item', 'status_update', 'user_about_me', 'user_activities', 'user_friends', 'user_interests', 'user_likes', 'user_photos', 'user_questions', 'video_upload'] })(req,res);
    //passport.authenticate('facebook', { scope: ['user_about_me', 'user_photos', 'email', 'publish_stream', 'read_stream', 'manage_pages'] }),
    });

	// Passport session setup.
	//   To support persistent login sessions, Passport needs to be able to
	//   serialize users into and deserialize users out of the session.  Typically,
	//   this will be as simple as storing the user ID when serializing, and finding
	//   the user by ID when deserializing.  However, since this example does not
	//   have a database of user records, the complete Facebook profile is serialized
	//   and deserialized.
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (obj, done) {
		done(null, obj);
	});
	var users = [
    { id: 1, username: 'John', password: 'pass', domain: "http://localhost:8180/", email: 'john@example.com', access_token: '' }
  , { id: 2, username: 'joe', password: 'birthday', domain: "http://localhost:8180/", email: 'joe@example.com', access_token: '' }
	];

	// #############################################################################################################

	function findByUsername(username, fn) {
		console.log('inside findusername');
		for (var i = 0, len = users.length; i < len; i++) {
			console.log('inside for loop: ' + username);
			var user = users[i];
			if (user.username === username) {
				if (user.access_token != "") {
					oauth.storeaccesstoken(user.access_token);
					console.log('found a valid token');
				}
				console.log('username found');
				return fn(null, user);
			}
		}
		return fn(null, null);
	}
	passport.use
(
  new DigestStrategy(
    { qop: 'auth' },
    function (username, done) {
    	console.log('Findbyusername being called');
    	// Find the user by username. If there is no user with the given username
    	// set the user to `false` to indicate failure. Otherwise, return the
    	// user and user's password.
    	findByUsername(
            username,
            function (err, user) {
            	if (err) return done(err);
            	if (!user) return done(null, false);
            	loggedinuser = username;
            	return done(null, user, user.password);
            }
        );
    },
    function (params, done) // second callback
    {
    	console.log('second callback being called');
    	// asynchronous validation, for effect...
    	process.nextTick(
            function () {
            	// check nonces in params here, if desired
            	console.log(params);
            	return done(null, true);
            }
        );
    }
));
	app.get('/digestauth',
  passport.authenticate('digest', { session: true }),
  function (req, res) {
  	// The request will be redirected to Facebook for authentication, so this
  	// function will not be called.
  	if (oauth.access_token) {
  		res.redirect("/facebook.html");
  	}
  	else
  		res.redirect("/auth/facebook");
  });

	app.get('/logout', function (req, res) {
		req.session.destroy(function (err) {
			res.redirect('/'); //Inside a callback
 		});
		//  res.redirect('/');
	});

	// Routes for OAuth calls
	app.post('/postcontroller/GetPost', postcontroller.GetPost);
	app.get('/postcontroller/GetPostsOnScroll', postcontroller.GetPostsOnScroll);
	app.get('/postcontroller/GetInitialPosts', postcontroller.GetInitialPosts);
	app.get('/login', oauth.login);
	app.get('/appposttouser', oauth.getapplicationAuthtoken);

	app.get('/callback/:sid/:session', function (req, res) {
		oauth.callback(req, res, function (token) {
		    var profile = fbapi.getProfile({ access_token: token, expires: "" }, res, "", function (profile) {
		        console.log("profile info:" + profile);
		        postcontroller.SaveSocialNetworkInfo(req, res, profile.id, profile.name, "facebook", token, profile.link, "", function () {
		            var output = '<html><head></head><body><script>this.window.close();</script> </body></html>';
		            //res.redirect('/facebook.html');
		            res.writeHead(200, { 'Content-Type': 'text/html' });
		            res.end(output);
		        });

		    });
			
		});
	});

	app.listen(8180);
}
process.on('uncaughtException', function (err) {
	console.error('An uncaughtException was found, the program will end.'
    + err);
	//hopefully do some logging.
	process.exit(1);
});