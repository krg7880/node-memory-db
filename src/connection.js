'use strict';

var utils = require(__dirname + '/utils');
var zmq = require('zmq');
var Parser = require('binary-parser').Parser;

function fn() {
    console.log('Default observer called!');
};

var ids = 0;

/**
 * Connection object which
 * establishes a connection
 * to the cache server
 * @constructor
 */
function Connection(options) {
    if (!(this instanceof Connection)) {
        return new Connection(options);
    }

    this.options = options;
    this.socket = zmq.socket('dealer');
    this.socket.identity = options.identity || ('client_' + (++ids));
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.connect(options.host + ':' + options.port);
    this.observer = options.observer || fn;
    this.callback = null;
}

/**
 * Add an observer that will be invoked
 * after we receive a message from the server.
 *
 * @param observer
 * @returns {Connection}
 */
Connection.prototype.observe = function(observer) {
    this.observer = observer;
    return this;
};

var count = 0;
Connection.prototype.onMessage = function(data) {
    var results = data.toString().split(':');
    // data = JSON.parse(data.toString());
    var e = results[0];
    if (e !== 'null') {
        e = new Error(e);
    }
    
    this.callback(e, results[1]);

    // notify the observer so this client
    // can be added or removed from the pool
    this.observer(this);
};

Connection.prototype.send = function(data, cb) {
    this.callback = cb || fn;
    this.socket.send(data);
};

Connection.prototype.close = function() {
    this.socket.close();
};

Connection.prototype.onBind = function() {
    //console.log('Bound');
}

module.exports = Connection;
