var expect = require('chai').expect;
var Server = require(__dirname + '/../src/server');
var Connections = require(__dirname + '/../src/connections');
var utils = require(__dirname + '/../src/utils');

var options = {
    host: 'tcp://127.0.0.1:8888',
    size: 25
};

describe('Server', function() {
    var server = new Server(options);
    server.bind();

    it('should return a client from the pool', function(done) {
        var connections = new Connections(options);
        console.log('size', connections.size());
        expect(connections.size()).to.equal(options.size);
        done();
    });
});