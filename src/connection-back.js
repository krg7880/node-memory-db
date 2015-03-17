'use strict';

var utils = require(__dirname + '/utils');
var zmq = require('zmq');

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
    this.socket.connect(options.host);
    this.observer = options.observer || fn;
    this.__id = null;
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

Connection.prototype.onMessage = function(data) {

    data = JSON.parse(data.toString());

    this.callback(data.error, data.results);

    // notify the observer so this client
    // can be added or removed from the pool
    this.observer(this);
};

Connection.prototype.send = function(data, cb) {
    this.callback = cb;
    this.socket.send(data);
};

Connection.prototype.close = function() {
    console.log('Connection closed');
    this.socket.close();
};

Connection.prototype.onBind = function() {
    //console.log('Bound');
}

module.exports = Connection;
