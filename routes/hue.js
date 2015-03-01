var express = require('express'),
    Hue = require('philips-hue-api'),
    hue = Hue(process.env.HUE_API_URL),
    router = express.Router();

router.get('/lights/:id/brighten', function(req, res) {
    hue.lights(req.params.id).state(function(error, result) {
        var currentOnState = result.state.on,
            currentBrightness = result.state.bri;

        var newBrightness = Math.floor(255 *  0.25);
        if (currentOnState === true) newBrightness = Math.min(Math.floor(currentBrightness + (255 * 0.25)), 255);

        hue.lights(3).state({ "on" : true, "bri" : newBrightness }, function(error, result) {
            res.send(result);
        });
    });
});

router.get('/lights/:id/darken', function(req, res) {
    hue.lights(req.params.id).state(function(error, result) {
        var currentOnState = result.state.on,
            currentBrightness = result.state.bri;

        if (currentOnState === false) {
            res.send('');
        } else {
            var newBrightness = Math.max(Math.floor(currentBrightness - (255 * 0.25)), 0);

            if (newBrightness === 0) {
                hue.lights(3).off(function(error, result) {
                    res.send(result);
                });
            } else {
                hue.lights(3).state({ "on" : true, "bri" : newBrightness }, function(error, result) {
                    res.send(result);
                });
            }
        }
    });
});

router.get('/lights/:id/on', function(req, res) {
    hue.lights(req.params.id).on(function(error, result) {
        res.send(result);
    });
});

router.get('/lights/:id/off', function(req, res) {
    hue.lights(req.params.id).off(function(error, result) {
        res.send(result);
    });
});

module.exports = router;