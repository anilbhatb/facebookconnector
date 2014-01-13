
var http = require('http');
var restify = require('restify');
var redis = require('redis');

var redismodule = require('./redismodule');
/*http.createServer(function (req, res) {
 
//if (req.method==="PUT" || req.method==="POST") {
  var body = "";
  req.on("data", function(data){ body += data; });
  req.on("end", function(){ return routeCall(req, res, body); });
} else
  routeCall(req, res, "");
 //res.writeHead(200, {'Content-Type': 'text/plain'});
  //res.end('Hello Node.js\n');
 }).listen(8124,"127.0.0.1");
*/


var SERVER_PORT = 8080;
 
var restify = require('restify');
var server = restify.createServer();
 

 
var respond_record = function(req,res,next) {
   
    req.data = '';
    req.on('data', function(chunk) {
       req.data +=chunk;
     });
    req.on('end', function(chunk) {
         console.log(req.data );
         var splitstring =  req.data.split(":;:");
         if(splitstring.length <2)
               return;
         var requested_value = splitstring[1];
         var  requested_key =  splitstring[0];
         if(req.params.replac == "true" || req.params.replac == "True")
         {
             client.set(requested_key,requested_value);
	     console.log("call to string set");
  	 }
  	 else
  	 {
	    client.sadd(requested_key,requested_value);
	    console.log("call to  set add ");
  	 }
	 console.log("after setting the key");
	 res.send("true");    
     });

  //console.log("successfully read key value:" + requested_key+ "value:"+requested_value + "replace: "+ isreplace);
  
  // Check if they are requesting our example record
/*    if(example_record.user_id == requested_id) {
        // Send back the full record
        res.send(example_record);
    } else {
        // Return an error
        next(new Error("Invalid user ID specified"));
    }
*/
}
 
var server_up = function() {
    console.log("Example REST webservice running on " + server.url);
}
 client = redis.createClient(); 
 client.on("error", function (err) { 
  console.log("Error connecting to redis server:" + err);
    });
console.log("connection created");

// We setup the routes to specify how requests to the server will be handled
// In this case we are going to listen for user ID requests and user ID + attribute requests
server.post("/:key/:value/:replac",respond_record);
server.listen(SERVER_PORT, server_up);
 console.log('Server running'); 
