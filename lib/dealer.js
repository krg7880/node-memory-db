'use strict';

var settings = require(__dirname + '/config/settings.json');
var zmq = require('zmq');

var Dealer = function() {
  if (! (this instanceof Dealer)) {
    return new Dealer();
  }

  this.router = null;
  this.dealer = null;
};

Dealer.prototype.setRouter = function setRouter(router) {
  this.router = router;
};

Dealer.prototype.connect = function connect() {
  this.dealer = zmq.socket('dealer').bindSync(this.getConnection()); 
  this.dealer.on('message', this.onMessage.bind(this));
};

Dealer.prototype.getConnection = function getConnection() {
  return settings.dealer.protocol + settings.dealer.host + settings.dealer.port; 
};

Dealer.prototype.onMessage = function onMessage() {
  this.router.send(Array.prototype.slice.call(arguments));
};

module.exports = Dealer;