var expect = require('chai').expect;
var Server = require(__dirname + '/../src/server');
var Connection = require(__dirname + '/../src/connection');
var zmq = require('zmq');
var utils = require(__dirname + '/../src/utils');
var options = {
    host: 'tcp://127.0.0.1:8888'
};
describe('Server', function() {
    var server = new Server(options);
    server.bind();

    it('should return a client from the pool', function(done) {
        var connection = new Connection(options);
        connection.create(function(e, client) {
            client.send(utils.bufferize({cmd: 'ping'}));
        });
    });
});