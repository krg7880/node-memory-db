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

    this.options = options;
    this.apps = polo();
    this.peers = [];
    this.bind();
    this.announce();
};

Discovery.prototype.bind = function() {
    this.apps.once('up', function(name, service) {
        if (this.apps.get(host) !== this.options)
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