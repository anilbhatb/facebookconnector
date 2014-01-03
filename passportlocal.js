var express= require('express'),
    passport       = require('passport'), // passportjs
    LocalStrategy = require('passport-local').Strategy; // http digest

// #############################################################################################################

// ----------------
// Environment conf
// ----------------
var app = express();

// configure Express
app.configure(function()
{
    app.use(express.logger());

    app.use(express.methodOverride());
    app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
    // Initialize Passport! Note: no need to use session middleware when each
    // request carries authentication credentials, as is the case with HTTP
    // Digest.

    app.use(app.router);
    app.use(express.static( __dirname + '/public' ));
});

app.configure( 'development', function () { app.use( express.errorHandler( { dumpExceptions: true, showStack: true } ) ); });
app.configure( 'production',  function () { app.use( express.errorHandler() ); } );

// #############################################################################################################

// fake database
var users = [
    { id: 1, username: 'John', password: 'pass',     domain: "http://localhost:2563/", email: 'john@example.com' }
  , { id: 2, username: 'joe',  password: 'birthday', domain: "www.domain.com",         email: 'joe@example.com' }
];

// #############################################################################################################

function findByUsername( username, fn )
{
    for (var i = 0, len = users.length; i &lt; len; i++)
    {
        var user = users[i];
        if (user.username === username) return fn( null, user );
    }
    return fn(null, null);
}

