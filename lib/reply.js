'use strict';

var Cache = require(__dirname + '/cache');
var cache = new Cache();
var settings = require(__dirname + '/config/settings.json');
var zmq = require('zmq');

var Reply = function Reply() {
  if (! (this instanceof Reply)) {
    return new Reply();
  }

  this.socket = null;
};

Reply.prototype.connect = function connect() {
  this.socket = zmq.socket('rep').connect(this.getConnection());
  this.socket.on('message', this.onMessage.bind(this));
};

Reply.prototype.getConnection = function getConnection() {
  var rep = settings.rep.connection.endpoint;
  var config = settings[rep];
  return config.protocol + config.host + config.port; 
};

Reply.prototype.onMessage = function onMessage(data) {
  var split = data.toString().split(':');
  var cmd = split.shift();

  if (cmd === 'get') {
    this.get(split);
  } else if (cmd === 'put' || cmd === 'set') {
    this.put(split);
  } else if (cmd === 'ping') {
    this.pong();
  } else {
    this.unknownCommand();
  }
};

Reply.prototype.get = function(obj) {
  var packet = null;
  var res = cache.get(obj[0]);

  if (typeof(res) === 'undefined') {
    packet = 'error:NOT_FOUND';
  } else {
    packet = 'null:' + res
  }

  this.socket.send(packet);
};

/**
 * 'cmd' + key + ':' + data + ':' + ttl
 */
Reply.prototype.put = function(data) {

  var packet = null;

  var res = cache.put(data);

  if (!res) {
    packet = "Unable to add item to cache:" //+ obj.__id;
  } else {
    packet = "null:true";
  }

  this.socket.send(packet);
};

Reply.prototype.pong = function() {
  this.socket.send("null:pong");
};

Reply.prototype.unknownCommand = function() {
  this.socket.send('Unknown command:');
};


module.exports = Reply;