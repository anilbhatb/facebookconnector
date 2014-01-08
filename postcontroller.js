
var http = require('http');


 
function validate(req, res) {
    console.log('validate being called');
    var dat = JSON.stringify({
        'id': '2', 'token': 'sdjsd'
    });
    var rockonreq = http.request(options, function (rockonres) {
        var msg = '';
        rockonres.setEncoding('utf8');
        rockonres.on('data', function (chunk) {
            msg += chunk;
        });

        rockonres.on('error', function (err) {
            console.log(err);
        });
        rockonres.on('end', function () {
            console.log(msg);
            //  alert('f');
            res.end('true');
        });
    });
    //rockonreq.write(dd);
    rockonreq.end();
}

 function GetPost(req, res) {
	console.log('validate being called');
	var postdata = JSON.stringify({
		'soid': req.body.soid, 'replySoid': req.body.replySoid, 'areRepliesExposed': req.body.areRepliesExposed, 'onNotification': req.body.onNotification, 'replyCountBeforeNotification': req.body.replyCountBeforeNotification
	});
	var options = {
		host: 'localhost',
		port: '52391',
		path: '/Post/GetPost',
		//data: '{"id": "2","token": "sdsd"}',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'dataType': "json",
			'rockonconnector': "secretRockonCode",
			'Content-Length': postdata.length
		}
	};
	var rockonreq = http.request(options, function (rockonres) {
		var msg = '';
		rockonres.setEncoding('utf8');
		rockonres.on('data', function (chunk) {
			msg += chunk;
		});

		rockonres.on('error', function (err) {
			console.log(err);
		});
		rockonres.on('end', function () {
			console.log(msg);
			//  alert('f');
			res.end('true');
		});
	});
	rockonreq.write(dat);
	rockonreq.end();
}
 function GetPostsOnScroll(req, res) {
	console.log('validate being called');
	
	var postdata = JSON.stringify({
		'soid': req.body.soid, 'date': req.body.date
	});
	var options = {
		host: 'localhost',
		port: '52391',
		path: '/Post/GetPostsOnScroll',
		//data: '{"id": "2","token": "sdsd"}',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'dataType': "json",
			'rockonconnector': "secretRockonCode",
			'Content-Length': postdata.length
		}
	};
	var rockonreq = http.request(options, function (rockonres) {
		var msg = '';
		rockonres.setEncoding('utf8');
		rockonres.on('data', function (chunk) {
			msg += chunk;
		});

		rockonres.on('error', function (err) {
			console.log(err);
		});
		rockonres.on('end', function () {
			console.log(msg);
			//  alert('f');
			res.end('true');
		});
	});
	rockonreq.write(dat);
	rockonreq.end();
}
function GetInitialPosts(req, res) {
	//console.log('validate being called');
	var options = {
		host: 'localhost',
		port: '52391',
		path: '/Post/GetInitialPosts',
		//data: '{"id": "2","token": "sdsd"}',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'dataType': "json",
			'rockonconnector': "secretRockonCode",
		
		}
	};
	var rockonreq = http.request(options, function (rockonres) {
		var msg = '';
		rockonres.setEncoding('utf8');
		rockonres.on('data', function (chunk) {
			msg += chunk;
		});

		rockonres.on('error', function (err) {
			console.log(err);
		});
		rockonres.on('end', function () {
			console.log(msg);
			res.end('true');
		});
	});
	
	rockonreq.end();
}

exports.validate = validate;
exports.GetInitialPosts = GetInitialPosts;
exports.GetPostsOnScroll = GetPostsOnScroll;
exports.GetPost = GetPost;