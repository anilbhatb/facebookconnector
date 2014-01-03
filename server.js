var express = require('express')
  , api = require('./facebook')
  , rockonapi = require('./validatetoken')
  , digestclient = require('./digestclient')
  , oauth = require('./oauth')
//  , passport = require('passport')
  , app = express()
  , digest = require('./digestapp')
  , qs = require('qs')
  , FacebookStrategy = require('passport-facebook').Strategy;

// Setup middleware
app.use(express.static(__dirname));
app.use(express.bodyParser());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.methodOverride());
//app.use(passport.initialize());
//app.use(passport.session());
app.use(app.router);

app.post('/post', function(req, res) {
  // Check to ensure user has a valid access_token
  console.log('connected after authentication');
  if (oauth.access_token) {

    // Call function that contains API call to post on Facebook (see facebook.js)
    api.postMessage(oauth.access_token, req.body.message, res);
    
  } else {
    console.log("Couldn't confirm that user was authenticated. Redirecting to /");
    res.redirect('/');
  }
});
var FACEBOOK_APP_ID = "236299956516217"
var FACEBOOK_APP_SECRET = "9364d9abbaf1e83f0a0608c4bc737f91";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
//passport.serializeUser(function(user, done) {
//  done(null, user);
//});

//passport.deserializeUser(function(obj, done) {
//  done(null, obj);
//});
// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
//passport.use(new FacebookStrategy({
//    clientID: FACEBOOK_APP_ID,
//    clientSecret: FACEBOOK_APP_SECRET,
//    callbackURL: "http://localhost:8180/callback"
//  },
//  function(accessToken, refreshToken, profile, done) {
//    // asynchronous verification, for effect...
//    process.nextTick(function () {
//      
//      // To keep the example simple, the user's Facebook profile is returned to
//      // represent the logged-in user.  In a typical application, you would want
//      // to associate the Facebook account with a user record in your database,
//      // and return that user instead.
//      return done(null, profile);
//    });
//  }
//));
app.get('/auth/facebook',
  passport.authenticate('facebook',{ scope: ['user_about_me', 'user_photos', 'email', 'publish_stream']}),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

//app.get('/callback', 
 // passport.authenticate('facebook', { failureRedirect: '/login' }),
 // function(req, res) {
  //  res.redirect('/');
 // });
// Routes for OAuth calls
//app.get('/rockoncall', rockonapi.validate);
app.get('/digestauth', digest.digestapp);
//app.post('/digestauth', digest.digestapp);
app.get('/digestclient', digestclient.digestclient);
app.get('/login', oauth.login);
app.get('/callback', oauth.callback);

app.listen(8180);