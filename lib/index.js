'use strict';

var zmq = require('zmq')
var settings = require(__dirname + '/config/settings.json');
var cluster = require('cluster');
var Dealer = require(__dirname + '/dealer');
var Router = require(__dirname + '/router');
var Reply = require(__dirname + '/reply');

if (cluster.isMaster) {
	var router = new Router();
	var dealer = new Dealer();

	router.connect();
	dealer.connect();

	router.setDealer(dealer.dealer);
	dealer.setRouter(router.router);

	for (var i = 0; i < 4; i++) {
	    cluster.fork();
	}
} else {
	var reply = new Reply();
	reply.connect();
}