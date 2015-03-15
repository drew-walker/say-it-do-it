var express = require('express'),
    request = require('request'),
    app = express();

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'jade');

function getTemplateData(callback) {
    request(process.env.SAYITDOIT_URL + '/api/v1/firebase/url', function(error, response, body) {
        callback({
            constants: {
                FIREBASE_URL: body
            }
        })
    });
}

app.get('/', function(req, res) {
    getTemplateData(function(data) {
        res.render('index', data);
    });
});

app.use(express.static(__dirname + '/public'));

app.use('/api/v1/twitter', require('./routes/twitter.js'));
app.use('/api/v1/hue', require('./routes/hue.js'));
app.use('/api/v1/firebase', require('./routes/firebase.js'));

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