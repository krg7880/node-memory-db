var expect = require('chai').expect;
var Server = require(__dirname + '/../src/server');
var Connections = require(__dirname + '/../src/connections');
var connections = null;
var utils = require(__dirname + '/../src/utils');

var options = {
    host: 'tcp://127.0.0.1:3008',
    size: 25
};

describe('Connections', function() {
    console.log(options);
    //var server = new Server(options);
    //server.bind();

    //it('should return a client from the pool', function(done) {
    //    connections = new Connections(options);
    //    expect(connections.size()).to.equal(options.size);
    //    done();
    //});
});