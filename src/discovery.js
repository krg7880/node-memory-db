'use strict';

var polo = require('polo');
var apps = polo();

var Discovery = function(options) {
    if (!(this instanceof Discovery)) {
        return new Discovery(name, ready);
    }

    if (typeof (options) === 'undefined') {
        throw new Error('Invalid configuration provided!');
    }

    if (typeof (options.host) === 'undefined') {
        throw new Error('Please specify the IP this server is bound to');
    }

    if (typeof (options.name) === 'undefined') {
        throw new Error('Please specify a name for this service');
    }

    if (typeof (options.port) === 'undefined') {
        throw new Error('Please specify a port to bind to');
    }

    this.options = options;
    this.apps = polo();
    this.peers = [];
    this.bind();
    this.announce();
};

Discovery.prototype.bind = function() {
    var self = this;
    this.apps.once('up', function(name, service) {
        if (self.apps.get('host') !== self.options.host)
        console.log(apps.get(name));
    });
};

Discovery.prototype.announce = function() {
    this.apps.put({
        name: this.options.name,
        port: this.options.port,
        mulicast: false
    });
};

module.exports = Discovery;