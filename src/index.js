'use strict';

var Cache = require(__dirname + '/cache');
var cache = new Cache();

// service discovery
// @TODO pass the IP of the host as an option
// parameter
var Discovery = require(__dirname + '/discovery');
var discovery = new Discovery({
    name: 'zhip'
    ,port: 8005
});

var zmq = require('zmq')
var publisher = zmq.socket('pub')
var server = zmq.socket('rep')

server.on('message', function(request) {
    server.send('OK');
    if (pending > 0)
        publisher.send(pending + ' subscribers connected.')
})

server.bind('tcp://*:8888', function(err) {
  if(err)
    console.log(err)
  else
    console.log('Listening on 8888…')
})




//var zerorpc = require("zerorpc");
//var server = new zerorpc.Server({
//    put: function(key, data, ttl, reply) {
//        var res = cache.put(key, data, ttl);
//        if (!res) {
//            return reply(new Error('Item not added to cache!'));
//        }
//
//        reply(null, cache.put(key, data, ttl));
//    },
//
//    get: function(key, reply) {
//        reply(null, n + 42);
//    },
//
//    iter: function(from, to, step, reply) {
//        for(i=from; i<to; i+=step) {
//            reply(null, i, true);
//        }
//
//        reply();
//    }
//});
//
//server.bind("tcp://0.0.0.0:4242");
//server.on("error", function(error) {
//    console.error("RPC server error:", error);
//});