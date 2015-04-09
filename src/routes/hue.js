/* autoWireDependencies */
module.exports = function(express) {
    var router = express.Router(),
        Hue = require('philips-hue-api'),
        hue = Hue(process.env.HUE_USERNAME, process.env.HUE_EMAIL, process.env.HUE_PASSWORD);
//router.get('/lights/:id/brighten', function(req, res) {
//    var lightIdentifier = isNaN(req.params.id) ? getLightNameFromSlug(req.params.id) : +req.params.id;
//
//    hue.authenticate().then(function(lights) {
//        lights(lightIdentifier).then(function(light) {
//            console.log(light.state);
//            //    var currentOnState = result.state.on,
//            //        currentBrightness = result.state.bri;
//            //
//            //    var newBrightness = Math.floor(255 *  0.25);
//            //    if (currentOnState === true) newBrightness = Math.min(Math.floor(currentBrightness + (255 * 0.25)), 255);
//            //
//            //    lights(lightIdentifier).brightness(newBrightness);
//            //
//            //    res.sendStatus(200);
//        });
//    })
//});

//router.get('/lights/:id/darken', function(req, res) {
//    var lightIdentifier = isNaN(req.params.id) ? getLightNameFromSlug(req.params.id) : +req.params.id;
//
//    hue.authenticate().then(function(lights) {
//        lights(lightIdentifier).getState(function(error, result) {
//            var currentOnState = result.state.on,
//                currentBrightness = result.state.bri;
//
//            if (currentOnState === false) {
//                res.sendStatus(200);
//            } else {
//                var newBrightness = Math.max(Math.floor(currentBrightness - (255 * 0.25)), 0);
//
//                if (newBrightness === 0) {
//                    lights(lightIdentifier).off();
//                } else {
//                    lights(lightIdentifier).brightness(newBrightness);
//                }
//
//                res.sendStatus(200);
//            }
//        });
//    });
//});

    function getLightNameFromSlug(slug) {
        return slug.replace(/-/g, ' ');
    }

    router.get('/lights/:id/on', function(req, res) {
        var lightIdentifier = isNaN(req.params.id) ? getLightNameFromSlug(req.params.id) : +req.params.id;

        hue.authenticate().then(function(lights) {
            lights(lightIdentifier).on();
            res.sendStatus(200);
        });
    });

    router.get('/lights/:id/off', function(req, res) {
        var lightIdentifier = isNaN(req.params.id) ? getLightNameFromSlug(req.params.id) : +req.params.id;

        hue.authenticate().then(function(lights) {
            lights(lightIdentifier).off();
            res.sendStatus(200);
        });
    });

    return router;
};