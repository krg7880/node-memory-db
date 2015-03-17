var expect = require('chai').expect;
var Server = require(__dirname + '/../src/server');
var Client = require(__dirname + '/../src/Client');

var options = {
    host: 'tcp://127.0.0.1:3009',
    size: 25
};

var client = new Client(options);

describe('Connections', function() {
    it('should have 25 connections', function() {
        expect(client.connections.size()).is.equal(options.size);
    });

    it('should add an item to the cache', function(done) {
        client.set('name', "Kirk", 600, function() {
            console.log('Set');
            client.get('name', function(e, res) {
                assert(res).is.equal("kirk");
                done();
            });
        });
    });
});