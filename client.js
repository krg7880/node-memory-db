'use strict';

var settings = require(__dirname + '/lib/config/settings.json');
var Client = require(__dirname + '/lib/client');


var getConnection = function getConnection() {
  var req = settings.req.connection.endpoint;
  return settings[req];
};

var options = getConnection();
options.size = 20; //pool size

var client = new Client(options);

var max = 100000;
var count = 0;

function get() {
	client.ping(function(e, res) {
		if (++count >= max) {
			console.log('ping response', e, res);
			process.exit();
		}
	})
}

client.put('ping', 'pppp', 600, function(e, res) {
	for (var i=0; i<max; i++) {
		get();
	}
});



// var zmq = require('zmq');
// var req = zmq.socket('req');
// var settings = require(__dirname + '/lib/config/settings.json');
// var server = require(__dirname + '/lib')
// var getConnection = function getConnection() {
//   var req = settings.req.connection.endpoint;
//   var config = settings[req];
//   return config.protocol + config.host + config.port; 
// };

// req.connect(getConnection());

// var max = 10000;
// var count = 0;
// req.on('message', function(data) {
// 	if (++count >= max) {
// 		console.log(data.toString('utf8'));
// 		process.exit();
// 	}
// });

// for (var i=0; i<max; i++) {
// 	req.send('Ping');
// }