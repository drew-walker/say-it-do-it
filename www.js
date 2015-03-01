var express = require('express'),
    request = require('request'),
    app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var twitter = require('./routes/twitter.js'),
    hue = require('./routes/hue.js');

app.use('/api/v1/twitter', twitter);
app.use('/api/v1/hue', hue);

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