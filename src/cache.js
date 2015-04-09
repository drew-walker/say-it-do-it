var redis = require('redis'),
    url = require('url'),
    redisURL = url.parse(process.env.REDISCLOUD_URL || "http://localhost:6379"),
    client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true}),
    keyPrefix = 'SIDI-cache-';

if (redisURL.auth) client.auth(redisURL.auth.split(":")[1]);

module.exports = {
    set : function(key, value, callback) {
        console.log(value);
        if (typeof value === 'object') client.hmset(keyPrefix + key, value, callback);
        else client.set(keyPrefix + key, value, callback);
    },
    get: function(key, callback) {
        client.hgetall(keyPrefix + key, function(err, value) {
            if (value) {
                callback(err, value);
            } else {
                client.get(keyPrefix + key, function(err, value) {
                    callback(err, value);
                })
            }
        });
    }
};