var express = require('express'),
    request = require('request'),
    router = express.Router(),
    twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY,
    twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET,
    twitterAccessToken;

function getTwitterAccessToken(twitterConsumerKey, twitterConsumerSecret, callback) {
    var authorizationHeader = "Basic " + new Buffer(twitterConsumerKey + ":" + twitterConsumerSecret).toString('base64');

    request({
        method: 'POST',
        url: 'https://api.twitter.com/oauth2/token',
        headers: {
            "Authorization" : authorizationHeader,
            "Content-Type" : "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body : "grant_type=client_credentials"
    }, function(error, response, body) {
        callback(null, JSON.parse(body)["access_token"]);
    });
}

function getLatestTweet(screen_name, callback) {
    request({
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=1&screen_name=' + screen_name,
        headers: {
            "User-Agent" : "SayItDoIt",
            "Authorization" : "Bearer " + twitterAccessToken
        }
    }, function(error, response, body) {
        callback(null, JSON.parse(body)[0].text);
    });
}

router.use(function(req, res, next) {
    if (twitterAccessToken) return next();
    getTwitterAccessToken(twitterConsumerKey, twitterConsumerSecret, function(error, accessToken) {
        twitterAccessToken = accessToken;
        next();
    });
});

router.get('/tweet/:screen_name', function(req, res) {
    getLatestTweet(req.params.screen_name, function(error, tweet) {
        res.send(tweet);
    });
});

module.exports = router;