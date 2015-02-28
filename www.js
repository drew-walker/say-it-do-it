var express = require('express'),
    request = require('request'),
    app = express();

app.set('port', (process.env.PORT || 3000));

var twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
var twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
var twitterAccessToken;

getTwitterAccessToken(twitterConsumerKey, twitterConsumerSecret, function(error, accessToken) {
    twitterAccessToken = accessToken;
});

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

app.use(express.static(__dirname + '/public'));

app.get('/api/v1/tweet/:screen_name', function(req, res) {
    getLatestTweet(req.params.screen_name, function(error, tweet) {
        console.log(tweet);
        res.send(tweet);
    });
});

app.listen(app.get('port'));

//var fs = require('fs'),
//    https = require('https'),
//    privateKey = fs.readFileSync('./ssl/key.pem').toString(),
//    certificate = fs.readFileSync('./ssl/cert.pem').toString();

//https.createServer({
//    key: privateKey,
//    cert: certificate
//}, app).listen(443, function() {
//    console.log("Express server listening on port " + 443);
//});