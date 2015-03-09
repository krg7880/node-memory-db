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
  var obj = {
    cmd: 'get'
    ,args: [key]
  };

  var connection = this.connections.get();
  connection.send(utils.bufferize(obj), cb);
};

Client.prototype.put = Client.prototype.set = function(key, data, ttl, cb) {
  var obj = {
    cmd: 'set'
    ,args: [key, data, ttl]
  };

  var connection = this.connections.get();
  connection.send(utils.bufferize(obj), cb);
};

module.exports = Client;