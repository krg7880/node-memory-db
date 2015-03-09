'use strict';

var zmq = require('zmq');
var utils = require(__dirname + '/utils');
var Cache = require(__dirname + '/cache');
var cache = new Cache();

function Server(options) {
  if (!(this instanceof Server)) {
    return new Server(options);
  }

  this.options = options;
  this.socket = zmq.socket('rep');
  this.socket.identity = 'server_' + process.id;
}

Server.prototype.bind = function() {
  this.socket.bind(this.options.host, this.onBind.bind(this));
};

Server.prototype.close = function() {
  this.socket.close();
};

Server.prototype.onBind = function(e) {
  if (e instanceof Error) {
    throw e;
  }

  // listen for request from the client
  this.socket.on('message', function(data) {
    var obj = JSON.parse(data.toString());
    switch(obj.cmd) {
      case 'get':
        var res = cache.get.apply(cache, obj.args);
        process.nextTick(function() {
          this.socket.send(utils.bufferize(res));
        }.bind(this));
        break;

      case 'put':
      case 'set':
        var res = cache[obj.cmd].apply(cache, obj.args);
        process.nextTick(function() {
          this.socket.send(utils.bufferize(res));
        }.bind(this));
        break;

      case 'ping':
        process.nextTick(function() {
          this.socket.send("pong");
        }.bind(this));
        break;
    }
  }.bind(this));
}

module.exports = Server;
