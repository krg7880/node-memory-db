var zmq = require('zmq');
var numClients = 40;
var maxRequests = 100000;
var clients = [];
var i=0;
var host = "tcp://127.0.0.1:8009"
var count = 0;
process.setMaxListeners(10000)

var Client = function(options) {
  if (!(this instanceof Client)) {
    return new Client(options);
  }

  this.socket = zmq.socket('req');
  this.socket.identity = options.identity;
  this.socket.connect(options.host);
  this.socket.on('message', this.onMessage.bind(this));

  process.once('SIGINT', function() {
    console.log('Closing connection');
    this.socket.close();
  }.bind(this));
};

Client.prototype.onMessage = function(data) {
  if (++count >= maxRequests) {
    console.log('client:data', data);
    process.exit();
  }
};

Client.prototype.send = function(data) {
  this.socket.send(data);
};
 

for (i; i<numClients; i++) {
  var c = new Client({
    identity: 'client_' + i
    ,host: host
  });
  clients.push(c);
}

var json = JSON.stringify({name: 'kirk'});
var data = new Buffer(Buffer.byteLength(json));
data.write(json);

var cur = -1;
var getIdx = function() {
  if (++cur < numClients) {
    return cur;
  } else {
    cur = 0;
  }

  return cur;
}

for (var j=0; j<maxRequests; j++) {
  clients[getIdx()].send(data);
}