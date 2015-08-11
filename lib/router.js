'use strict';

var settings = require(__dirname + '/config/settings.json');
var zmq = require('zmq');

var Router = function() {
  if (! (this instanceof Router)) {
    return new Router();
  }

  this.router = null;
  this.dealer = null;
};

Router.prototype.setDealer = function setDealer(dealer) {
  this.dealer = dealer;
};

Router.prototype.connect = function connect() {
  var connection = this.getConnection();

  this.router = zmq.socket('router').bindSync(connection); 
  this.router.on('message', this.onMessage.bind(this));
};

Router.prototype.getConnection = function getConnection() {
  return settings.router.protocol + settings.router.host + settings.router.port; 
};

Router.prototype.onMessage = function onMessage() {
  this.dealer.send(Array.prototype.slice.call(arguments));
};

module.exports = Router;