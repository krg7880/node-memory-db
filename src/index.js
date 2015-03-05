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

var Server = require(__dirname + '/server');
var server = new Server({host: "tcp://127.0.0.1:8009"});
server.bind();
