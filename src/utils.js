exports.stringify = function(val) {
  var str = '';
  if (typeof (val) === 'object') {
      str = JSON.stringify(val);
  } else if (typeof (val) === 'number') {
      str = '' + val;
  } else if (typeof (val) === 'function') {
      str = val.toString();
  }

  return str;
};

exports.bufferize = function bufferize(data) {
  var str = exports.stringify(data);
  var buffer = new Buffer(Buffer.byteLength(str));
  buffer.write(str);
  return buffer;
};