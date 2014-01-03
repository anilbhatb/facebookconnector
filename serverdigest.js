var express = require('express')
  
  , rockonapi = require('./validatetoken')
  , digestclient = require('./digestclient')
  , oauth = require('./oauth')
  , passport = require('passport')
  , app = express()
  , digest = require('./digestapp')
  , qs = require('qs')
    DigestStrategy = require('passport-http').DigestStrategy // http digest
// Setup middleware
app.use(express.static(__dirname));
app.use(express.bodyParser());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);


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
    { id: 1, username: 'John', password: 'pass', domain: "http://localhost:8180/", email: 'john@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', domain: "http://localhost:8180/", email: 'joe@example.com' }
];

// #############################################################################################################

function findByUsername(username, fn) {
    console.log('inside findusername');
    for (var i = 0, len = users.length; i < len; i++) {
        console.log('inside for loop: '+ username);
        var user = users[i];
        if (user.username === username) {
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
                if (done)
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
                console.log('something wrong here');
                console.log(done);
                //if (done)
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
      console.log('1');
      res.redirect("/");
  });

  console.log('2');
//app.get('/callback', 
 // passport.authenticate('facebook', { failureRedirect: '/login' }),
 // function(req, res) {
  //  res.redirect('/');
 // });
// Routes for OAuth calls
//app.get('/rockoncall', rockonapi.validate);
app.get('/login', oauth.login);
app.get('/callback', oauth.callback);

app.listen(8180);