'use strict';

var Connection = require(__dirname + '/connection');

/**
 * Maintains a pool of active
 * connections to the cache server.
 *
 * @param options
 * @returns {Connection}
 * @constructor
 */
function Connections(options) {
    if (!(this instanceof Connection)) {
        return new Connection(options);
    }

    if (typeof (options) === 'undefined') {
        throw new Error('Invalid configuration options provided!');
    }

    if (!options.host) {
        throw new Error('Please specify a host to connect to!');
    }

    this.options = options;
    this.connections = [];
    this.length = 0;

    createConnections.call(this, this.options.size);
}

/**
 * Gets a connection object
 * @returns {Connection}
 */
Connections.prototype.get = function() {
    var len = this.connections.length;
    for (var i=0; i<len; i++) {
        var c = this.connections[i];
        if (!c.used) {
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
    if (connection.id > this.options.size) {
        connection.close();
        this.connections.splice(connection.id, 1);
    } else {
        this.connections[connection.id].used = false;
    }
}

/**
 * Creates a new connection and adds it to the
 * pool.
 *
 * @param idx
 */
function createConnection(idx) {
    var connection = new Connection(this.options.config);
    connection.id = idx;
    connection.observe(function(connection) {
       addToPool.call(this, connection);
    }.bind(this));
    this.connections.push(connection);
    this.length +=1;
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