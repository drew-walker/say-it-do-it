/* autoWireDependencies */
module.exports = function(express, request, require, path) {
    var app = express(),
        self = {};

    self.start = function start(port) {
        self._bindRoutes();

        app.set('port', port);
        app.set('view engine', 'jade');
        app.listen(app.get('port'));

        console.log('Express app listening on %d', port);
    };

    self._bindRoutes = function _bindRoutes() {
        app.get('*',function(req,res,next){
            if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto']!='https')
                res.redirect('https://' + req.hostname + req.url);
            else
                next();
        });

        app.get('/', function(req, res) {
            self._getTemplateData(function(data) {
                res.render('index', data);
            });
        });

        app.use(express.static(path.resolve('./public')));

        app.use('/api/v1/twitter', require('./routes/twitter.js'));
        app.use('/api/v1/hue', require('./routes/hue.js'));
        app.use('/api/v1/firebase', require('./routes/firebase.js'));
    };

    self._getTemplateData = function _getTemplateData(callback) {
        request(process.env.SAYITDOIT_URL + '/api/v1/firebase/url', function(error, response, body) {
            callback({
                constants: {
                    FIREBASE_URL: body
                }
            })
        });
    };

    return self;
};