var Client = require(__dirname + '/src/client');
var Server = require(__dirname + '/src/server');

var options = { host: 'inproc://router.ipc', port: 8889, size: 50 };

var server = new Server(options);
var client = new Client(options);
var max = 100000;
var count = 0;

function get() {
    client.get("name", function(e, n) {
    	//console.log(e, n);
        if (++count >= max) {
            process.exit();
        }
    });
}

var data = "ping"

//data += data += data += data += data += data += data += data += data += data += data += data;

//data = 'foo'
client.set("name", data, 600, function(e, res) {
    for (var i=0; i<max; i++) {
        get();
    }
});