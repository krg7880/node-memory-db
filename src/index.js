'use strict';

var Cache = require(__dirname + '/cache');
var cache = new Cache();
cache.put("1", {name: "kirk"}, 600);

// service discovery
// @TODO pass the IP of the host as an option
// parameter
var Discovery = require(__dirname + '/discovery');
var discovery = new Discovery({
    name: 'zhip'
    ,port: 8005
    ,host: '127.0.0.1'
});

var cluster = require('cluster')
, zmq = require('zmq')
, port = 'tcp://*:8009'
, socket = zmq.socket('rep');

socket.identity = 'server' + process.pid;
socket.bind(port, function(err) {
  if (err) {
    throw err;
  } 

  socket.on('message', function(data) {
    //console.log(socket.identity + ': received ' + data.toString());
    socket.send(1);
  });
});
