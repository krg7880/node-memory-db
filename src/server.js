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
  this.socket = zmq.socket('router');
  this.socket.identity = 'server_' + process.id;
  this.bind();
}

Server.prototype.bind = function() {
  this.socket.bindSync(this.options.host + ':' + this.options.port);
  this.onBind();
};

Server.prototype.close = function() {
  this.socket.close();
};

Server.prototype.get = function(client, obj) {
  var packet = null;
  var res = cache.get(obj[0]);

  if (typeof(res) === 'undefined') {
    packet = 'error:NOT_FOUND';
  } else {
    packet = 'null:' + res
  }

  this.socket.send([client, packet]);
};

/**
 * 'cmd' + key + ':' + data + ':' + ttl
 */
Server.prototype.put = function(client, data) {

  var packet = null;

  var res = cache.put(data);

  if (!res) {
    packet = "error:Unable to add item to cache:" //+ obj.__id;
  } else {
    packet = "null:1:";
  }

  this.socket.send([client, packet]);
};

Server.prototype.pong = function(client) {
  this.socket.send([client, utils.bufferize("pong")]);
};

Server.prototype.unknownCommand = function(client) {
  this.socket.send([client, util.bufferize(new Error('Unknown command'))]);
};

Server.prototype.onBind = function(e) {
  if (e instanceof Error) {
    throw e;
  }

  var self = this;

  // listen for request from the client
  this.socket.on('message', function(client, data) {
    var split = data.toString().split(':');
    var cmd = split.shift();

    if (cmd === 'get') {
      self.get(client, split);
    } else if (cmd === 'put' || cmd === 'set') {
      self.put(client, split);
    } else if (cmd === 'ping') {
      self.pong(client, split);
    } else {
      self.unknownCommand(client)
    }
  });
}

module.exports = Server;
