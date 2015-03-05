var redis = require("redis");
var client = redis.createClient();
var max = 10000;
var i = 0;
client.set("foooooo", new Buffer(JSON.stringify({cmd: 'get', key: '1'})));

var _res = null;
var cb = function(e, res) {
    console.log(res);
    _res = res;
    if (i >= max) {
        process.exit();
        console.log('args', arguments);
    }
};

for (i=0; i<max; i++) {
    //process.nextTick(function() {
        client.get("foooooo", cb);
   // });
}
