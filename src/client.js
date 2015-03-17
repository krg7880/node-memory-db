var Connections = require(__dirname + '/connections');
var utils = require(__dirname + '/utils');

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
  var obj = {
    cmd: 'get'
    ,args: [key]
  };

  this.connections.get(function(conn) {
    conn.send(utils.bufferize(obj), cb);
  });
};

Client.prototype.put = Client.prototype.set = function(key, data, ttl, cb) {
  var obj = {
    cmd: 'set'
    ,args: [key, data, ttl]
  };

  this.connections.get(function(conn) {
    conn.send(utils.bufferize(obj), cb);
  });
};

module.exports = Client;