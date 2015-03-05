'use strict';

const _private = new require(__dirname + '/private')();
const Item = require(__dirname + '/item');

/**
* Default cache size to use which
* is 20 Megabytes.
*
* @type {Number} Bytes
*/
const DEFAULT_CACHE_SIZE = 20000000;

var map = new Map();

/**
* LRUCache
* @constructor
* @param {Number} size Cache size in bytes
*/
var LRUCache = function(size) {
  if (!(this instanceof LRUCache)) {
      return new LRUCache(size);
  }

  _private(this)._maxCacheSize = size || DEFAULT_CACHE_SIZE;
  _private(this)._length = 0;
  _private(this)._cacheSize = 0;
};

/**
* Creates a new Cache item.
*
* @param item
* @param ttl
* @returns {Item}
*/
LRUCache.prototype.createItem = function(item, ttl) {
  return new Item(item, ttl);
};

LRUCache.prototype.replaceLRU = function(key, item, ttl) {
  var keys = Object.keys(map);
  var len = keys.length;
  var _key = null;
  var count = 0;

  for (var i=0; i<len; i++) {
      var c = map[keys[i]].count;
      if (!count || c < count) {
          count = c
          _key = keys[i];
      }
  }

  if (_key) {
      map.delete(_key);
  }

  map.set(key, this.createItem(item, ttl));
}


/**
* Adds an item to the cache if it doesn't
* already exists
*
* @type {Function}
*/
LRUCache.prototype.put = LRUCache.prototype.set = function(key, item, ttl) {
  if (map.has(key)) {
      return;
  }

  if (this.isFull()) {
      return this.replaceLRU(key, item, ttl);
  }

  var data = this.createItem(item, ttl);

  map.set(key, data);
  this.updateCacheSize(data);
  this._length += 1;
  return true;
};

/**
* Returns an item from the cache if it exists.
*
* @param key
* @returns {*}
*/
LRUCache.prototype.get = function(key) {
  var item = map.get(key);

  if (!item) return null;
  item.accessCount += 1;

  return item;
};

/**
 * Deletes a key from the cache if it 
 * exists.
 */
LRUCache.prototype.delete = function(key) {
  return map.delete(key);
};

/**
* Get the size of the item in bytes
*
* @param {Mized} item
* @returns {Number}
*/
LRUCache.prototype.getItemSize = function(item) {
  var str = item;

  if (typeof (item) === 'object') {
      str = JSON.stringify(item);
  } else if (typeof (item) === 'number') {
      str = '' + item;
  } else if (typeof (item) === 'function') {
      str = item.toString();
  }

  return Buffer.byteLength(str);
};

/**
* Returns the current size of the cache.
*
* @returns {number} Size of the cache in bytes
*/
LRUCache.prototype.getCacheSize = function() {
  return this._cacheSize;
};

/**
* Gets the max cache size in bytes
* @returns {Number|*}
*/
LRUCache.prototype.getMaxCacheSize = function() {
  return this._maxCacheSize;
};

/**
* Updates the cache size.
*
* @param size
*/
LRUCache.prototype.updateCacheSize = function(data) {
  var size = this.getItemSize(data);
  this._cacheSize += size;
};

/**
* Checks if the cache is at max capacity.
*
* @returns {boolean}
*/
LRUCache.prototype.isFull = function() {
  return this.getCacheSize() >= this.getMaxCacheSize();
}

/**
* Returns the current timestamp
* @returns {number}
*/
LRUCache.prototype.now = function() {
  return new Date().getTime();
};

/**
* Checks if an item is expired in
* the cache.
*
* @param {Mixed} item
* @returns {boolean}
*/
LRUCache.prototype.expired = function(item) {
  return (item && (item.ttl < this.now()));
};

/**
* Checks if an item exists in the cache
*
* @param {String} key
* @returns {*|boolean}
*/
LRUCache.prototype.exists = function(key) {
  var item = map.get(key);
  return (item && !this.expired(item));
};

LRUCache.prototype.size = function() {
  return this._length;
};

module.exports = LRUCache;

