var express = require('express')
  , api = require('./facebook')
  , rockonapi = require('./validatetoken')
  , digestclient = require('./digestclient')
  , oauth = require('./oauth')
  , passport = require('passport')
  , app = express()
  , digest = require('./digestapp')
  , qs = require('qs')
  ,DigestStrategy = require('passport-http').DigestStrategy // http digest
  ,FacebookStrategy = require('passport-facebook').Strategy;
// Setup middleware
app.use(express.static(__dirname));
app.use(express.bodyParser());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.post('/post', function(req, res) {
  // Check to ensure user has a valid access_token
  if (oauth.access_token) {

    // Call function that contains API call to post on Facebook (see facebook.js)
    api.postMessage(oauth.access_token, req.body.message, res);
    
  } else {
    console.log("Couldn't confirm that user was authenticated. Redirecting to /");
    res.redirect('/');
  }
});
app.post('/postfromapplication', function (req, res) {
    // Check to ensure user has a valid access_token
    if (oauth.access_token) {

        // Call function that contains API call to post on Facebook (see facebook.js)
        api.postfromapplication(oauth.access_token, req.body.message, res);

    } else {
        console.log("Couldn't confirm that user was authenticated. Redirecting to /");
        res.redirect('/');
    }
});

app.get('/apptoken', function (req, res) {
    // Check to ensure user has a valid access_token
    if (oauth.access_token) {

        oauth.getapplicationAuthtoken(oauth.access_token, res);
      //  if (oauth.app_access_token) {
        //    console.log('application auth token:' + oauth.app_access_token);
       // } // Call function that contains API call to post on Facebook (see facebook.js)
        //  api.postMessage(oauth.access_token, req.body.message, res);

    } else {
        console.log("Couldn't confirm that user was authenticated. Redirecting to /");
        res.redirect('/');
    }
});
app.get('/fbhome', function(req, res) {
  // Check to ensure user has a valid access_token
  if (oauth.access_token) {

    // Call function that contains API call to post on Facebook (see facebook.js)
    api.getHomeFeeds(oauth.access_token, res);
    
  } else {
    console.log("Couldn't confirm that user was authenticated. Redirecting to /");
    res.redirect('/');
  }
});
app.get('/getProfile', function (req, res) {
    // Check to ensure user has a valid access_token
    if (oauth.access_token) {

        // Call function that contains API call to post on Facebook (see facebook.js)
        api.getProfile(oauth.access_token, res);

    } else {
        console.log("Couldn't confirm that user was authenticated. Redirecting to /");
        res.redirect('/');
    }
});
var FACEBOOK_APP_ID = "236299956516217"
var FACEBOOK_APP_SECRET = "9364d9abbaf1e83f0a0608c4bc737f91";
var loggedinuser = '';

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8180/callback"
  },
  function(accessToken, refreshToken, profile, done) {
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

  passport.authenticate('facebook', { scope: ['create_note', 'email', 'export_stream', 'manage_pages', 'photo_upload', 'publish_actions','read_stream', 'publish_stream', 'read_stream', 'share_item', 'status_update', 'user_about_me', 'user_activities', 'user_friends', 'user_interests', 'user_likes', 'user_photos', 'user_questions', 'video_upload'] }),
  //passport.authenticate('facebook', { scope: ['user_about_me', 'user_photos', 'email', 'publish_stream', 'read_stream', 'manage_pages'] }),
  function (req, res) {
     
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });



// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var users = [
    { id: 1, username: 'John', password: 'pass', domain: "http://localhost:8180/", email: 'john@example.com' , access_token:'' }
  , { id: 2, username: 'joe', password: 'birthday', domain: "http://localhost:8180/", email: 'joe@example.com', access_token : '' }
];

// #############################################################################################################

function findByUsername(username, fn) {
    console.log('inside findusername');
    for (var i = 0, len = users.length; i < len; i++) {
        console.log('inside for loop: '+ username);
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
                console.log('call got called');
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
          res.redirect('/'); //Inside a callback� bulletproof!
      });
    //  res.redirect('/');
  });

  
//app.get('/callback', 
 // passport.authenticate('facebook', { failureRedirect: '/login' }),
 // function(req, res) {
  //  res.redirect('/');
 // });
// Routes for OAuth calls
app.get('/rockoncall', rockonapi.validate);
app.get('/login', oauth.login);
app.get('/appposttouser', oauth.getapplicationAuthtoken);
app.get('/callback', function (req, res) {
    oauth.callback(req, res, function (token) {

        for (var i = 0, len = users.length; i < len; i++) {
            console.log('inside for loop: ' + loggedinuser);
            var user = users[i];
            if (user.username === loggedinuser) {
                user.access_token = token;
                    console.log('stored access token for future use');
            }
        }
     });
});
 
app.listen(8180);