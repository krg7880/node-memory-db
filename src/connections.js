'use strict';

var Connection = require(__dirname + '/connection');

var LinkedList = require(__dirname + '/linkedlist');

var _connections = new LinkedList();
var _queue = new LinkedList();

/**
 * Maintains a pool of active
 * connections to the cache server.
 *
 * @param options
 * @returns {Connections}
 * @constructor
 */
function Connections(options) {
    if (!(this instanceof Connections)) {
        return new Connections(options);
    }

    if (typeof (options) === 'undefined') {
        throw new Error('Invalid configuration options provided!');
    }

    if (!options.host) {
        throw new Error('Please specify a host to connect to!');
    }

    this.options = options;
    createConnections.call(this, this.options.size);
}

Connections.prototype.destroy = function() {
    while (!_connections.isEmpty()) {
        var connection = _connections.shift();
        connection.close();
        connection = null;
    }
};

Connections.prototype.size = function() {
    return _connections.size();
};

/**
 * Gets a connection object
 * @returns {Connection}
 */
Connections.prototype.get = function(fn) {
    if (!_connections.isEmpty()) {
        return fn(_connections.shift());
    }

    _queue.push(fn);
};

function onObserve(connection) {
    _connections.push(connection);

    if (!_queue.isEmpty()) {
        var cb = _queue.shift();

        cb(_connections.shift());
    }
}

/**
 * Creates a new connection and adds it to the
 * pool.
 *
 * @param idx
 */
function createConnection() {
    var connection = new Connection(this.options);

    connection.observe(onObserve.bind(this));

    _connections.push(connection);
}

/**
 * Creates n number of connections
 * @param size
 */
function createConnections(size) {
    for (var i=0; i<size; i++) {
        createConnection.call(this, i);
    }
}

module.exports = Connections;