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
  this.socket.bindSync(this.options.host);
  this.onBind();
};

Server.prototype.close = function() {
  this.socket.close();
};

Server.prototype.get = function(client, obj) {
  var packet = null;

  var res = cache.get(obj.args[0]);

  if (typeof(res) === 'undefined') {
    packet = utils.bufferize({error: new Error("Item not found"), results: null, id: obj.__id});
  } else {
    packet = utils.bufferize({error: null, results: res,  id: obj.__id});
  }

  this.socket.send([client, packet]);
};

Server.prototype.put = function(client, obj) {
  var packet = null;
  var res = cache[obj.cmd].apply(cache, obj.args);

  if (!res) {
    packet = utils.bufferize({error: new Error("Unable to add item to cache"), results: null, id: obj.__id});
  } else {
    packet = utils.bufferize({error: null, results: true,  id: obj.__id});
  }

  this.socket.send([client, packet]);
};

Server.prototype.pong = function(client) {
  this.socket.send([client, utils.bufferize( "pong")]);
};

Server.prototype.unknownCommand = function(client) {
  this.socket.send([client, util.bufferize(new Error('Unknown command'))]);
};

Server.prototype.onBind = function(e) {
  if (e instanceof Error) {
    throw e;
  }

  // listen for request from the client
  this.socket.on('message', function(client, data) {
    var obj = JSON.parse(data.toString());

    if (obj.cmd === 'get') {
      this.get(client, obj);
    } else if (obj.cmd === 'put' || obj.cmd === 'set') {
      this.put(client, obj);
    } else if (obj.cmd === 'ping') {
      this.pong(client, obj);
    } else {
      this.unknownCommand(client)
    }
  }.bind(this));
}

module.exports = Server;
