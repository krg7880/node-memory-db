'use strict';

var Connection = require(__dirname + '/connection');

var _connections = new Map();

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
    this.length = 0;
    this.destroyed = false;

    createConnections.call(this, this.options.size);
}

Connections.prototype.destroy = function() {
    this.destroyed = true;
    var len = this.length;
    for (var i=0; i<len; i++) {
        var connection = this.connections.get(i);
        connection.close();
        _connections(this).delete(i);
        this.length--;
    }
};

Connections.prototype.size = function() {
    return this.length;
};

/**
 * Gets a connection object
 * @returns {Connection}
 */
Connections.prototype.get = function() {
    var len = this.length;
    for (var i=0; i<len; i++) {
        var c = _connections.get(i);
        if (c && !c.used) {
            c.used = true;
            return c;
        }
    }

    createConnections.call(this, 1);
    return this.get();
};

/**
 * Adds the connection object back
 * to the pool or remove it if we
 * have more connections established
 * than the specified size.
 *
 * @param connection
 */
function addToPool(connection) {
    console.log('Add to pool', connection.__id, this.options.size);
    if (connection.__id > this.options.size) {
        console.log('removing connection from pool');
        connection.close();
        _connections.delete(connection.__id);
    } else {
        _connections.get(connection.__id).used = false;
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
    connection.observe(function(connection) {
        addToPool.call(this, connection);
    }.bind(this));
    connection.__id = this.length;
    this.length += 1;
    _connections.set(connection.__id, connection);
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