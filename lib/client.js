'use strict';

var Connections = require(__dirname + '/connections');

var Client = function(options) {
  if (!(this instanceof Client)) {
    return new Client(options);
  }

  this.options = options;
  this.connections = new Connections(options);
};

Client.prototype.send = function(data) {
  this.socket.send(data);
};

Client.prototype.get = function(key, cb) {
  var cmd = 'get:' + key;
  this.connections.get(function(conn) {
    conn.send(cmd, cb);
  });
};

Client.prototype.ping = function(cb) {
  var cmd = 'ping:';
  this.connections.get(function(conn) {
    conn.send(cmd, cb);
  })
}

Client.prototype.put = Client.prototype.set = function(key, data, ttl, cb) {
  var cmd = 'set:' + key + ':' + data + ':' + ttl

  this.connections.get(function(conn) {
    conn.send(cmd, cb);
  });
};

module.exports = Client;