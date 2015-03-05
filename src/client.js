var zmq = require('zmq');
var numClients = 1;
var maxRequests = 10000;
var clients = [];
var i=0;
var host = "tcp://127.0.0.1:8009"
var count = 0;
process.setMaxListeners(10000);

function bufferize(data) {
  var str = typeof data !== 'string' ? JSON.stringify(data) : data;
  var buffer = new Buffer(Buffer.byteLength(str));
  buffer.write(str);

  return buffer;
}

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
    console.log('client:data', data.toString());
    process.exit();
  }
};

Client.prototype.send = function(data) {
  this.socket.send(data);
};

Client.prototype.get = function(key) {
  var obj = {
    cmd: 'get'
    ,args: [key]
  };

  this.send(bufferize(obj));
};

Client.prototype.put = Client.prototype.set = function(key, data, ttl) {
  var obj = {
    cmd: 'set'
    ,args: [key, data, ttl]
  };

  this.send(bufferize(obj));
};
 

for (i; i<numClients; i++) {
  var c = new Client({
    identity: 'client_' + i
    ,host: host
  });
  clients.push(c);
}

var data = "1";

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
  clients[getIdx()].get(data);
}