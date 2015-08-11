/**
 * Object representation of a
 * cached item.
 *
 * @type {{data: null, ttl: null, accessCount: number}}
 */
var Item = function(data, ttl) {
    this.data = data;
    this.ttl = this.setTTL(ttl);
    this.accessCount = 0;
};

/**
 * Sets the TTL of the item. Note
 * the time needs to be in seconds.
 *
 * @param ttl
 * @returns {Date}
 */
Item.prototype.setTTL = function(ttl) {
    return new Date(new Date().getTime() + (ttl * 1000)).getTime();
};

module.exports = Item;