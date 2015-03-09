'use strict';

var utils = require(__dirname + '/utils');
var zmq = require('zmq');

function fn() {
    console.log('Default observer called!');
};

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
    this.socket = zmq.socket('req');
    this.socket.identity = options.identity || ('client_' + process.id);
    this.socket.connect(options.host);
    this.socket.on('message', this.onMessage.bind(this));
    this.observer = options.observer || fn;

    //process.once('SIGINT', function() {
    //    this.socket.close();
    //}.bind(this));
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
    if (data.error) {
        this.callback(data.error);
        return
    }

    this.callback(null, data.results);
    this.observer(this);
};

Connection.prototype.send = function(data, cb) {
    this.callback = cb;
    this.socket.send(data);
};

Connection.prototype.close = function() {
    this.socket.close();
};

module.exports = Connection;
