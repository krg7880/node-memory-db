var expect = require('chai').expect;
var Server = require(__dirname + '/../src/server');
var options = require(__dirname + '/options');
var zmq = require('zmq');
var utils = require(__dirname + '/../src/utils');

describe('Server', function() {
  var server = new Server(options);
  server.bind();

  it('should be running', function(done) {
    var client = zmq.socket('req');
    client.identity = 'client_' + process.id;
    client.connect(options.host);
    client.on('message', function(data) {
      expect(data.toString()).to.equal('pong');
      client.close();
      server.close();
      done();
    });

    client.send(utils.bufferize({cmd: 'ping'}));
  });
});