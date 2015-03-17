var Client = require(__dirname + '/src/client');
var Server = require(__dirname + '/src/server');

var options = { host: '127.0.0.1', port: 8889, size: 10 };

var server = new Server(options);
var client = new Client(options);
var max = 100000;
var count = 0;

function get() {
    client.get("name", function(e, n) {
        if (++count >= max) {
            //console.log('done', e, n);
            process.exit();
        }
    });
}

var data = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
    "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
    "when an unknown printer took a galley of type and scrambled it to make a type "+
    "specimen book. It has survived not only five centuries, but also the leap into "+
    "electronic typesetting, remaining essentially unchanged. It was popularised in the "+
    "1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more "
    "recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

data += data += data += data += data += data += data += data += data += data += data += data;

//setTimeout(function() {
    client.set("name", data, 600, function(e, res) {
       // console.log('SET')
        for (var i=0; i<max; i++) {
            get();
        }
    });
//}, 2000);