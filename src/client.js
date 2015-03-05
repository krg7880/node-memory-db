var utils = require(__dirname + '/utils');
var zmq = require('zmq');

var Client = function(options) {
  if (!(this instanceof Client)) {
    return new Client(options);
  }

  this.options = options;
  this.socket = zmq.socket('req');
  this.socket.identity = options.identity;
  this.socket.connect(options.host);
  this.socket.on('message', this.onMessage.bind(this));

  process.once('SIGINT', function() {
    this.socket.close();
  }.bind(this));
};

Client.prototype.onMessage = function(data) {};

Client.prototype.send = function(data) {
  this.socket.send(data);
};

Client.prototype.get = function(key) {
  var obj = {
    cmd: 'get'
    ,args: [key]
  };

  this.send(utils.bufferize(obj));
};

Client.prototype.put = Client.prototype.set = function(key, data, ttl) {
  var obj = {
    cmd: 'set'
    ,args: [key, data, ttl]
  };

  this.send(utils.bufferize(obj));
};

Client.prototype.close = function() {
  this.socket.close();
}

module.exports = Client;