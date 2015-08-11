var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');

var max = 100000;
var count = 0;
var data = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
    "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, " +
    "when an unknown printer took a galley of type and scrambled it to make a type "+
    "specimen book. It has survived not only five centuries, but also the leap into "+
    "electronic typesetting, remaining essentially unchanged. It was popularised in the "+
    "1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more "
    "recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

data += data += data += data += data += data += data += data += data += data += data += data;

data = 'ping';

function get() {
    memcached.get("key", function(e, n) {
        if (++count >= max) {
            //console.log('done', e, n);
            process.exit();
        }
    });
}

memcached.set('key', data, 600, function() {
	get();
});